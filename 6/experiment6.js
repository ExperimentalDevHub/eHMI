console.log("experiment6.js - V1 ");

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

    // Intro screen with updated title and paragraph
    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: 
            `<div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
                <h2 style="font-size: 36px;">Experimental section</h2>
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this experiment, you will be shown brief video clips to interact with. Imagine yourself in the presented role (pedestrian, cyclist, or driver) and navigate the tasks as you normally would using your computer's space bar. The videos will autoplay, please do not try to control their playback. When you are ready to begin, select "Start Experiment."
                </p>
            </div>`,
        choices: ["Start Experiment"]
    };
    timeline.push(startExperiment);

    let videoList = [
        { 
            url: "https://www.youtube.com/embed/A8VrRt9gwNI?start=10&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would feel safe crossing the road"
        },
        { 
            url: "https://www.youtube.com/embed/A8VrRt9gwNI?start=43&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would feel safe crossing the road"
        },
        { 
            url: "https://www.youtube.com/embed/A8VrRt9gwNI?start=76&end=98&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would feel safe crossing the street"
        },
        { 
            url: "https://www.youtube.com/embed/A8VrRt9gwNI?start=111&end=131&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would feel safe walking"
        },
        { 
            url: "https://www.youtube.com/embed/A8VrRt9gwNI?start=152&end=174&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would feel safe crossing the road"
        },
        { 
            url: "https://www.youtube.com/embed/A8VrRt9gwNI?start=195&end=217&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would feel safe walking"
        }
    ];

    shuffleArray(videoList);

    videoList.forEach((video, index) => {
        let videoStartTime = parseFloat(video.url.match(/start=(\d+)/)[1]);

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: 
                `<div id="video-container" style="text-align: center;">
                    <p style="font-size: 18px;">${video.message}</p>
                    <iframe id="experiment-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${video.url}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 10px;">
                        <button id="next-button-${index}">
                            ${index === videoList.length - 1 ? "Finish Section" : "Proceed to Next Trial"}
                        </button>
                    </div>
                </div>`,
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
                            experimentCode: 1,
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

    // Finished screen with removed period at the end
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h2>Please inform the researcher that you have completed this section</h2>",
        choices: []
    });

    jsPsych.run(timeline);
});
