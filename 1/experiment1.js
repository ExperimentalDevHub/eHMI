console.log("ExperimentManual.js - 4");

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxI-7AnLInJceNPQBPW7sPoJ2YKMLvO5u_dbNT3_l0rAu38LOE2rccNajEhM96TES4k5w/exec";

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

// Function to shuffle videos while keeping original indices
function shuffleArray(array) {
    let shuffled = array.map((value, index) => ({ value, index })) // Attach original index
                         .sort(() => Math.random() - 0.5); // Shuffle
    return shuffled;
}

// Send data to Google Sheets in order
async function sendToGoogleSheets(dataToSend) {
    console.log("⏳ Sending Data to Google Sheets:", JSON.stringify(dataToSend));

    try {
        await fetch(GOOGLE_SHEETS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ experimentData: dataToSend }),
            mode: "no-cors"
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
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=146&end=175&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
    ];

    // ✅ Shuffle video order but retain original numbering
    let shuffledVideos = shuffleArray(videoList);

    // ✅ Ensure videos are **displayed in shuffled order** but **labels stay correct**
    shuffledVideos.forEach(({ value: videoURL, index }, shuffledIndex) => {
        let videoStartTime = parseFloat(videoURL.match(/start=(\d+)/)[1]); // Extract correct video start timestamp
        let videoNum = index + 1; // ✅ Keep original order reference!
        let isLastVideo = shuffledIndex === shuffledVideos.length - 1; // ✅ Detect the actual last video

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container">
                    <iframe id="experiment-video-${videoNum}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <button id="next-button-${videoNum}" class="next-button" 
                        style="display: block; font-size: 18px; padding: 10px 20px; margin-top: 20px;">
                        ${isLastVideo ? "Finish" : "Proceed to Next Trial"}
                    </button>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                let pressStart = null;
                let button = document.getElementById(`next-button-${videoNum}`);
        
                document.addEventListener("keydown", function (event) {
                    if (event.code === "Space" && pressStart === null) {
                        pressStart = performance.now() / 1000;
                        console.log(`🟢 Space Press Start: ${pressStart.toFixed(3)}`);
                    }
                });
        
                document.addEventListener("keyup", async function (event) {  
                    if (event.code === "Space" && pressStart !== null) {
                        let pressEnd = performance.now() / 1000;
                        let pressDuration = pressEnd - pressStart;
        
                        let correctedStartTime = videoStartTime + (pressStart - videoStartTime);
                        let correctedEndTime = videoStartTime + (pressEnd - videoStartTime);
        
                        let dataToSend = {
                            participantID: parseInt(participantID, 10),
                            date: new Date().toISOString().split('T')[0],
                            experimentCode: 1,
                            video_number: videoNum,  // ✅ Ensuring videoNum is sent even after shuffle
                            startTime: correctedStartTime.toFixed(3), 
                            endTime: correctedEndTime.toFixed(3),
                            duration: pressDuration.toFixed(3)
                        };

                        await sendToGoogleSheets(dataToSend);  // 🔥 Ensures fetch happens in order
                        pressStart = null;
                    }
                });

                // ✅ Ensuring Next Button Always Works
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
