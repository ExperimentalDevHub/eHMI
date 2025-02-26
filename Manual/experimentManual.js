console.log("ExperimentManual.js - The Real Final Version");

// Ensure YouTube API loads before running the experiment
if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Global function for YouTube API
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Loaded");
}

// Generate or retrieve a unique participant ID
function getParticipantID() {
    let participantID = localStorage.getItem("participantID");

    if (!participantID || participantID.length > 6) {
        participantID = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem("participantID", participantID);
    }

    return participantID;
}

// Run experiment
document.addEventListener("DOMContentLoaded", function () {
    let jsPsych = initJsPsych();
    let timeline = [];
    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbypG7XgkVT1GEV55kzwEt5K5hjxmVPdwWg35zHWyRtOKrXnkyXJaO0e-t3eGy68x7PI5g/exec";
    let participantID = getParticipantID();
    let experimentData = [];

    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
                <h2 style="font-size: 36px;">Welcome to the eHMI Experiment</h2>
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this experiment, you will be shown brief video clips to interact with. 
                    Please imagine yourself as a pedestrian attempting to cross the street. 
                    When you feel comfortable and safe crossing, press and hold the spacebar. 
                    If you ever feel unsafe, simply release the spacebar. 
                    After the video ends, a button will appear one second later to continue. 
                    The videos will autoplay, do not interact with their playback. 
                    When you are ready to begin, select "Start Experiment."
                </p>
            </div>
        `,
        choices: ["Start Experiment"],
    };
    timeline.push(startExperiment);

    const videoList = [
        // Manual driving condition
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        // Manual pedestrian condition
        "https://www.youtube.com/embed/cWb-2C5mV20?start=3&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=36&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=69&end=98&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=102&end=131&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=135&end=174&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=178&end=218&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0"
    ];
    videoList.sort(() => Math.random() - 0.5);

    videoList.forEach((videoURL, index) => {
        let isLastVideo = (index === videoList.length - 1);
        let iframeID = `experiment-video-${index}`;
        let buttonContainerID = `next-button-container-${index}`;
        let buttonID = `next-button-${index}`;

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container" style="display: flex; justify-content: center; align-items: center; height: 80vh; flex-direction: column;">
                    <iframe id="${iframeID}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px; margin-bottom: 20px;"  
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div id="${buttonContainerID}" style="visibility: hidden; text-align: center; margin-top: 10px;">
                        <button id="${buttonID}" style="padding: 15px 30px; font-size: 24px;">
                            ${isLastVideo ? "Finish" : "Proceed to Next Trial"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_start: function () {
                let iframe = document.getElementById(iframeID);
                let player = new YT.Player(iframe, {
                    events: {
                        onStateChange: function (event) {
                            if (event.data === YT.PlayerState.ENDED) {
                                setTimeout(() => {
                                    document.getElementById(buttonContainerID).style.visibility = "visible";
                                }, 1000);
                            }
                        }
                    }
                });

                setTimeout(() => {
                    let button = document.getElementById(buttonID);
                    if (button) {
                        button.addEventListener("click", () => {
                            if (isLastVideo) {
                                document.body.innerHTML = `<div style='text-align: center; font-size: 24px; margin-top: 20vh;'>Thank you for completing this section</div>`;
                            } else {
                                jsPsych.finishTrial();
                            }
                        });
                    }
                }, 1000);
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);
});
