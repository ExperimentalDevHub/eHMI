console.log("🚀 experiment.js is running - Final Version");

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
let isTiming = false;
let player; // YouTube API player reference

// Welcome screen
const welcome_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<h1>Welcome to the Experiment</h1><p>Click below to start.</p>",
    choices: ["Start Experiment"],
    on_finish: function () {
        console.log("✅ Welcome screen complete.");
    }
};

// Video trial
const video_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2>Watch the video and press the spacebar when appropriate.</h2>
        <p>Press space to record timestamps.</p>
        <iframe id="video-player" width="800" height="450"
            src="https://www.youtube-nocookie.com/embed/sV5MwVYQwS8?start=37&autoplay=1&mute=1
            &controls=0&modestbranding=1&rel=0&iv_load_policy=3
            &disablekb=1&fs=0&playsinline=1&enablejsapi=1"
            frameborder="0" allow="autoplay">
        </iframe>
    `,
    choices: [" "],  // Spacebar
    response_ends_trial: false,
    data: { participant_id: participantID },
    on_load: function () {
        console.log("✅ Video loaded & autoplaying.");
    }
};

// Track spacebar presses & record timestamps
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-player', {
        events: {
            'onReady': function () {
                console.log("✅ Video ready to play.");
            },
            'onStateChange': function (event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    let checkTime = setInterval(function () {
                        if (player.getCurrentTime() >= 40) {
                            player.stopVideo();
                            clearInterval(checkTime);
                            console.log("⏹ Video stopped at 40s.");
                        }
                    }, 500);
                }
            }
        }
    });
}

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

// Inject YouTube API
const script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(script);

// Run the experiment
jsPsych.run([welcome_trial, video_trial]);
