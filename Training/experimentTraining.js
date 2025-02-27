console.log("ExperimentManual.js - FINAL FIX (Button Alignment, 'Finish Section' & End Message)");

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

function onYouTubeIframeAPIReady() {
    console.log("YouTube API Loaded and Ready.");
}

function getParticipantID() {
    let participantID = localStorage.getItem("participantID");

    if (!participantID || participantID.length > 6) {
        participantID = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem("participantID", participantID);
    }
    console.log("Participant ID:", participantID);
    return participantID;
}

// Fisher-Yates shuffle to randomize array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Global event handlers
let handleKeydown;
let handleKeyup;

function removeAllKeyListeners() {
    console.log("🛑 Removing old event listeners before adding new ones...");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Document Loaded, Initializing Experiment...");
    let jsPsych = initJsPsych();
    let timeline = [];
    let participantID = getParticipantID();
    
    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyIqBDrQm2DjrKPk4srrDsPnxO3-0zwKGxw4bmChUzHXSTl3tf05nFTmuo4IzrmgRHwPg/exec";

    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
                <h2 style="font-size: 36px;">Experimental Section</h2>
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this experiment, you will be shown brief video clips to interact with. Imagine yourself in the presented role (pedestrian, cyclist, or driver) and navigate the tasks as you normally would using your computer's space bar. The videos will autoplay, please do not try to control their playback. When you are ready to begin, select "Start Experiment."
                </p>
            </div>
        `,
        choices: ["Start Experiment"]
    };
    timeline.push(startExperiment);

    let videoList = [
        { 
            url: "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would start slowing down and let go when you would speed up"
        },
        { 
            url: "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would start slowing down to yield"
        }
    ];

    shuffleArray(videoList);

    videoList.forEach((video, index) => {
        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container" style="text-align: center;">
                    <p style="font-size: 18px;">${video.message}</p>
                    <iframe id="experiment-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${video.url}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                        <button id="next-button-${index}">
                            ${index === videoList.length - 1 ? "Finish Section" : "Proceed to Next Trial"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                document.querySelector(`#next-button-${index}`).addEventListener("click", function () {
                    console.log("➡️ Proceed Button Clicked: Moving to Next Trial");
                    jsPsych.finishTrial();
                });
            },
            on_finish: function (data) {
                let dataToSend = {
                    participantID: participantID,
                    trialIndex: index,
                    videoURL: video.url,
                    responseTime: data.rt
                };

                fetch(GOOGLE_SHEETS_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ experimentData: dataToSend }),
                    mode: "no-cors"
                }).then(() => console.log("✅ Data Sent"))
                .catch(error => console.error("❌ Error sending data:", error));
            }
        };
        timeline.push(videoTrial);
    });

    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h2>Please inform the researcher that you have completed this section</h2>",
        choices: []
    });

    jsPsych.run(timeline);
});
