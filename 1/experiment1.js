/****************************************************
 * experiment1.js - Version 3 (6-Field Data Output)
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
  
  // 5) Global key handler references
  let handleKeydown;
  let handleKeyup;
  function removeAllKeyListeners() {
    console.log("🛑 Removing old event listeners before adding new ones...");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
  }
  
  // 6) Main experiment code
  document.addEventListener("DOMContentLoaded", function () {
    console.log("experiment1.js - Version 3 (6-Field Data Output)");
    console.log("Document loaded. Initializing experiment...");
  
    // 6a) Initialize jsPsych
    let jsPsych = initJsPsych({
      on_finish: function() {
        console.log("Experiment finished.");
      }
    });
  
    // 6b) Timeline array
    let timeline = [];
  
    // 6c) Retrieve Participant ID
    let participantID = getParticipantID();
  
    // 6d) Google Apps Script Web App URL (update to your working URL)
    const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxtE-JJv2coBDlarZ3BnW_q60ARSqmlFHI9czn9a9vbKbP2GvK6fb3jb-hIAdEbfAM5eQ/exec";
  
    // 6e) Intro trial
    let startExperiment = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="text-align: center;">
            <h2 style="font-size: 36px;">Experimental section</h2>
            <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                In this experiment, you will be shown brief video clips to interact with. 
                Imagine yourself in the presented role (pedestrian, cyclist, or driver) and navigate the tasks 
                as you normally would using your computer's space bar. The videos will autoplay, so please do not try to control their playback.
                When you are ready to begin, select "Start Experiment."
            </p>
        </div>
      `,
      choices: ["Start Experiment"]
    };
    timeline.push(startExperiment);
  
    // 6f) Define video list (and shuffle if desired)
    let videoList = [
      { 
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=3&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
        message: "Press and hold the space bar when you would start slowing down and let go when you would speed up"
      },
      { 
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=36&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
        message: "Press and hold the space bar when you would start slowing down to yield"
      },
      { 
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=69&end=98&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
        message: "Press and hold the space bar when you would start slowing down to yield"
      },
      { 
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=102&end=141&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
        message: "Press and hold the space bar when you would start slowing down to yield"
      },
      { 
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=146&end=175&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
        message: "Press and hold the space bar when you would start slowing down to yield"
      },
      { 
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=179&end=208&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0", 
        message: "Press and hold the space bar when you would start slowing down to yield"
      }
    ];
    shuffleArray(videoList);
  
    // 6g) Build a trial for each video
    videoList.forEach((video, index) => {
      // Parse the start time from the video URL
      let videoStartTime = parseFloat(video.url.match(/start=(\d+)/)[1]) || 0;
  
      let videoTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
          <div id="video-container" style="text-align: center;">
            <p style="font-size: 18px;">${video.message}</p>
            <iframe id="experiment-video-${index}" 
                style="width: 90vw; height: 50.625vw; max-width: 1440px; max-height: 810px;"  
                src="${video.url}" 
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>
            <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 10px;">
              <button id="next-button-${index}">
                ${index === videoList.length - 1 ? "Finish Section" : "Proceed to Next Trial"}
              </button>
            </div>
          </div>
        `,
        choices: "NO_KEYS",
        trial_duration: null,
        on_load: function () {
          // Remove old key listeners to avoid duplicates
          removeAllKeyListeners();
    
          // Declare variables to record press times
          let pressStart = null;
          let pressEnd = null;
          let keyIsDown = false;
    
          // Keydown: record when space is pressed
          handleKeydown = function(event) {
            if (event.code === "Space" && !keyIsDown) {
              keyIsDown = true;
              pressStart = performance.now() / 1000; 
              console.log("Space bar pressed (DOWN) at", pressStart, "seconds");
            }
          };
    
          // Keyup: record when space is released, then send data
          handleKeyup = function(event) {
            if (event.code === "Space" && keyIsDown) {
              keyIsDown = false;
              pressEnd = performance.now() / 1000;
              console.log("Space bar released (UP) at", pressEnd, "seconds");
    
              // Build the data object with 6 fields:
              let dataToSend = {
                participantID: participantID,                           // Participant ID
                dateTime: new Date().toISOString(),                      // Date and Time
                experimentBlock: 1,                                      // Experiment Block (change as needed)
                videoNumber: index + 1,                                  // Video Number (1-6)
                startTime: Number((videoStartTime + pressStart).toFixed(3)), // Start Time
                endTime: Number((videoStartTime + pressEnd).toFixed(3))      // End Time
              };
    
              console.log("Sending data to Google Sheets (no-cors):", dataToSend);
    
              // POST the data using no-cors mode (response is opaque)
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
    
          // Attach the key event listeners
          document.addEventListener("keydown", handleKeydown);
          document.addEventListener("keyup", handleKeyup);
    
          // Next/Finish button handler ends the trial
          document.getElementById(`next-button-${index}`).addEventListener("click", () => {
            jsPsych.finishTrial();
          });
        }
      };
      timeline.push(videoTrial);
    });
    
    // 6h) Final screen
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h2>Please inform the researcher that you have completed this section</h2>
      `,
      choices: []
    });
    
    // 6i) Run the experiment
    jsPsych.run(timeline);
  });
  