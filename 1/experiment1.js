console.log("experiment1.js - Version 1");

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
    
    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbypUSRpw1vgkP_HwAMtlBwbb6UglGRdKS-93M-VqHeulrnHaahq5hNb1ersJUQAUZmH/exec";

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
                    After the video ends, a button will appear to continue. 
                    The videos will autoplay, do not interact with their playback. 
                    When you are ready to begin, select "Start Experiment."
                </p>
            </div>
        `,
        choices: ["Start Experiment"]
    };
    timeline.push(startExperiment);

    // ✅ Your original video URLs
    const videoList = [
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=146&end=175&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
    ];

    videoList.forEach((videoURL, index) => {
        let videoStartTime = parseFloat(videoURL.match(/start=(\d+)/)[1]); // Extract correct video start timestamp
        
        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container">
                    <iframe id="experiment-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <button id="next-button-${index}" class="next-button" style="display: block; font-size: 18px; padding: 10px 20px; margin-top: 20px;">
                        ${index === videoList.length - 1 ? "Finish" : "Proceed to Next Trial"}
                    </button>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                let pressStart = null;
                let button = document.getElementById(`next-button-${index}`);

                document.addEventListener("keydown", function (event) {
                    if (event.code === "Space" && pressStart === null) {
                        pressStart = performance.now() / 1000;
                        console.log(`🟢 Space Press Start: ${pressStart.toFixed(3)}`);
                    }
                });

                document.addEventListener("keyup", function (event) {
                    if (event.code === "Space" && pressStart !== null) {
                        let pressEnd = performance.now() / 1000;
                        let pressDuration = pressEnd - pressStart;

                        let correctedStartTime = videoStartTime + pressStart;
                        let correctedEndTime = videoStartTime + pressEnd;

                        let dataToSend = {
                            participantID: parseInt(participantID, 10),
                            date: new Date().toISOString().split('T')[0],
                            experimentCode: 1,
                            videoNumber: index + 1,
                            startTime: Number(correctedStartTime.toFixed(3)), 
                            endTime: Number(correctedEndTime.toFixed(3)),
                            duration: Number(pressDuration.toFixed(3))
                        };

                        console.log("🔍 Data Before Sending:", JSON.stringify(dataToSend, null, 2));

                        fetch(GOOGLE_SHEETS_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ experimentData: dataToSend }),
                        })
                        .then(response => response.text())  // Convert response to text to debug
                        .then(data => console.log("🛠️ Google Sheets Response:", data))  // Print response
                        .catch(error => console.error("❌ Google Sheets Error:", error));
                        

                        pressStart = null;
                    }
                });

                button.addEventListener("click", () => jsPsych.finishTrial());
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);
});
