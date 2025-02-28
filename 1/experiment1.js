/****************************************************
 * experiment1.js - Version 6
 * - Restored original intro
 * - Instruction page + video page
 * - 6-field data output
 * - Bigger proceed button
 ****************************************************/

// 1) Check for YouTube API
if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
    console.log("Loading YouTube API...");
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    console.log("YouTube API already loaded.");
  }
  
  // 2) Called by YouTube when the API is ready
  function onYouTubeIframeAPIReady() {
    console.log("YouTube API Loaded and Ready.");
  }
  
  // 3) Generate or retrieve Participant ID
  function getParticipantID() {
    let participantID = localStorage.getItem("participantID");
    if (!participantID || participantID.length > 6) {
      participantID = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("participantID", participantID);
    }
    console.log("Participant ID:", participantID);
    return participantID;
  }
  
  // 4) Shuffle array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // 5) Utility: format date/time as YYYY-MM-DD HH:MM:SS
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
  
  // 6) Global references for key handlers
  let handleKeydown;
  let handleKeyup;
  function removeAllKeyListeners() {
    console.log("🛑 Removing old event listeners before adding new ones...");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
  }
  
  // 7) Main experiment code
  document.addEventListener("DOMContentLoaded", function () {
    console.log("experiment1.js - Version 6");
    console.log("Document loaded. Initializing experiment...");
  
    // 7a) Initialize jsPsych
    let jsPsych = initJsPsych({
      on_finish: function() {
        console.log("Experiment finished.");
      }
    });
  
    // 7b) Create a timeline array
    let timeline = [];
  
    // 7c) Get (or create) participant ID
    let participantID = getParticipantID();
  
    // 7d) Your Google Apps Script endpoint
    const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzsvZbu4Yk-KlH_T_iBuXxcst19Lh88VLGX6_25w2_XA2BTc3WDqyNG9IyvYmIMcvxUwQ/exec";
  
    // 7e) Intro screen (restored original style)
    let startExperiment = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="text-align: center;">
            <h2 style="font-size: 36px;">Experimental section</h2>
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
    timeline.push(startExperiment);
  
    // 7f) Define video list, each with an instruction page + a main message
    let videoList = [
      {
        number: 1,
        instruction: `
          <h2>Video #1 Instructions</h2>
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            Imagine you are the driver. Press and hold the space bar when you would start slowing down
            and release it when you would speed up again.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=3&end=32&autoplay=1&mute=1&disablekb=1&modestbranding=1&rel=0",
        message: "Press and hold space to slow, release to speed up."
      },
      {
        number: 2,
        instruction: `
          <h2>Video #2 Instructions</h2>
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            Imagine you are the driver, approaching a crosswalk. 
            Press and hold space to yield, release to continue.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=36&end=65&autoplay=1&mute=1&disablekb=1&modestbranding=1&rel=0",
        message: "Press space to yield, release to continue."
      },
      {
        number: 3,
        instruction: `
          <h2>Video #3 Instructions</h2>
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            Imagine you are a cyclist. Press and hold space to slow or yield,
            release to resume normal speed.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=69&end=98&autoplay=1&mute=1&disablekb=1&modestbranding=1&rel=0",
        message: "Press space to slow/yield, release to speed up."
      },
      {
        number: 4,
        instruction: `
          <h2>Video #4 Instructions</h2>
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            Another driving scenario. 
            Press and hold space whenever you'd slow down for safety, 
            and release when you'd speed up.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=102&end=141&autoplay=1&mute=1&disablekb=1&modestbranding=1&rel=0",
        message: "Press space to slow, release to speed up."
      },
      {
        number: 5,
        instruction: `
          <h2>Video #5 Instructions</h2>
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            Imagine you are a pedestrian. Press space to indicate crossing, 
            release if you'd stop or wait.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=146&end=175&autoplay=1&mute=1&disablekb=1&modestbranding=1&rel=0",
        message: "Press space to cross, release to wait."
      },
      {
        number: 6,
        instruction: `
          <h2>Video #6 Instructions</h2>
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            Final scenario. Press space bar whenever you'd slow or yield,
            release to resume normal speed.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=179&end=208&autoplay=1&mute=1&disablekb=1&modestbranding=1&rel=0",
        message: "Press space to slow, release to speed up."
      }
    ];
  
    // Shuffle them so the order is random
    shuffleArray(videoList);
  
    // 7g) For each video, create 2 trials: instruction → video
    videoList.forEach((video, index) => {
  
      // (A) Instruction page
      let instructionTrial = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
          <div style="text-align: center;">
            ${video.instruction}
          </div>
        `,
        choices: ["Begin Video"]
      };
  
      // (B) The video trial with space bar logic
      let videoStartTime = parseFloat(video.url.match(/start=(\\d+)/)?.[1]) || 0;
  
      let videoTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
          <div id="video-container" style="text-align: center;">
            <p style="font-size: 18px;">${video.message}</p>
            <iframe 
                style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                src="${video.url}" 
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>
            <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 10px;">
              <button id="next-button-${index}"
                      style="font-size: 18px; padding: 10px 20px; background-color: #ccc; border: none; cursor: pointer;">
                ${index === videoList.length - 1 ? "Finish Section" : "Proceed to Next Trial"}
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
  
              // Build 6-field data
              let dataToSend = {
                participantID: participantID,
                dateTime: getFormattedDateTime(),
                experimentBlock: 1,
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
  
          // Attach new key listeners
          document.addEventListener("keydown", handleKeydown);
          document.addEventListener("keyup", handleKeyup);
  
          // Next/Finish button
          document.getElementById(`next-button-${index}`).addEventListener("click", () => {
            jsPsych.finishTrial();
          });
        }
      };
  
      // Add both trials to the timeline
      timeline.push(instructionTrial);
      timeline.push(videoTrial);
    });
  
    // 7h) Final screen
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h2>All videos complete!</h2>
        <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: center;">
          Thank you for participating.
        </p>
      `,
      choices: []
    });
  
    // 7i) Run the experiment
    jsPsych.run(timeline);
  });
  