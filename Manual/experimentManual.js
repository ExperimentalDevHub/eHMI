console.log("ExperimentManual.js - Version 1");

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
                    After the video ends, a button will appear one second later to continue.
                    When you are ready to begin, select "Start Experiment."
                </p>
            </div>
        `,
        choices: ["Start Experiment"],
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
        let isLastVideo = (index === videoList.length - 1);

        // Calculate video duration from the URL parameters
        let urlParams = new URLSearchParams(videoURL.split('?')[1]);
        let startTime = Number(urlParams.get("start")) || 0;
        let endTime = Number(urlParams.get("end")) || 0;
        // Duration in milliseconds
        let videoDuration = (endTime - startTime) * 1000;
        // Button appears 1 second after the video ends
        let buttonDelay = videoDuration + 1000;

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div id="video-container" style="display: flex; justify-content: center; align-items: center; height: 80vh; flex-direction: column;">
                    <iframe id="experiment-video" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px; margin-bottom: 20px;"  
                        src="${videoURL}" 
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
                setTimeout(() => {
                    // Show the next button after the calculated delay
                    let nextButtonContainer = document.getElementById("next-button-container");
                    if (nextButtonContainer) {
                        nextButtonContainer.style.visibility = "visible";
                    }
                    let nextButton = document.getElementById("next-button");
                    if (nextButton) {
                        nextButton.addEventListener("click", () => {
                            // Send trial data to Google Sheets before finishing the trial
                            let trialData = {
                                participantID: getParticipantID(),
                                videoURL: videoURL,
                                timestamp: new Date().toISOString()
                            };
                            sendToGoogleSheets(trialData);
                            
                            if (isLastVideo) {
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
                }, buttonDelay);
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);

    function sendToGoogleSheets(data) {
        // Add any additional data fields here if needed
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
