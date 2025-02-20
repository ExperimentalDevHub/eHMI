// Initialize jsPsych
const jsPsych = initJsPsych({
    display_element: 'jspsych-experiment',
    on_finish: function() {
        console.log("✅ Experiment finished!");
    }
});

// Define video trial
const video_trial = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: ["https://www.youtube.com/embed/https://www.youtube.com/watch?v=sV5MwVYQwS8?start=37&end=40&autoplay=1&controls=0"],
    width: 800,
    choices: [" "],  // Spacebar to interact
    response_ends_trial: false,
    prompt: "<h2>Watch the video and press the spacebar when appropriate.</h2><p>Press space to record timestamps.</p>",
    data: {
        participant_id: jsPsych.randomization.randomID(10) // Random participant ID
    },
    on_load: function() {
        console.log("✅ Video trial loaded!");
    },
    on_start: function(trial) {
        trial.start_times = [];
        trial.end_times = [];
    },
    on_finish: function(trial) {
        console.log("✅ Video finished!", trial);
    }
};

// Listen for spacebar presses & record timestamps
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        const video = document.querySelector("iframe");
        if (video) {
            const currentTime = video.contentWindow?.postMessage({ method: "getCurrentTime" }, "*");
            console.log("⏳ Spacebar pressed at:", currentTime);
        }
    }
});

// Run experiment
jsPsych.run([video_trial]);
