// ✅ Version 1.7 - Hide YouTube UI & Disable Overlays
console.log("🚀 experiment.js is running - Version 69");

// Initialize jsPsych
const jsPsych = initJsPsych({
    display_element: 'jspsych-experiment',
    on_finish: function () {
        console.log("✅ Experiment finished!");
    }
});

// Welcome screen with Start Button
const welcome_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<h1>Welcome to the Experiment</h1><p>Click below to start.</p>",
    choices: ["Start Experiment"],
    on_finish: function () {
        console.log("✅ Welcome screen complete.");
    }
};

// Video trial with autoplay & forced minimal UI
const video_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2>Watch the video and press the spacebar when appropriate.</h2>
        <p>Press space to record timestamps.</p>
        <iframe id="video-player" width="800" height="450"
            src="https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1"
            frameborder="0" allow="autoplay" allowfullscreen>
        </iframe>
    `,
    choices: [" "],  // Spacebar
    response_ends_trial: false,
    data: {
        participant_id: jsPsych.randomization.randomID(10) // Random ID
    },
    on_load: function () {
        console.log("✅ Video loaded & autoplaying.");
    },
    on_start: function (trial) {
        trial.start_times = [];
        trial.end_times = [];
    },
    on_finish: function (trial) {
        console.log("✅ Video trial completed.");
    }
};

// Track spacebar presses & record timestamps
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        console.log("⏳ Spacebar pressed! (Timestamp recording pending YouTube API)");
    }
});

// Run the experiment (first welcome, then video)
jsPsych.run([welcome_trial, video_trial]);
