console.log("ExperimentManual.js - Version 2");

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
    let experimentData = [];

    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
                <h2 style="font-size: 36px;">Welcome to the eHMI Experiment</h2>
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this experiment, you will be shown brief video clips to interact with. 
                    Please imagine yourself as a pedestrian attempting to cross the street. 
                    When you feel comfortable and safe crossing the street, press and hold the spacebar on your computer. 
                    If, at any time, you begin to feel unsafe or that you would prefer to return to your starting point, simply release the spacebar again. 
                    Once one video finishes, please select "Proceed to Next Trial". 
                    When you are ready to begin, please select "Start Experiment" to proceed to the first video.
                </p>
            </div>
        `,
        choices: ["Start Experiment"],
    };
    timeline.push(startExperiment);

    const videoList = [
        // Manual driving condition
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208",
        // Manual pedestrian condition
        "https://www.youtube.com/embed/cWb-2C5mV20?start=3&end=32",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=36&end=65",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=69&end=98",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=102&end=131",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=135&end=174",
        "https://www.youtube.com/embed/cWb-2C5mV20?start=178&end=218"
    ];
    videoList.sort(() => Math.random() - 0.5);

    videoList.forEach((videoURL, index) => {
        let isLastVideo = (index === videoList.length - 1);
        let spacebarPresses = [];

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container" style="display: flex; justify-content: center; align-items: center; height: 80vh; flex-direction: column;">
                    <iframe id="experiment-video" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px; margin-bottom: 20px;"  
                        src="${videoURL}?autoplay=1&mute=1&enablejsapi=1" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div id="next-button-container" style="visibility: hidden; text-align: center; margin-top: 10px;">
                        <button id="next-button" style="padding: 15px 30px; font-size: 24px;">
                            ${isLastVideo ? "Finish" : "Proceed to Next Trial"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_start: function () {
                let iframe = document.getElementById("experiment-video");
                let player = new YT.Player(iframe, {
                    events: {
                        onStateChange: function (event) {
                            if (event.data === YT.PlayerState.ENDED) {
                                setTimeout(() => {
                                    document.getElementById("next-button-container").style.visibility = "visible";
                                }, 1000);
                            }
                        }
                    }
                });

                document.addEventListener("keydown", function (event) {
                    if (event.code === "Space") {
                        spacebarPresses.push({ time: Date.now(), action: "press" });
                    }
                });

                document.addEventListener("keyup", function (event) {
                    if (event.code === "Space") {
                        spacebarPresses.push({ time: Date.now(), action: "release" });
                    }
                });

                document.getElementById("next-button").addEventListener("click", () => {
                    experimentData.push({
                        participantID: participantID,
                        videoURL: videoURL,
                        spacebarData: spacebarPresses
                    });

                    if (isLastVideo) {
                        sendToGoogleSheets(experimentData);
                        document.body.innerHTML = `
                            <div style='text-align: center; font-size: 24px; margin-top: 20vh;'>
                                Thank you for completing this section
                            </div>
                        `;
                    } else {
                        jsPsych.finishTrial();
                    }
                });
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);

    function sendToGoogleSheets(data) {
        fetch(GOOGLE_SHEETS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ experimentData: data }),
            mode: "no-cors"
        })
        .then(() => console.log("Data sent to Google Sheets:", data))
        .catch(error => console.error("Error sending to Google Sheets:", error));
    }
});
