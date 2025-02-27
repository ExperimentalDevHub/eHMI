console.log("experimentTraining.js");

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

// Global event handlers
let handleKeydown;
let handleKeyup;

function removeAllKeyListeners() {
    console.log("🛑 Removing old event listeners before adding new ones...");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Document Loaded, Initializing Training Block...");
    let jsPsych = initJsPsych();
    let timeline = [];
    let participantID = getParticipantID();
    
    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyIqBDrQm2DjrKPk4srrDsPnxO3-0zwKGxw4bmChUzHXSTl3tf05nFTmuo4IzrmgRHwPg/exec";

    let startTraining = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 500px; margin-bottom: 20px;">
                <h2 style="font-size: 36px;"><div style="margin-bottom: 40px;"></div><h2 style="font-size: 36px; margin-top: 50px; margin-bottom: 50px;">Welcome to the eHMI Experiment</h2></h2>
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this experiment, you will be shown brief video clips to interact with. Please imagine yourself as a pedestrian attempting to cross the street. When you feel comfortable and safe crossing, press and hold the spacebar. If you ever feel unsafe, simply release the spacebar. The videos will autoplay, do not interact with their playback.
                    When you are ready to begin, select "Start Experiment."
                </p>
            </div>
        `,
        choices: ["Start Training"]
    };
    timeline.push(startTraining);

    let trainingVideos = [
        { 
            url: "https://www.youtube.com/embed/Tgeko5J1z2I?start=150&end=170&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would start slowing down to yield. When you have completed the task, select 'Proceed to next video.'"
        },
        { 
            url: "https://www.youtube.com/embed/cWb-2C5mV20?start=41&end=62&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would feel safe crossing the road. When you have completed the task, please select 'Finish Training.'"
        }
    ];

    trainingVideos.forEach((video, index) => {
        let videoStartTime = parseFloat(video.url.match(/start=(\d+)/)[1]);

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container" style="text-align: center;">
                    <p style="font-size: 18px; ">${video.message}</p>
                    <iframe id="training-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${video.url}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 10px;">
                        <button id="next-button-${index}">
                            ${index === trainingVideos.length - 1 ? "Finish Training" : "Proceed to Next Video"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                removeAllKeyListeners();

                let pressStart = null;
                let keyHandled = false;

                handleKeydown = function(event) {
                    if (event.code === "Space" && !keyHandled) {
                        pressStart = performance.now() / 1000;
                        keyHandled = true; 
                    }
                };

                handleKeyup = function(event) {
                    if (event.code === "Space" && keyHandled) {
                        keyHandled = false; 
                        let pressEnd = performance.now() / 1000;

                        let dataToSend = {
                            participantID: parseInt(participantID, 10),
                            date: new Date().toISOString().split('T')[0],
                            experimentCode: "Training",
                            startTime: Number((videoStartTime + pressStart).toFixed(3)),
                            endTime: Number((videoStartTime + pressEnd).toFixed(3))
                        };

                        fetch(GOOGLE_SHEETS_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ experimentData: dataToSend }),
                            mode: "no-cors"
                        });
                    }
                };

                document.addEventListener("keydown", handleKeydown);
                document.addEventListener("keyup", handleKeyup);

                document.getElementById(`next-button-${index}`).addEventListener("click", () => {
                    jsPsych.finishTrial();
                });
            }
        };
        timeline.push(videoTrial);
    });

    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h2>Please inform the researcher that you have completed the training</h2>",
        choices: []
    });

    jsPsych.run(timeline);
});
