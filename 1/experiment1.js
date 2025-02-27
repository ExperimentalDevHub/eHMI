console.log("ExperimentManual.js - FIXED AGAIN");

// ✅ Set up the correct Google Sheets URL
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec";

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

// ✅ Keep track of ongoing spacebar press
let spacebarActive = false;

// Send data to Google Sheets in order
async function sendToGoogleSheets(dataToSend) {
    console.log("⏳ Sending Data to Google Sheets:", JSON.stringify(dataToSend));

    try {
        let response = await fetch(GOOGLE_SHEETS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ experimentData: dataToSend }),
        });

        console.log("✅ Data Successfully Sent:", dataToSend);
    } catch (error) {
        console.error("❌ Fetch Error:", error);
    }
}

// Run experiment
document.addEventListener("DOMContentLoaded", function () {
    console.log("Document Loaded, Initializing Experiment...");
    let jsPsych = initJsPsych();
    let timeline = [];
    let participantID = getParticipantID();

    // ✅ Original video URLs (labels must stay the same!)
    const videoList = [
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=146&end=175&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208&autoplay=1&mute=1",
    ];

    videoList.forEach((videoURL, trialIndex) => {
        let videoStartTime = parseFloat(videoURL.match(/start=(\d+)/)[1]); // Extract correct video start timestamp
        let videoNum = trialIndex + 1;

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container">
                    <iframe id="experiment-video-${trialIndex}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <button id="next-button-${trialIndex}" class="next-button" 
                        style="display: block; font-size: 18px; padding: 10px 20px; margin-top: 20px;">
                        ${trialIndex === videoList.length - 1 ? "Finish" : "Proceed to Next Trial"}
                    </button>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                let pressStart = null;
                let button = document.getElementById(`next-button-${trialIndex}`);

                function handleKeyDown(event) {
                    if (event.code === "Space" && !spacebarActive) {
                        spacebarActive = true;
                        pressStart = performance.now() / 1000;
                        console.log(`🟢 Space Press Start: ${pressStart.toFixed(3)}`);
                    }
                }

                function handleKeyUp(event) {
                    if (event.code === "Space" && spacebarActive) {
                        let pressEnd = performance.now() / 1000;
                        let pressDuration = pressEnd - pressStart;

                        let correctedStartTime = videoStartTime + (pressStart - videoStartTime);
                        let correctedEndTime = videoStartTime + (pressEnd - videoStartTime);

                        let dataToSend = {
                            participantID: parseInt(participantID, 10),
                            date: new Date().toISOString().split('T')[0],
                            experimentCode: 1,
                            video_number: videoNum,
                            startTime: correctedStartTime.toFixed(3),
                            endTime: correctedEndTime.toFixed(3),
                            duration: pressDuration.toFixed(3)
                        };

                        console.log(`🟢 Space Press Recorded: Start=${correctedStartTime.toFixed(3)}, End=${correctedEndTime.toFixed(3)}, Duration=${pressDuration.toFixed(3)}`);
                        sendToGoogleSheets(dataToSend);

                        spacebarActive = false; // Reset flag for the next press
                    }
                }

                document.addEventListener("keydown", handleKeyDown);
                document.addEventListener("keyup", handleKeyUp);

                if (button) {
                    button.addEventListener("click", () => {
                        console.log("➡ Proceeding to next trial...");
                        jsPsych.finishTrial();
                    });
                } else {
                    console.error("❌ Button not found in DOM!");
                }
            }
        };

        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);
});
