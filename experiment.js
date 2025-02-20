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
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1" 
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>`,
        prompt: "<p>Watch the video carefully.</p>",
        choices: "NO_KEYS",
        trial_duration: 3000 // 3 seconds to match 37-40s
    };
    
    timeline.push(videoTrial);

    jsPsych.run(timeline);
});
