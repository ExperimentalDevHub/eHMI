console.log("Experiment.js - Version 1.0");

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

    let keyPressData = [];
    let videoStartTime = null;

    let videoTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <iframe id="experiment-video" width="560" height="315" 
                src="https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1" 
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>`,
        prompt: "<p>Watch the video carefully. Press spacebar when necessary.</p>",
        choices: "ALL_KEYS",
        trial_duration: 3000, // 3 seconds
        on_start: function () {
            videoStartTime = performance.now();
        },
        on_keydown: function (event) {
            if (event.code === "Space") {
                let currentTime = performance.now();
                keyPressData.push({ start: (currentTime - videoStartTime) / 1000 });
            }
        },
        on_keyup: function (event) {
            if (event.code === "Space" && keyPressData.length > 0) {
                let currentTime = performance.now();
                keyPressData[keyPressData.length - 1].end = (currentTime - videoStartTime) / 1000;
                keyPressData[keyPressData.length - 1].duration = 
                    keyPressData[keyPressData.length - 1].end - keyPressData[keyPressData.length - 1].start;
            }
        },
        on_finish: function () {
            console.log("Key Press Data:", keyPressData);
        }
    };
    timeline.push(videoTrial);

    jsPsych.run(timeline);
});
