console.log("🚀 experiment.js is running - Version 1.0");


// Initialize jsPsych
const jsPsych = initJsPsych({
    display_element: 'jspsych-experiment',
    on_finish: function() {
        console.log("✅ Experiment finished!");
    }
});

// Generate a random participant ID
const participantID = jsPsych.randomization.randomID(10);

// Setup YouTube API player
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-video', {
        events: {
            'onReady': function(event) {
                console.log("✅ YouTube Video Loaded!");
            }
        }
    });
}

// Define the video trial
const video_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2>Watch the video and press the spacebar when appropriate.</h2>
        <p>Press space to record timestamps.</p>
        <iframe id="youtube-video" width="800" height="450"
            src="https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&controls=0"
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>
    `,
    choices: "NO_KEYS",
    on_load: function() {
        console.log("✅ Video trial loaded!");
        document.addEventListener("keydown", trackPresses);
    },
    on_finish: function() {
        console.log("✅ Video trial ended.");
        document.removeEventListener("keydown", trackPresses);
    },
    data: {
        participant_id: participantID,
        timestamps: []
    }
};

// Track spacebar presses
function trackPresses(event) {
    if (event.code === "Space") {
        if (player && typeof player.getCurrentTime === "function") {
            const currentTime = player.getCurrentTime();
            console.log("⏳ Spacebar pressed at:", currentTime);
            jsPsych.data.get().push({ 
                participant_id: participantID, 
                timestamp: currentTime 
            });
        }
    }
}

// Run experiment
jsPsych.run([video_trial]);
