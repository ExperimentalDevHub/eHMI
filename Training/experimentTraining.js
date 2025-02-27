console.log("ExperimentManual.js - Debugging Version");

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

// Spacebar event handlers
let keyPressStart = null;

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        if (keyPressStart === null) {
            keyPressStart = performance.now();
            console.log("⏳ Spacebar Pressed at:", keyPressStart);
        }
    }
});

document.addEventListener("keyup", function (event) {
    if (event.code === "Space" && keyPressStart !== null) {
        let keyPressEnd = performance.now();
        let pressDuration = (keyPressEnd - keyPressStart) / 1000;
        console.log("✅ Spacebar Released. Duration:", pressDuration, "seconds");
        keyPressStart = null;
    }
});

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
                <h2>Experimental Section</h2>
                <p>Press spacebar when you want to slow down.</p>
                <button id="start-experiment-btn">Start Experiment</button>
            </div>
        `,
        choices: []
    };

    timeline.push(startExperiment);

    let videoList = [
        { 
            url: "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1",
            message: "Press space when you would slow down"
        },
        { 
            url: "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1",
            message: "Press space when you would yield"
        }
    ];

    shuffleArray(videoList);

    videoList.forEach((video, index) => {
        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div style="text-align: center;">
                    <p>${video.message}</p>
                    <iframe style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${video.url}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <button id="next-button-${index}">${index === videoList.length - 1 ? "Finish Section" : "Next Video"}</button>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                let nextButton = document.getElementById(`next-button-${index}`);
                if (nextButton) {
                    nextButton.addEventListener("click", function () {
                        console.log(`➡️ Button Clicked: Proceeding from Trial ${index}`);
                        jsPsych.finishTrial();
                    });
                }
            },
            on_finish: function (data) {
                let dataToSend = {
                    participantID: participantID,
                    trialIndex: index,
                    videoURL: video.url,
                    responseTime: data.rt
                };

                console.log("📤 Sending data to Google Sheets:", dataToSend);

                fetch(GOOGLE_SHEETS_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ experimentData: dataToSend }),
                    mode: "no-cors"
                })
                .then(() => console.log("✅ Data Sent"))
                .catch(error => console.error("❌ Error sending data:", error));
            }
        };
        timeline.push(videoTrial);
    });

    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h2>Experiment Complete. Inform the researcher.</h2>",
        choices: []
    });

    jsPsych.run(timeline);
});
