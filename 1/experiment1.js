console.log("ExperimentManual.js - Version 6");

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

// Fisher-Yates shuffle to randomize array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Run experiment
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
                <h2 style="font-size: 36px;">Welcome to the eHMI Experiment</h2>
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this experiment, you will be shown brief video clips to interact with. 
                    Please imagine yourself as a pedestrian attempting to cross the street. 
                    When you feel comfortable and safe crossing, press and hold the spacebar. 
                    If you ever feel unsafe, simply release the spacebar. 
                    The videos will autoplay, do not interact with their playback. 
                    When you are ready to begin, select "Start Experiment."
                </p>
            </div>
        `,
        choices: ["Start Experiment"]
    };
    timeline.push(startExperiment);

    // ✅ Using your original video URLs
    let videoList = [
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=146&end=175&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
    ];

    // 🔀 Shuffle videos to show in random order
    shuffleArray(videoList);

    videoList.forEach((videoURL, index) => {
        let videoStartTime = parseFloat(videoURL.match(/start=(\d+)/)[1]); // Extract the start timestamp from YouTube URL
        
        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container">
                    <iframe id="experiment-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div style="text-align: right; margin-top: 20px;">
                        <button id="next-button-${index}" style="display: block;">
                            ${index === videoList.length - 1 ? "Finish" : "Proceed to Next Trial"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                let pressStart = null;
                let isPressing = false; // Prevents duplicate keydown events

                let nextButton = document.getElementById(`next-button-${index}`);
                if (nextButton) {
                    nextButton.addEventListener("click", function () {
                        jsPsych.finishTrial(); // Move to the next trial
                    });
                }

                function handleKeydown(event) {
                    if (event.code === "Space" && !isPressing) {
                        isPressing = true; 
                        pressStart = performance.now() / 1000;
                    }
                }

                function handleKeyup(event) {
                    if (event.code === "Space" && isPressing) {
                        isPressing = false; 
                        let pressEnd = performance.now() / 1000;
                        let pressDuration = pressEnd - pressStart;
                        let correctedStartTime = videoStartTime + pressStart;
                        let correctedEndTime = videoStartTime + pressEnd;

                        let dataToSend = {
                            participantID: parseInt(participantID, 10),
                            date: new Date().toISOString().split('T')[0],
                            experimentCode: 1,
                            startTime: Number(correctedStartTime.toFixed(3)),
                            endTime: Number(correctedEndTime.toFixed(3)),
                            duration: Number(pressDuration.toFixed(3))
                        };

                        fetch(GOOGLE_SHEETS_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ experimentData: dataToSend }),
                            mode: "no-cors"
                        });

                        // Allow multiple presses in the same trial
                        pressStart = null;
                    }
                }

                // Make sure each trial removes previous listeners
                document.removeEventListener("keydown", handleKeydown);
                document.removeEventListener("keyup", handleKeyup);

                document.addEventListener("keydown", handleKeydown);
                document.addEventListener("keyup", handleKeyup);
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);
});
