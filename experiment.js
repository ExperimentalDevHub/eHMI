console.log("Experiment.js - Version 1");

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
        stimulus: `<h2 style="font-size: 36px;">Welcome to the eHMI Experiment</h2>
                   <p style="font-size: 24px;">Your Participant ID: <strong>${participantID}</strong></p>`,
        choices: [`<button style="font-size: 24px; padding: 15px 30px;">Start Experiment</button>`],
    };
    timeline.push(startExperiment);

    const videoList = [
        "https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/4nfq18MG7Mo?start=35&end=38&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        "https://www.youtube.com/embed/8cUL_EkO7mU?start=15&end=18&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0"
    ];

    videoList.forEach((videoURL, index) => {
        let videoStartTime = null;
        let spacebarActive = false;
        let isLastVideo = (index === videoList.length - 1);

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container" style="display: flex; justify-content: center; align-items: center; height: 80vh;">
                    <iframe id="experiment-video" 
                        style="width: 81vw; height: 45.563vw; max-width: 1296px; max-height: 729px;"  
                        src="${videoURL}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                </div>
                <div id="next-button-container" style="display: none; text-align: center; margin-top: 20px;">
                    <button id="next-button" style="padding: 15px 30px; font-size: 24px;">
                        ${isLastVideo ? "Finish Experiment" : "Proceed to Next Trial"}
                    </button>
                </div>`,
            prompt: `<p style="text-align: center; font-size: 24px;">
                        Watch the video carefully. Press and hold spacebar when necessary.
                     </p>`,
            choices: "NO_KEYS",
            trial_duration: null,
            on_start: function () {
                videoStartTime = performance.now();

                function keydownHandler(event) {
                    if (event.code === "Space" && !spacebarActive) {
                        spacebarActive = true;
                        let currentTime = performance.now();

                        let keyPressData = {
                            participantID: participantID,
                            videoNumber: index + 1, // ✅ FIXED: Add video number
                            start: (currentTime - videoStartTime) / 1000
                        };

                        document.addEventListener("keyup", function keyupHandler(event) {
                            if (event.code === "Space" && spacebarActive) {
                                spacebarActive = false;
                                let currentTime = performance.now();
                                keyPressData.end = (currentTime - videoStartTime) / 1000;
                                keyPressData.duration = keyPressData.end - keyPressData.start;

                                sendToGoogleSheets(keyPressData);
                                document.removeEventListener("keyup", keyupHandler);
                            }
                        });
                    }
                }

                document.removeEventListener("keydown", keydownHandler);
                document.addEventListener("keydown", keydownHandler);

                setTimeout(() => {
                    document.getElementById("next-button-container").style.display = "block";
                    document.getElementById("next-button").addEventListener("click", () => {
                        if (isLastVideo) {
                            document.body.innerHTML = "";
                        } else {
                            jsPsych.finishTrial();
                        }
                    });
                }, 4000); // ✅ FIXED: Delayed next button by 1 more second (original was 3000ms)
            },
            on_finish: function () {
                console.log(`Video ${index + 1} completed, waiting for user to proceed.`);
            }
        };
        timeline.push(videoTrial);
    });

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
