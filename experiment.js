console.log("🚀 experiment.js is running - Version 3.0");

// Initialize jsPsych
const jsPsych = initJsPsych({
    display_element: 'jspsych-experiment',
    on_finish: function () {
        console.log("✅ Experiment finished!");
        console.table(timestampData);
    }
});

// Generate unique participant ID
const participantID = jsPsych.randomization.randomID(10);
let timestampData = []; // Store timestamps

// Video trial
const video_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2>Watch the video and press the spacebar when appropriate.</h2>
        <p>Press space to record timestamps.</p>
        <iframe id="video-player" width="800" height="450"
            src="https://www.youtube-nocookie.com/embed/sV5MwVYQwS8?start=37&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playlist=sV5MwVYQwS8&loop=1"
            frameborder="0" allow="autoplay" allowfullscreen>
        </iframe>
    `,
    choices: [" "],  // Spacebar
    response_ends_trial: false,
    data: { participant_id: participantID },
    on_load: function () {
        console.log("✅ Video loaded & autoplaying.");
    },
    on_start: function (trial) {
        trial.start_times = [];
        trial.end_times = [];
    }
};

// Track spacebar presses & record timestamps
let isTiming = false;
let player; // YouTube API player reference

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-player', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            if (!isTiming) {
                let startTime = player.getCurrentTime();
                timestampData.push({ participant: participantID, start: startTime, end: null });
                console.log(`⏳ Start: ${startTime}s`);
            } else {
                let endTime = player.getCurrentTime();
                timestampData[timestampData.length - 1].end = endTime;
                console.log(`✅ End: ${endTime}s`);
            }
            isTiming = !isTiming;
        }
    });
}

// Inject YouTube API
const script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(script);

// Run the experiment
jsPsych.run([video_trial]);
