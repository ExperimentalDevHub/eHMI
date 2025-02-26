console.log("ExperimentManual.js - FINAL FINAL FINAL VERSION");

// Ensure YouTube API loads before running the experiment
if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
    console.log("Loading YouTube API...");
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    console.log("YouTube API already loaded.");
}

// Global function for YouTube API
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Loaded and Ready.");
}

// Generate or retrieve a unique participant ID
function getParticipantID() {
    let participantID = localStorage.getItem("participantID");

    if (!participantID || participantID.length > 6) {
        participantID = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem("participantID", participantID);
    }
    console.log("Participant ID:", participantID);
    return participantID;
}

// Run experiment
document.addEventListener("DOMContentLoaded", function () {
    console.log("Document Loaded, Initializing Experiment...");
    let jsPsych = initJsPsych();
    let timeline = [];
    let participantID = getParticipantID();
    
    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbypG7XgkVT1GEV55kzwEt5K5hjxmVPdwWg35zHWyRtOKrXnkyXJaO0e-t3eGy68x7PI5g/exec";

    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <h2>Welcome to the eHMI Experiment</h2>
                <p>In this experiment, you will watch short video clips. Imagine yourself as a pedestrian crossing the street. Press and hold the spacebar when you feel safe crossing, and release it if you feel unsafe. The videos autoplay, so do not interact with playback.</p>
                <p>After each video, a button will appear. Click it to proceed.</p>
                <p>When you are ready, click "Start Experiment" below.</p>
            </div>
        `,
        choices: ["Start Experiment"]
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
        let isLastVideo = index === videoList.length - 1;

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container">
                    <iframe id="experiment-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px; margin-bottom: 20px;"  
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div id="next-button-container-${index}" style="text-align: center; margin-top: 10px;">
                        <button id="next-button-${index}" style="padding: 15px 30px; font-size: 20px; display: none;">
                            ${isLastVideo ? "Finish" : "Proceed to Next Trial"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                console.log(`🔍 Checking for Button ${index + 1}...`);
                setTimeout(() => {
                    let button = document.getElementById(`next-button-${index}`);
                    if (button) {
                        console.log(`✅ Button found for Video ${index + 1}, making visible.`);
                        button.style.display = "block";
                        button.onclick = function () {
                            console.log(`🖱️ Button clicked for Video ${index + 1}`);
                            jsPsych.finishTrial();
                        };
                    } else {
                        console.error(`❌ BUTTON NOT FOUND, CREATING ONE MANUALLY.`);
                        let buttonContainer = document.getElementById(`next-button-container-${index}`);
                        if (buttonContainer) {
                            let newButton = document.createElement("button");
                            newButton.id = `next-button-${index}`;
                            newButton.innerText = isLastVideo ? "Finish" : "Proceed to Next Trial";
                            newButton.style = "padding: 15px 30px; font-size: 20px;";
                            newButton.onclick = function () {
                                console.log(`🖱️ Manually Created Button Clicked for Video ${index + 1}`);
                                jsPsych.finishTrial();
                            };
                            buttonContainer.appendChild(newButton);
                        }
                    }
                }, 1000);
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);
});
