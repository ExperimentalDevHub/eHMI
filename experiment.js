document.addEventListener("DOMContentLoaded", function () {
    let jsPsych = initJsPsych();

    let timeline = [];

    // Start button
    let startExperiment = {
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h2>Welcome to the eHMI Experiment</h2>",
        choices: ["Start Experiment"],
    };
    timeline.push(startExperiment);

    // Embedded YouTube video
    let videoTrial = {
        type: jsPsychVideoKeyboardResponse,
        stimulus: ["https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1"],
        prompt: "<p>Watch the video carefully.</p>",
        choices: "NO_KEYS",
        trial_ends_after_video: true,
    };
    timeline.push(videoTrial);

    jsPsych.run(timeline);
});
