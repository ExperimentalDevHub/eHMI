// 🚀 Confirm script is loading
console.log("🚀 experiment.js is running - Version 1.1");

// Initialize jsPsych
const jsPsych = initJsPsych({
    display_element: 'jspsych-experiment',
    on_finish: function() {
        console.log("✅ Experiment finished!");
    }
});

// Intro page with "Start Experiment" button
const intro_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<h2>Welcome to the Experiment</h2><p>Click below to begin.</p>",
    choices: ["Start Experiment"],
    on_load: function() {
        console.log("✅ Intro screen loaded");
    }
};

// Video trial with autoplaying YouTube video
const video_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2 style="color: red;">🚀 Video Trial Started: Press Space!</h2>
        <p>Press space to record timestamps.</p>
        <iframe id="youtube-video" width="800" height="450"
            src="https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&controls=0"
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>
    `,
    choices: [" "],  // Spacebar to interact
    response_ends_trial: false,
    data: {
        participant_id: jsPsych.randomization.randomID(10) // Random participant ID
    },
    on_load: function() {
        console.log("✅ Video trial loaded!");
    }
};

// Run experiment (Start button first, then video)
jsPsych.run([intro_screen, video_trial]);
