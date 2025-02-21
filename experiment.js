console.log("Experiment.js - Version 2.3");

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
        "https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1",
        "https://www.youtube.com/embed/4nfq18MG7Mo?start=35&end=38&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1",
        "https://www.youtube.com/embed/8cUL_EkO7mU?start=15&end=18&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1"
    ];

    videoList.forEach((videoURL, index) => {
        let videoStartTime = null;
        let spacebarActive = false;
        let videoNumber = index + 1; // ✅ Assign correct video number

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container">
                    <iframe id="experiment-video" width="560" height="315" 
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                </div>
                <div id="next-button-container" style="display: none;">
                    <button id="next-button">Next Video</button>
                </div>`,
            prompt: `<p>Watch the video carefully. Press and hold spacebar when necessary.</p><p>Video ${videoNumber} of ${videoList.length}</p>`,
            choices: "NO_KEYS",
            trial_duration: 3000, // ✅ Keep this but do NOT auto-advance
            on_start: function () {
                videoStartTime = performance.now();

                function keydownHandler(event) {
                    if (event.code === "Space" && !spacebarActive) {
                        spacebarActive = true;
                        let currentTime = performance.now();
                        let recordedVideoNumber = videoNumber; // ✅ Store the exact video number at keypress

                        let keyPressData = {
                            participantID: participantID,
                            videoNumber: recordedVideoNumber, // ✅ Ensures correct video number
                            start: (currentTime - videoStartTime) / 1000
                        };

                        document.addEventListener("keyup", function keyupHandler(event) {
                            if (event.code === "Space" && spacebarActive) {
                                spacebarActive = false;
                                let currentTime = performance.now();
                                keyPressData.end = (currentTime - videoStartTime) / 1000;
                                keyPressData.duration = keyPressData.end - keyPressData.start;

                                sendToGoogleSheets(keyPressData);

                                // ✅ Remove this keyup event after use to prevent duplicates
                                document.removeEventListener("keyup", keyupHandler);
                            }
                        });
                    }
                }

                // ✅ Ensure previous event listeners are removed before adding new ones
                document.removeEventListener("keydown", keydownHandler);
                document.addEventListener("keydown", keydownHandler);

                // ✅ Delay the appearance of the "Next Video" button until trial ends
                setTimeout(() => {
                    document.getElementById("next-button-container").style.display = "block";
                    document.getElementById("next-button").addEventListener("click", () => {
                        jsPsych.finishTrial(); // ✅ Proceed when button is clicked
                    });
                }, 3000); // ✅ Show button AFTER video duration ends
            },
            on_finish: function () {
                // ✅ Keep the video on screen while waiting for user input
                console.log(`Video ${videoNumber} completed, waiting for user to proceed.`);
            }
        };
        timeline.push(videoTrial);
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
