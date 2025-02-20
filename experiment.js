console.log("Experiment.js - Version 1.1");

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
    let spacebarActive = false;

    let videoTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <iframe id="experiment-video" width="560" height="315" 
                src="https://www.youtube.com/embed/sV5MwVYQwS8?start=37&end=40&autoplay=1&mute=1" 
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>`,
        prompt: "<p>Watch the video carefully. Press and hold spacebar when necessary.</p>",
        choices: "NO_KEYS", // Prevents jsPsych from ending the trial on keypress
        trial_duration: 3000, // 3 seconds to match 37-40s
        on_start: function () {
            videoStartTime = performance.now();

            document.addEventListener("keydown", function (event) {
                if (event.code === "Space" && !spacebarActive) {
                    spacebarActive = true;
                    let currentTime = performance.now();
                    keyPressData.push({ start: (currentTime - videoStartTime) / 1000 });
                }
            });

            document.addEventListener("keyup", function (event) {
                if (event.code === "Space" && spacebarActive) {
                    spacebarActive = false;
                    let currentTime = performance.now();
                    let lastEntry = keyPressData[keyPressData.length - 1];
                    lastEntry.end = (currentTime - videoStartTime) / 1000;
                    lastEntry.duration = lastEntry.end - lastEntry.start;
                }
            });
        },
        on_finish: function () {
            console.log("Key Press Data:", keyPressData);
        }
    };
    timeline.push(videoTrial);

    jsPsych.run(timeline);
});
