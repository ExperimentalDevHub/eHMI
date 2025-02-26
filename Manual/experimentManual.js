console.log("ExperimentManual.js - The FINAL WORKING Version");

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
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208&autoplay=1&mute=1",
        // Manual pedestrian condition
        "https://www.youtube.com/embed/cWb-2C5mV20?start=3&end=32&autoplay=1&mute=1",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=36&end=65&autoplay=1&mute=1",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=69&end=98&autoplay=1&mute=1",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=102&end=131&autoplay=1&mute=1",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=135&end=174&autoplay=1&mute=1",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=178&end=218&autoplay=1&mute=1"
    ];
    videoList.sort(() => Math.random() - 0.5);

    videoList.forEach((videoURL, index) => {
        let isLastVideo = (index === videoList.length - 1);
        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container" style="display: flex; justify-content: center; align-items: center; height: 80vh; flex-direction: column;">
                    <iframe id="experiment-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px; margin-bottom: 20px;"  
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div id="next-button-container-${index}" style="visibility: hidden; text-align: center; margin-top: 10px;">
                        <button id="next-button-${index}" style="padding: 15px 30px; font-size: 24px;">
                            ${isLastVideo ? "Finish" : "Proceed to Next Trial"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                setTimeout(() => {
                    let iframe = document.getElementById(`experiment-video-${index}`);
                    let buttonContainer = document.getElementById(`next-button-container-${index}`);
                    if (iframe) {
                        let player = new YT.Player(`experiment-video-${index}`, {
                            events: {
                                onStateChange: function (event) {
                                    if (event.data === YT.PlayerState.ENDED) {
                                        setTimeout(() => {
                                            buttonContainer.style.visibility = "visible";
                                        }, 1000);
                                    }
                                }
                            }
                        });

                        // Backup: Show button at correct end time even if API event fails
                        let videoEndTime = parseInt(videoURL.match(/end=(\d+)/)[1], 10);
                        setTimeout(() => {
                            buttonContainer.style.visibility = "visible";
                        }, (videoEndTime - parseInt(videoURL.match(/start=(\d+)/)[1], 10) + 1) * 1000);
                    }
                }, 1000);
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);
});

function sendToGoogleSheets(data) {
    console.log("Sending data to Google Sheets:", data);
    fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentData: data })
    })
    .then(response => response.json())
    .then(data => console.log("Google Sheets Response:", data))
    .catch(error => console.error("Error sending to Google Sheets:", error));
}
