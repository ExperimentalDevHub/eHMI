// experiment1.js

// === Load YouTube IFrame API if needed ===
if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Flag the API-ready callback
function onYouTubeIframeAPIReady() {
    // YouTube IFrame API is now available
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getFormattedDateTime() {
    let d = new Date();
    let year   = d.getFullYear();
    let month  = String(d.getMonth() + 1).padStart(2, "0");
    let day    = String(d.getDate()).padStart(2, "0");
    let hour   = String(d.getHours()).padStart(2, "0");
    let minute = String(d.getMinutes()).padStart(2, "0");
    let second = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

let handleKeydown;
let handleKeyup;

function removeAllKeyListeners() {
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
}

document.addEventListener("DOMContentLoaded", function () {
    let jsPsych = initJsPsych({
        on_finish: function() {}
    });

    let timeline = [];
    let participantID = localStorage.getItem("participantID");
    const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzsvZbu4Yk-KlH_T_iBuXxcst19Lh88VLGX6_25w2_XA2BTc3WDqyNG9IyvYmIMcvxUwQ/exec";

    // --- Intro screen ---
    let introTrial = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="text-align: center;">
                <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
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

    // --- Your six videos ---
    let videoList = [
        {
            number: 1,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the driver</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> Down the road</li>
                        <li><strong>Objective:</strong> Drive through the intersection</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection from the right side</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/KOYF5LLaI-Q?start=11&end=27&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe driving."
        },
        {
            number: 2,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the driver</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> At the end of the road</li>
                        <li><strong>Objective:</strong> Continue driving straight</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane is indicating a left turn into an alleyway, crossing your path</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/KOYF5LLaI-Q?start=42&end=58&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe driving."
        },
        {
            number: 3,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the driver</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> At the end of the road</li>
                        <li><strong>Objective:</strong> Continue driving straight</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) has dropped off a passenger and wants to begin driving again</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/KOYF5LLaI-Q?start=73&end=89&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe driving."
        },
        {
            number: 4,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the driver</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are late for an appointment</li>
                        <li><strong>Destination:</strong> At the end of the road</li>
                        <li><strong>Objective:</strong> Continue driving straight</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane is indicating a left turn into an alleyway (pedestrian zone), crossing your path</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/KOYF5LLaI-Q?start=104&end=120&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe driving."
        },
        {
            number: 5,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the driver</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> You are driving on the highway</li>
                        <li><strong>Objective:</strong> Continue driving in your lane</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) is overtaking you on the left side</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/KOYF5LLaI-Q?start=136&end=153&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe driving."
        },
        {
            number: 6,
            instruction: `
                <div style="max-width: 800px; margin: auto; text-align: left;">
                    <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">Imagine being the driver</h1>
                    <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
                        <li><strong>Context:</strong> The number of lanes on the highway reduced to one due to construction work</li>
                        <li><strong>Objective:</strong> Continue driving in your lane</li>
                        <li><strong>Other actors:</strong> A vehicle (grey SUV) is merging into the road in front of you from the right side</li>
                    </ul>
                </div>
            `,
            url: "https://www.youtube.com/embed/KOYF5LLaI-Q?start=167&end=183&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
            message: "After the countdown, press and hold the space bar. Continue holding as long as you would feel safe driving."
        }
    ];

    videoList.forEach(video => {
        // inject enablejsapi=1 just after the “?” 
        if (!/enablejsapi=1/.test(video.url)) {
          video.url = video.url.replace("?", "?enablejsapi=1&");
        }
      });
      

    shuffleArray(videoList);

    videoList.forEach((video, index) => {
        // Instruction screen
        let instructionTrial = {
            type: jsPsychHtmlButtonResponse,
            stimulus: `<div style="text-align: center;">${video.instruction}</div>`,
            choices: ["Proceed to Video"]
        };

        // Extract the “start=” offset so your original startTime/endTime still work
        let videoStartTime = parseFloat(video.url.match(/start=(\d+)/)?.[1]) || 0;

        // The video trial itself
        let videoTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <div style="text-align: center;">
                    <p style="font-size: 18px;">${video.message}</p>
                    <iframe
                        id="player-${index}"                                  
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

                let sitePressStart  = 0;
                let sitePressEnd    = 0;
                let videoPressStart = 0;
                let videoPressEnd   = 0;
                let keyIsDown       = false;
                // … inside on_load of your videoTrial …

let player = null;
let playerReady = false;

// Called once the IFrame API hooks into that <iframe>
function onPlayerReady(event) {
  player    = event.target;
  playerReady = true;
}

// Try to instantiate the player; return true if we did
function tryMakePlayer() {
  if (window.YT && YT.Player) {
    new YT.Player(`player-${index}`, {
      events: { onReady: onPlayerReady }
    });
    return true;
  }
  return false;
}

// Poll until YT.Player exists, then wire up
if (!tryMakePlayer()) {
  let poll = setInterval(() => {
    if (tryMakePlayer()) clearInterval(poll);
  }, 100);
}


// On space‐down:
handleKeydown = e => {
  if (e.code === "Space" && !keyIsDown) {
    keyIsDown = true;
    sitePressStart = performance.now() / 1000;
    // only grab video time if the player is truly ready
    videoPressStart = playerReady
      ? player.getCurrentTime()
      : null;
  }
};

// On space‐up:
handleKeyup = e => {
  if (e.code === "Space" && keyIsDown) {
    keyIsDown = false;
    sitePressEnd = performance.now() / 1000;
    videoPressEnd = playerReady
      ? player.getCurrentTime()
      : null;

    let dataToSend = {
      participantID,
      dateTime: getFormattedDateTime(),
      experimentBlock: 1,
      videoNumber: video.number,

      // site time (cumulative)
      startTime: +sitePressStart.toFixed(3),
      endTime:   +sitePressEnd.toFixed(3),

      // only real video‐time if ready; else blank
      videoTimestampStart: videoPressStart !== null ? +videoPressStart.toFixed(3) : "",
      videoTimestampEnd:   videoPressEnd   !== null ? +videoPressEnd.toFixed(3)   : ""
    };

    console.log("sending payload:", JSON.stringify(dataToSend, null, 2));

    fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experimentData: dataToSend }),
      mode: "no-cors"
    });
  }
};

                  
                  document.addEventListener("keydown", handleKeydown);
                  document.addEventListener("keyup",   handleKeyup);

                document.getElementById(`next-button-${index}`)
                    .addEventListener("click", () => jsPsych.finishTrial());
            }
        };

        timeline.push(instructionTrial);
        timeline.push(videoTrial);
    });

    // Final “section complete” screen
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: "<p style='font-weight: normal; font-size: 20px;'>Please inform the researcher that you have completed this section</p>",
        choices: []
    });

    jsPsych.run(timeline);
});
