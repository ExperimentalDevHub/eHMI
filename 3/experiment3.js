if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
    console.log("Loading YouTube API...");
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    console.log("YouTube API already loaded.");
}
  

function onYouTubeIframeAPIReady() {
    console.log("YouTube API Loaded and Ready.");
}
  

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
  

function getFormattedDateTime() {
    let d = new Date();
    let year = d.getFullYear();
    let month = String(d.getMonth() + 1).padStart(2, "0");
    let day = String(d.getDate()).padStart(2, "0");
    let hour = String(d.getHours()).padStart(2, "0");
    let minute = String(d.getMinutes()).padStart(2, "0");
    let second = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
  

let handleKeydown;
let handleKeyup;
function removeAllKeyListeners() {
    console.log("🛑 Removing old event listeners before adding new ones...");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
}
  

document.addEventListener("DOMContentLoaded", function () {
    console.log("Document loaded. Initializing experiment...");
  

    let jsPsych = initJsPsych({
        on_finish: function() {
            console.log("Experiment finished.");
        }
    });
  

    let timeline = [];
  

    let participantID = localStorage.getItem("participantID");

  

    const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzsvZbu4Yk-KlH_T_iBuXxcst19Lh88VLGX6_25w2_XA2BTc3WDqyNG9IyvYmIMcvxUwQ/exec";
  

    let introTrial = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
                <!-- Title removed -->
                <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                    In this experiment, you will be shown brief video clips to interact with. 
                    Imagine yourself in the presented role (pedestrian, cyclist, or driver) 
                    and navigate the tasks as you normally would using your computer's space bar. 
                    The videos will autoplay, so please do not try to control their playback. 
                    When you are ready to begin, select "Start Experiment."
                </p>
            </div>
        `,
        choices: ["Start Experiment"]
    };
    timeline.push(introTrial);
  

    let videoList = [
        {
            number: 1,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the pedestrian</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> Across the road</li>
                        <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/ZTX5JSdlqp8?start=11&end=28&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe crossing (walking) the road."
        },
        {
            number: 2,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the pedestrian</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> Across the road</li>
                        <li><strong>Objective:</strong> Cross mid block (jaywalk)</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/ZTX5JSdlqp8?start=42&end=59&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe crossing (walking) the road."
        },
        {
            number: 3,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the pedestrian</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> Across the road</li>
                        <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/ZTX5JSdlqp8?start=73&end=90&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe crossing (walking) the road."
        },
        {
            number: 4,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the pedestrian</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> Down the road</li>
                        <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection, indicating a right turn</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/ZTX5JSdlqp8?start=104&end=121&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe crossing (walking) the road."
        },
        {
            number: 5,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the pedestrian</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> Across the road</li>
                        <li><strong>Objective:</strong> Cross mid block (jaywalk)</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) nearby dropped off a passenger; wants to begin driving again</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/ZTX5JSdlqp8?start=135&end=152&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe crossing (walking) the road."
        },
        {
            number: 6,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the pedestrian</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> Down the road</li>
                        <li><strong>Objective:</strong> Continue walking straight</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane indicates turning into an alleyway (pedestrian zone) on your right</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/ZTX5JSdlqp8?start=166&end=183&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe crossing (walking) the road."
        }
    ];
  

    shuffleArray(videoList);
  

    videoList.forEach((video, index) => {
  

        let instructionTrial = {
            type: jsPsychHtmlButtonResponse,
            stimulus: `
                <div style="text-align: center;">
                    ${video.instruction}
                </div>
            `,
            choices: ["Proceed to Video"]
        };
  

        let videoStartTime = parseFloat(video.url.match(/start=(\d+)/)?.[1]) || 0;
        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div style="text-align: center;">
                    <p style="font-size: 18px;">${video.message}</p>
                    <iframe 
                        style="width: 81vw; height: 45.5625vw; max-width: 1296px; max-height: 729px;"
                        src="${video.url}"
                        frameborder="0"
                        allow="autoplay; encrypted-media"
                        allowfullscreen>
                    </iframe>
                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 10px;">
                        <button id="next-button-${index}"
                                style="font-size: 18px; padding: 10px 20px; background-color: #ccc; border: none; cursor: pointer;">
                            ${index === videoList.length - 1 ? "Finish Section" : "Proceed to Next Video"}
                        </button>
                    </div>
                </div>
            `,
            choices: "NO_KEYS",
            trial_duration: null,
            on_load: function () {
                removeAllKeyListeners();
  
                let pressStart = null;
                let keyIsDown = false;
  
                handleKeydown = function(event) {
                    if (event.code === "Space" && !keyIsDown) {
                        keyIsDown = true;
                        pressStart = performance.now() / 1000;
                        console.log("Space bar pressed (DOWN) at", pressStart, "seconds");
                    }
                };
  
                handleKeyup = function(event) {
                    if (event.code === "Space" && keyIsDown) {
                        keyIsDown = false;
                        let pressEnd = performance.now() / 1000;
                        console.log("Space bar released (UP) at", pressEnd, "seconds");
  
                        let dataToSend = {
                            participantID: participantID,
                            dateTime: getFormattedDateTime(),
                            experimentBlock: 3,
                            videoNumber: video.number,
                            startTime: Number((videoStartTime + pressStart).toFixed(3)),
                            endTime: Number((videoStartTime + pressEnd).toFixed(3))
                        };
  
                        console.log("Sending data to Google Sheets (no-cors):", dataToSend);
  
                        fetch(GOOGLE_SHEETS_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ experimentData: dataToSend }),
                            mode: "no-cors"
                        })
                        .catch(err => {
                            console.error("Error sending data:", err);
                        });
                    }
                };
  
                document.addEventListener("keydown", handleKeydown);
                document.addEventListener("keyup", handleKeyup);
  
  
                document.getElementById(`next-button-${index}`).addEventListener("click", () => {
                    jsPsych.finishTrial();
                });
            }
        };
  
  
        timeline.push(instructionTrial);
        timeline.push(videoTrial);
    });
  

    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: "<p style='font-weight: normal; font-size: 20px;'>Please inform the researcher that you have completed this section</p>",
        choices: []
    });
  

    jsPsych.run(timeline);
});
