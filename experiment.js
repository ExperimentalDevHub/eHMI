console.log("Experiment.js - Version 5");

// Generate or retrieve a unique participant ID
function getParticipantID() {
    let participantID = localStorage.getItem("participantID");
    if (!participantID) {
        participantID = Math.floor(100000 + Math.random() * 900000).toString(); // ✅ 6-digit ID
        localStorage.setItem("participantID", participantID);
    }
    return participantID;
}


document.addEventListener("DOMContentLoaded", function () {
    let jsPsych = initJsPsych();
    let timeline = [];

    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxQ6azojKNF4Da4IEMLk0KFJlM_xDjuAhHdGqDYsxwczPzQtY2kNUiuPGxMo3xxFrBPqg/exec";

    let participantID = getParticipantID(); // Get or generate participant ID

    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<h2>Welcome to the eHMI Experiment</h2>`,
        choices: ["Start Experiment"],
    };
    timeline.push(startExperiment);

    let keyPressData = [];
    let videoStartTime = null;
    let spacebarActive = false;

    let videoTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <iframe id="experiment-video" width="560" height="315" 
                src="https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1" 
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>`,
        prompt: `<p>Watch the video carefully. Press and hold spacebar when necessary.</p>`,
        choices: "NO_KEYS",
        trial_duration: 3000,
        on_start: function () {
            videoStartTime = performance.now();

            document.addEventListener("keydown", function (event) {
                if (event.code === "Space" && !spacebarActive) {
                    spacebarActive = true;
                    let currentTime = performance.now();
                    keyPressData.push({
                        participantID: participantID,
                        start: (currentTime - videoStartTime) / 1000
                    });
                }
            });

            document.addEventListener("keyup", function (event) {
                if (event.code === "Space" && spacebarActive) {
                    spacebarActive = false;
                    let currentTime = performance.now();
                    let lastEntry = keyPressData[keyPressData.length - 1];
                    lastEntry.end = (currentTime - videoStartTime) / 1000;
                    lastEntry.duration = lastEntry.end - lastEntry.start;

                    // Send data to Google Sheets
                    sendToGoogleSheets(lastEntry);
                }
            });
        }
    };
    timeline.push(videoTrial);

    jsPsych.run(timeline);

    function sendToGoogleSheets(data) {
        fetch(GOOGLE_SHEETS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            mode: "no-cors"
        })
        .then(() => console.log("Data sent to Google Sheets:", data))
        .catch(error => console.error("Error sending to Google Sheets:", error));
    }
});
