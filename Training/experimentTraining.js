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

// Global event handler variables
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
    
    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxIZdR_ewCC_NPHMWZVONIQqhxuPhjG2iyXzmOk7Yl9X0l-7IX6GVao4ADD9AwrxEBUKg/exec";

    // Welcome screen with updated title and button text for training
    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
                <h2 style="font-size: 36px;">Welcome to the eHMI Training Section</h2>
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this training, you will be shown brief video clips to interact with. 
                    Imagine yourself in the presented role (pedestrian, cyclist, or driver) and navigate the tasks as you normally would.  
                    The videos will autoplay, so please do not try to control their playback.
                    When you are ready to begin, select "Start Training."
                </p>
            </div>
        `,
        choices: ["Start Training"]
    };
    timeline.push(startExperiment);

    // Video trials (fixed order)
    let videoList = [
        { 
            url: "https://www.youtube.com/embed/Tgeko5J1z2I?start=166&end=170&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would start slowing down to yield"
        },
        { 
            url: "https://www.youtube.com/embed/cWb-2C5mV20?start=57&end=62&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
            message: "Press and hold the space bar when you would feel safe crossing the road"
        }
    ];

    videoList.forEach((video, index) => {
        // Extract the video start time from the URL (using a regex to find the start parameter)
        let videoStartTime = parseFloat(video.url.match(/start=(\d+)/)[1]);

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container" style="text-align: center;">
                    <p style="font-size: 24px; font-weight: bold;">${video.message}</p>
                    <iframe id="experiment-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${video.url}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                        <button id="next-button-${index}">
                            ${index === videoList.length - 1 ? "Finish training" : "Proceed to next trial"}
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
                        console.log(`Spacebar pressed on trial ${index} at ${videoStartTime + pressStart}`);
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

                        // Log the collected space bar data
                        console.log(`Trial ${index} spacebar data:`, dataToSend);

                        fetch("https://script.google.com/macros/s/AKfycbxIZdR_ewCC_NPHMWZVONIQqhxuPhjG2iyXzmOk7Yl9X0l-7IX6GVao4ADD9AwrxEBUKg/exec", {  // 🔥 FIXED: Use the correct script URL
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                experimentData: {
                                    participantID: 999999,
                                    date: "2025-02-27",
                                    experimentCode: "DebugTest",
                                    startTime: 123.456,
                                    endTime: 789.012
                                }
                            })
                        })
                        .then(response => response.json())
                        .then(data => console.log("✅ Debug Request Success:", data))
                        .catch(error => console.error("❌ Debug Request Error:", error));
                        
                        
                        
                        
                        
                        
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

    // Completion screen
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h2>Please inform the researcher that you have completed the training</h2>",
        choices: []
    });

    jsPsych.run(timeline);
});
