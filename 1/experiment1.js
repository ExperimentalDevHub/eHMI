/****************************************************
 * experiment1.js - Debug Version
 ****************************************************/

// 1) YouTube API check
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
  
  // 4) Shuffle function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // 5) Global references for key handlers
  let handleKeydown;
  let handleKeyup;
  
  function removeAllKeyListeners() {
    console.log("🛑 Removing old event listeners before adding new ones...");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
  }
  
  // 6) Main experiment code
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document Loaded, Initializing Experiment...");
  
    // 6a) Initialize jsPsych
    let jsPsych = initJsPsych({
      on_finish: () => {
        console.log("Experiment finished.");
      }
    });
  
    // 6b) Create timeline
    let timeline = [];
  
    // 6c) Get participant ID
    let participantID = getParticipantID();
  
    // 6d) Your Google Apps Script endpoint
    //     (MUST match your deployed "Web App" URL in script.google.com)
    let GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyiOfOZB1JKufXdhuRLjzleRSUg2tMpEBYrADm0NR1b8on1DDcvBw_hzqWpVBDBXDja/exec";
    
    // --- DEBUG STEP #1: Check if server is reachable via GET ---
    // We'll call doGet(e) which should return "Hello from doGet!"
    // This helps confirm you have the correct URL and public access.
    console.log("Attempting GET request to test connectivity...");
    fetch(GOOGLE_SHEETS_URL + "?test=connectivity")
      .then(response => response.text())
      .then(txt => {
        console.log("GET response from server:", txt);
        // If you see something like {"status":"success","message":"Hello from doGet!",...}
        // it means the web app is reachable.
      })
      .catch(err => {
        console.error("GET request failed. Possible wrong URL or permissions:", err);
      });
  
    // 6e) Intro screen
    let startExperiment = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="text-align: center;">
            <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
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
  
    // 6f) Video list
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
  
    // Shuffle the video order
    shuffleArray(videoList);
  
    // 6g) Build trials for each video
    videoList.forEach((video, index) => {
      // Grab the "start=" param to align timing
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
          // Remove old listeners
          removeAllKeyListeners();
  
          let pressStart = null;
          let keyHandled = false;
  
          // 6g-i) Keydown
          handleKeydown = function(event) {
            if (event.code === "Space" && !keyHandled) {
              pressStart = performance.now() / 1000; 
              keyHandled = true;
              console.log("Space bar DOWN at", pressStart, "seconds (video start time:", videoStartTime, ")");
            }
          };
  
          // 6g-ii) Keyup
          handleKeyup = function(event) {
            if (event.code === "Space" && keyHandled) {
              keyHandled = false; 
              let pressEnd = performance.now() / 1000;
              console.log("Space bar UP at", pressEnd, "seconds");
  
              // Build data object. 
              // Your doPost(e) appends [participantID, date, experimentCode].
              // If you want more columns, you must update doPost in your script.
              let dataToSend = {
                participantID: parseInt(participantID, 10),
                date: new Date().toISOString(),  // "date" matches doPost
                experimentCode: 1
              };
  
              // Debug info: 
              // We'll log start/end times locally, but your script won't store them
              // unless you change doPost() to append them. 
              console.log("Calculated startTime (approx):", (videoStartTime + pressStart).toFixed(3));
              console.log("Calculated endTime (approx):", (videoStartTime + pressEnd).toFixed(3));
  
              // POST request
              console.log("Sending data to Google Sheets (no-cors):", dataToSend);
              fetch(GOOGLE_SHEETS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ experimentData: dataToSend }),
                mode: "no-cors"
              })
              .then(() => {
                console.log("POST request finished (no-cors). Can't read server response, but no fetch error.");
              })
              .catch(err => {
                console.error("POST request encountered an error:", err);
              });
            }
          };
  
          // Attach new listeners
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
      stimulus: "<h2>Please inform the researcher that you have completed this section</h2>",
      choices: []
    });
  
    // 6i) Run jsPsych
    jsPsych.run(timeline);
  });
  