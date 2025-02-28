console.log("experimentTesting.js - Version 1");

// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded. Initializing experiment...");

    // Initialize jsPsych
    let jsPsych = initJsPsych({
        on_finish: function() {
            console.log("Experiment finished.");
        }
    });

    // Create a timeline
    let timeline = [];

    // A simple trial that waits for the space bar
    let simpleTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <h1>YES, the website is working!</h1>
            <p>Press the space bar to record your tap.</p>
        `,
        choices: [" "], // Only the space bar
        on_finish: function(data) {
            console.log("Space bar pressed!", data);
        }
    };

    timeline.push(simpleTrial);

    // Start the experiment
    jsPsych.run(timeline);
});
