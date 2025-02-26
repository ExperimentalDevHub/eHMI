console.log("ExperimentManual.js - FINAL FINAL (Guaranteed Button & Google Sheets Fix)");

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

// Extract start and end times from URL
function extractVideoTimes(videoURL) {
    let startMatch = videoURL.match(/start=(\d+)/);
    let endMatch = videoURL.match(/end=(\d+)/);
    return {
        start: startMatch ? parseInt(startMatch[1]) : null,
        end: endMatch ? parseInt(endMatch[1]) : null
    };
}

// Run experiment
document.addEventListener("DOMContentLoaded", function () {
    console.log("Document Loaded, Initializing Experiment...");
    let jsPsych = initJsPsych();
    let timeline = [];
    let participantID = getParticipantID();
    let experimentData = [];

    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbypG7XgkVT1GEV55kzwEt5K5hjxmVPdwWg35zHWyRtOKrXnkyXJaO0e-t3eGy68x7PI5g/exec";

    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <h2>Welcome to the eHMI Experiment</h2>
                <p>Press "Start Experiment" to begin.</p>
            </div>
        `,
        choices: ["Start Experiment"]
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
        let { start, end } = extractVideoTimes(videoURL);
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
                }, (end - start + 1) * 1000);
            },
            on_finish: function () {
                let dataToSend = {
                    participantID: participantID,
                    date: new Date().toISOString(),
                    videoNumber: index + 1,
                    videoURL: videoURL,
                    startTime: start,
                    endTime: end,
                    duration: end - start
                };

                console.log("📤 Sending Data to Google Sheets:", JSON.stringify(dataToSend, null, 2));

                fetch(GOOGLE_SHEETS_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ experimentData: dataToSend }),
                    mode: "no-cors"
                })
                .then(() => console.log("✅ Google Sheets Request Sent."))
                .catch(error => console.error("❌ Google Sheets Error:", error));
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);
});
