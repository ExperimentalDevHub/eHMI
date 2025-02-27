console.log("experiment1.js - FINAL UPDATE (RIGHT-ALIGNED BUTTONS)");

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

// Fisher-Yates shuffle while keeping pairs intact
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 🔗 Pair videos with correct instructions
let videoMessagePairs = [
    {
        video: "https://www.youtube.com/embed/Tgeko5J1z2I?start=3&end=32&autoplay=1&mute=1",
        message: "Press and hold the space bar when you would start slowing down and let go when you would speed up."
    },
    {
        video: "https://www.youtube.com/embed/Tgeko5J1z2I?start=36&end=65&autoplay=1&mute=1",
        message: "Press and hold the space bar when you would start slowing down to yield."
    },
    {
        video: "https://www.youtube.com/embed/Tgeko5J1z2I?start=69&end=98&autoplay=1&mute=1",
        message: "Press and hold the space bar when you would start slowing down to yield."
    },
    {
        video: "https://www.youtube.com/embed/Tgeko5J1z2I?start=102&end=141&autoplay=1&mute=1",
        message: "Press and hold the space bar when you would start slowing down to yield."
    },
    {
        video: "https://www.youtube.com/embed/Tgeko5J1z2I?start=146&end=175&autoplay=1&mute=1",
        message: "Press and hold the space bar when you would start slowing down to yield."
    },
    {
        video: "https://www.youtube.com/embed/Tgeko5J1z2I?start=179&end=208&autoplay=1&mute=1",
        message: "Press and hold the space bar when you would start slowing down to yield."
    }
];

// 🔀 Shuffle all 6 videos while keeping their messages paired
shuffleArray(videoMessagePairs);

document.addEventListener("DOMContentLoaded", function () {
    console.log("Document Loaded, Initializing Experiment...");
    let jsPsych = initJsPsych();
    let timeline = [];
    let participantID = getParticipantID();

    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_URL_HERE/exec";

    // 📌 INTRO SCREEN (kept intact)
    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
                <h2 style="font-size: 36px;">Welcome to the eHMI Experiment</h2>
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this experiment, you will be shown brief video clips to interact with. 
                    Please imagine yourself as the driver attempting to safely navigate the driving tasks. 
                    When you feel comfortable and safe slowing/speeding, press and hold the spacebar. 
                    If you ever feel unsafe, simply release the spacebar. 
                    The videos will autoplay, do not interact with their playback. 
                    When you are ready to begin, select "Start Experiment."
                </p>
            </div>
        `,
        choices: ["Start Experiment"]
    };
    timeline.push(startExperiment);

    videoMessagePairs.forEach((pair, index) => {
        let videoStartTime = parseFloat(pair.video.match(/start=(\d+)/)[1]);

        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 20px;">
                    ${pair.message}
                </div>
                <div id="video-container">
                    <iframe id="experiment-video-${index}" 
                        style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                        src="${pair.video}" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                    <div style="text-align: right; margin-top: 20px;">
                        <button id="next-button-${index}" style="display: block;">
                            ${index === videoMessagePairs.length - 1 ? "Finish Section" : "Proceed to Next Trial"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                let pressStart = null;
                let keyHandled = false;

                function handleKeydown(event) {
                    if (event.code === "Space" && !keyHandled) {
                        pressStart = performance.now() / 1000;
                        keyHandled = true; 
                        console.log(`🟢 Keydown Event Fired: Start Time = ${pressStart}`);
                    }
                }

                function handleKeyup(event) {
                    if (event.code === "Space" && keyHandled) {
                        keyHandled = false; 
                        let pressEnd = performance.now() / 1000;
                        let pressDuration = pressEnd - pressStart;
                        let correctedStartTime = videoStartTime + pressStart;
                        let correctedEndTime = videoStartTime + pressEnd;

                        console.log(`🔴 Keyup Fired: Start Time = ${correctedStartTime}, End Time = ${correctedEndTime}, Duration = ${pressDuration}`);

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
                        }).then(() => console.log("✅ Data Sent"));
                    }
                }

                document.addEventListener("keydown", handleKeydown);
                document.addEventListener("keyup", handleKeyup);

                let nextButton = document.getElementById(`next-button-${index}`);
                if (nextButton) {
                    nextButton.addEventListener("click", function () {
                        console.log("➡️ Proceed Button Clicked: Moving to Next Trial");
                        jsPsych.finishTrial();
                    });
                }
            }
        };
        timeline.push(videoTrial);
    });

    // 📌 FINAL SCREEN AFTER "FINISH SECTION"
    let finalScreen = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center; font-size: 24px; font-weight: bold;">
                Please let the researcher know that you have finished this section.
            </div>
        `,
        choices: []
    };
    timeline.push(finalScreen);

    jsPsych.run(timeline);
});
