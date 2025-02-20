console.log("Experiment.js - Version 1.9");

// Generate or retrieve a unique participant ID
function getParticipantID() {
    let participantID = localStorage.getItem("participantID");

    if (!participantID || participantID.length > 6) {
        participantID = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem("participantID", participantID);
    }
    
    return participantID;
}

document.addEventListener("DOMContentLoaded", function () {
    let jsPsych = initJsPsych();
    let timeline = [];

    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbypG7XgkVT1GEV55kzwEt5K5hjxmVPdwWg35zHWyRtOKrXnkyXJaO0e-t3eGy68x7PI5g/exec";

    let participantID = getParticipantID();

    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<h2>Welcome to the eHMI Experiment</h2><p>Your Participant ID: <strong>${participantID}</strong></p>`,
        choices: ["Start Experiment"],
    };
    timeline.push(startExperiment);

    const videoList = [
        "https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1",
        "https://www.youtube.com/embed/KIvC5wsoW2Y?start=40&end=43&autoplay=1&mute=1",
        "https://www.youtube.com/embed/8cUL_EkO7mU?start=15&end=18&autoplay=1&mute=1"
    ];

    videoList.forEach((videoURL, index) => {
        let keyPressData = [];
        let videoStartTime = null;
        let spacebarActive = false;
        let videoNumber = index + 1; // ✅ Assign video number properly

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <iframe id="experiment-video" width="560" height="315" 
                    src="${videoURL}" 
                    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                </iframe>`,
            prompt: `<p>Watch the video carefully. Press and hold spacebar when necessary.</p><p>Video ${videoNumber} of ${videoList.length}</p>`,
            choices: "NO_KEYS",
            trial_duration: 2800, 
            on_start: function () {
                videoStartTime = performance.now();

                // ✅ Remove existing event listeners before adding new ones
                document.removeEventListener("keydown", keydownHandler);
                document.removeEventListener("keyup", keyupHandler);

                function keydownHandler(event) {
                    if (event.code === "Space" && !spacebarActive) {
                        spacebarActive = true;
                        let currentTime = performance.now();
                        keyPressData.push({
                            participantID: participantID,
                            videoNumber: videoNumber, // ✅ Correctly store video number
                            start: (currentTime - videoStartTime) / 1000
                        });
                    }
                }

                function keyupHandler(event) {
                    if (event.code === "Space" && spacebarActive) {
                        spacebarActive = false;
                        let currentTime = performance.now();
                        let lastEntry = keyPressData[keyPressData.length - 1];
                        lastEntry.end = (currentTime - videoStartTime) / 1000;
                        lastEntry.duration = lastEntry.end - lastEntry.start;

                        sendToGoogleSheets(lastEntry);
                    }
                }

                // ✅ Add event listeners for this specific video
                document.addEventListener("keydown", keydownHandler);
                document.addEventListener("keyup", keyupHandler);
            }
        };
        timeline.push(videoTrial);

        if (index < videoList.length - 1) {
            let transitionScreen = {
                type: jsPsychHtmlButtonResponse,
                stimulus: `<h2>Proceed to Next Trial</h2><p>Click the button below to continue.</p>`,
                choices: ["Next Video"],
            };
            timeline.push(transitionScreen);
        }
    });

    let endExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<h2>Thank you for participating!</h2><p>Your data has been recorded.</p>`,
        choices: ["Finish"],
    };
    timeline.push(endExperiment);

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
