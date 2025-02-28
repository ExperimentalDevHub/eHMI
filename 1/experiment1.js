/****************************************************
 * experiment1.js - Version 2 (Mirrors Working PoC)
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
  
  // 5) Key handler references
  let handleKeydown;
  let handleKeyup;
  
  function removeAllKeyListeners() {
    console.log("🛑 Removing old event listeners before adding new ones...");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
  }
  
  // 6) Main experiment code
  document.addEventListener("DOMContentLoaded", function () {
    console.log("experiment1.js - Version 2 (Mirrors Working PoC)");
    console.log("Document loaded. Initializing experiment...");
  
    // 6a) Initialize jsPsych
    let jsPsych = initJsPsych({
      on_finish: function() {
        console.log("Experiment finished.");
      }
    });
  
    // 6b) Timeline
    let timeline = [];
  
    // 6c) Get participant ID
    let participantID = getParticipantID();
  
    // 6d) Google Apps Script URL .
    //    (Replace this with your own working URL if needed)
    const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbx6xCm0X8YsL49Ln9LaisumLaiWT6ojwqJj3Y0hv95WAr1GGQJV2fQaL9BlBBnxCBIP/exec";
  
    // 6e) Intro trial
    let startExperiment = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="text-align: center;">
            <h2 style="font-size: 36px;">Experimental section</h2>
            <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
                In this experiment, you will be shown brief video clips to interact with. 
                Imagine yourself in the presented role (pedestrian, cyclist, or driver) 
                and navigate the tasks as you normally would using your computer's space bar. 
                The videos will autoplay, please do not try to control their playback. 
                When you are ready to begin, select "Start Experiment."
            </p>
        </div>
      `,
      choices: ["Start Experiment"]
    };
    timeline.push(startExperiment);
  
    // 6f) Video list (shuffle if you like)
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
        on_load: function() {
          // Remove old listeners
          removeAllKeyListeners();
  
          let keyIsDown = false;
  
          handleKeydown = function(event) {
            if (event.code === "Space" && !keyIsDown) {
              keyIsDown = true;
              console.log("Space bar pressed (DOWN).");
            }
          };
  
          handleKeyup = function(event) {
            if (event.code === "Space" && keyIsDown) {
              keyIsDown = false;
              console.log("Space bar released (UP).");
  
              // 6g-i) This is where we do the "on_finish" logic from your working PoC:
              // Build the data object
              let dataToSend = {
                participantID: participantID, // a string
                date: new Date().toISOString().split('T')[0], // from the working code
                experimentCode: 1
              };
  
              console.log("Sending data to Google Sheets (no-cors):", dataToSend);
  
              // Send data
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
  
          // Add the event listeners
          document.addEventListener("keydown", handleKeydown);
          document.addEventListener("keyup", handleKeyup);
  
          // Next/Finish button
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
  