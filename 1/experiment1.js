/****************************************************
 * experiment1.js - No button_html usage
 * - Original video number
 * - Gray styled buttons (via global CSS)
 * - 10% smaller video
 * - Final screen uses HtmlKeyboardResponse
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
  
  // 5) Format date/time as YYYY-MM-DD HH:MM:SS
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
  
  // 6) Key handler references
  let handleKeydown;
  let handleKeyup;
  function removeAllKeyListeners() {
    console.log("🛑 Removing old event listeners before adding new ones...");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyup);
  }
  
  // 7) Main experiment code
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Experiment code loaded. Starting...");
  
    // 7a) Initialize jsPsych
    let jsPsych = initJsPsych({
      on_finish: function() {
        console.log("Experiment finished.");
      }
    });
  
    // 7b) Timeline
    let timeline = [];
  
    // 7c) Participant ID
    let participantID = getParticipantID();
  
    // 7d) Your Google Apps Script URL
    const GOOGLE_SHEETS_URL = "YOUR_GOOGLE_WEB_APP_URL";
  
    // 7e) Intro screen
    let introTrial = {
      type: "html-button-response",
      stimulus: `
        <div style="text-align: center;">
            <img src="../HFASt Logo.png" alt="Lab Logo" style="max-width: 300px; margin-bottom: 20px;">
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
      choices: ["Start Experiment"] // The .jspsych-btn style is in global CSS
    };
    timeline.push(introTrial);
  
    // 7f) The 6 videos (randomized). Each has an instruction screen + a video trial
    let videoList = [
      {
        number: 1,
        instruction: `
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            In the upcoming video, press and hold the space bar when you would start slowing down 
            and let go when you would speed up.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=3&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        message: "Press and hold the space bar when you would start slowing down and let go when you would speed up"
      },
      {
        number: 2,
        instruction: `
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            In the upcoming video, press and hold the space bar when you would start slowing down 
            to yield.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=36&end=65&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        message: "Press and hold the space bar when you would start slowing down to yield"
      },
      {
        number: 3,
        instruction: `
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            In the upcoming video, press and hold the space bar when you would start slowing down 
            to yield.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=69&end=98&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        message: "Press and hold the space bar when you would start slowing down to yield"
      },
      {
        number: 4,
        instruction: `
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            In the upcoming video, press and hold the space bar when you would start slowing down 
            to yield.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=102&end=141&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        message: "Press and hold the space bar when you would start slowing down to yield"
      },
      {
        number: 5,
        instruction: `
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            In the upcoming video, press and hold the space bar when you would start slowing down 
            to yield.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=146&end=175&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        message: "Press and hold the space bar when you would start slowing down to yield"
      },
      {
        number: 6,
        instruction: `
          <p style="font-size: 20px; max-width: 800px; margin: auto; text-align: justify;">
            In the upcoming video, press and hold the space bar when you would start slowing down 
            to yield.
          </p>
        `,
        url: "https://www.youtube.com/embed/tEp5Ufrsn7M?start=179&end=208&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
        message: "Press and hold the space bar when you would start slowing down to yield"
      }
    ];
  
    // Shuffle them
    shuffleArray(videoList);
  
    // 7g) Build instruction + video trial for each
    videoList.forEach((video, index) => {
      // Instruction page
      let instructionTrial = {
        type: "html-button-response",
        stimulus: `
          <div style="text-align: center;">
            ${video.instruction}
          </div>
        `,
        choices: ["Proceed to Video"] // styled via .jspsych-btn
      };
  
      // Video page (10% smaller: 80vw x 45vw)
      let videoStartTime = parseFloat(video.url.match(/start=(\\d+)/)?.[1]) || 0;
      let videoTrial = {
        type: "html-keyboard-response",
        stimulus: `
          <div style="text-align: center;">
            <p style="font-size: 18px;">${video.message}</p>
            <iframe
              style="width: 80vw; height: 45vw; max-width: 1280px; max-height: 720px;"
              src="${video.url}"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen>
            </iframe>
            <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 10px;">
              <button id="next-button-${index}" class="jspsych-btn">
                ${index === videoList.length - 1 ? "Finish Section" : "Proceed to Next Trial"}
              </button>
            </div>
          </div>
        `,
        choices: "NO_KEYS",
        on_load: function() {
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
  
    // 7h) Final screen (HtmlKeyboardResponse, no button needed)
    let finalScreen = {
      type: "html-keyboard-response",
      stimulus: `
        <p style="font-size: 20px; text-align: center;">
          Please inform the researcher that you have completed this section
        </p>
      `,
      choices: "NO_KEYS"
    };
    timeline.push(finalScreen);
  
    // 7i) Run
    jsPsych.run(timeline);
  });
  