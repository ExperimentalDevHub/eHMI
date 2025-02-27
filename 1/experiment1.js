console.log("ExperimentManual.js - Version 9");

if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
    console.log("Loading YouTube API...");
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    console.log("YouTube API already loaded.");
}

function onYouTubeIframeAPIReady() {
    console.log("YouTube API Loaded and Ready.");
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

document.addEventListener("DOMContentLoaded", function () {
    console.log("Document Loaded, Initializing Experiment...");
    let jsPsych = initJsPsych();
    let timeline = [];
    let participantID = getParticipantID();
    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbx5MHhPh6YTVK8F9xk1vRpiUadKb8C5p12qXaYgf2YzoHUFDF3Zazi_9bQ-WfJNtDcj9Q/exec";

    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<h2>Welcome to the eHMI Experiment</h2><p>Press "Start Experiment" to begin.</p>`,
        choices: ["Start Experiment"]
    };
    timeline.push(startExperiment);

    let videoList = [
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=146&end=175&autoplay=1&mute=1",
        "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208&autoplay=1&mute=1",
    ];

    videoList = jsPsych.randomization.shuffle(videoList);

    videoList.forEach((videoURL, index) => {
        let videoStartTime = parseFloat(videoURL.match(/start=(\d+)/)[1]);

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<iframe id="video-${index}" src="${videoURL}" width="800" height="450" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            <button id="next-button-${index}" style="display: none;">${index === videoList.length - 1 ? "Finish" : "Proceed to Next Video"}</button>` ,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                let pressStart = null;

                document.addEventListener("keydown", function (event) {
                    if (event.code === "Space" && pressStart === null) {
                        pressStart = performance.now() / 1000;
                        console.log(`🟢 Space Press Start: ${pressStart.toFixed(3)}`);
                    }
                });

                document.addEventListener("keyup", function (event) {
                    if (event.code === "Space" && pressStart !== null) {
                        let pressEnd = performance.now() / 1000;
                        let pressDuration = pressEnd - pressStart;
                        let correctedStartTime = videoStartTime + pressStart;
                        let correctedEndTime = videoStartTime + pressEnd;
                        console.log(`🔴 Space Press End: ${pressEnd.toFixed(3)} | Duration: ${pressDuration.toFixed(3)}`);

                        let dataToSend = {
                            participantID: parseInt(participantID, 10),
                            date: new Date().toISOString().split('T')[0],
                            experimentCode: 1,
                            startTime: Number(correctedStartTime.toFixed(3)),
                            endTime: Number(correctedEndTime.toFixed(3)),
                            duration: Number(pressDuration.toFixed(3))
                        };

                        fetch(GOOGLE_SHEETS_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ experimentData: dataToSend }),
                            mode: "no-cors"
                        }).then(() => console.log("✅ Google Sheets Request Sent."));

                        document.getElementById(`next-button-${index}`).style.display = "block";
                        pressStart = null;
                    }
                });
            }
        };
        timeline.push(videoTrial);
    });

    jsPsych.run(timeline);
});
