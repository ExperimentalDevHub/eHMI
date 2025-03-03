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

function getParticipantID() {
  let participantID = localStorage.getItem("participantID");
  if (!participantID || participantID.length !== 3) {
    participantID = Math.floor(100 + Math.random() * 900).toString();
    localStorage.setItem("participantID", participantID);
  }
  console.log("Participant ID:", participantID);
  return participantID;
}

// Although defined, shuffleArray is not used because we want a fixed order.
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
    on_finish: function () {
      console.log("Experiment finished.");
    }
  });

  let timeline = [];
  let participantID = getParticipantID();
  const GOOGLE_SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbzsvZbu4Yk-KlH_T_iBuXxcst19Lh88VLGX6_25w2_XA2BTc3WDqyNG9IyvYmIMcvxUwQ/exec";

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

  // Full list of 36 video items
  let videoList = [
    {
      number: 1,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=11&end=32&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 2,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cross mid block (jaywalk)</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=47&end=68&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 3,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=83&end=104&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 4,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection, indicating a right turn</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=119&end=141&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 5,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cross mid block (jaywalk)</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) nearby dropped off a passenger; wants to begin driving again</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=156&end=179&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 6,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Continue walking straight</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane indicates turning into an alleyway (pedestrian zone) on your right</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=193&end=216&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 7,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Drive through the intersection</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection from the right side</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=231&end=253&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 8,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> At the end of the road</li>
          <li><strong>Objective:</strong> Continue driving straight</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane is indicating a left turn into an alleyway, crossing your path</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=268&end=291&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 9,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> At the end of the road</li>
          <li><strong>Objective:</strong> Continue driving straight</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) has dropped off a passenger and wants to begin driving again</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=306&end=328&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 10,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> At the end of the road</li>
          <li><strong>Objective:</strong> Continue driving straight</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane is indicating a left turn into an alleyway (pedestrian zone), crossing your path</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=343&end=366&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 11,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are driving on the highway</li>
          <li><strong>Objective:</strong> Continue driving in your lane</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is overtaking you on the left side</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=381&end=403&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 12,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are driving on the highway</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Continue driving in your lane</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is merging into the road in front of you from the right side</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=418&end=439&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 13,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cycle at the pedestrian crossing to cross the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection, indicating a right turn</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=526&end=548&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 14,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cycle straight through an intersection</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection, indicating a right turn</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=563&end=585&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 15,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cycle straight down the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) ahead dropped off a passenger; wants to begin driving again</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=600&end=622&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 16,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cycle straight down the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane indicates turning into an alleyway (pedestrian zone) on your right</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=637&end=660&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 17,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection, indicating a right turn</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=675&end=696&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 18,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cross mid block (jaywalk)</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=711&end=732&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 19,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Continue walking straight</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane indicates turning into an alleyway (pedestrian zone) on your right</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=747&end=769&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 20,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=783&end=805&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 21,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cross at the pedestrian crossing</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=820&end=843&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 22,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the pedestrian
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cross mid block (jaywalk)</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) nearby dropped off a passenger; wants to begin driving again</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=858&end=881&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (walking) the road."
    },
    {
      number: 23,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Drive through the intersection</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection from the right side</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=896&end=922&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 24,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> At the end of the road</li>
          <li><strong>Objective:</strong> Continue driving straight</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane is indicating a left turn into an alleyway (pedestrian zone), crossing your path</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=937&end=960&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 25,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> At the end of the road</li>
          <li><strong>Objective:</strong> Continue driving straight</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane is indicating a left turn into an alleyway, crossing your path</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=975&end=997&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 26,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> At the end of the road</li>
          <li><strong>Objective:</strong> Continue driving in your lane</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is overtaking you on the left side</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1012&end=1035&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 27,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are driving on the highway</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Continue driving in your lane</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is overtaking you on the left side</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1050&end=1071&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 28,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the driver
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are driving on the highway</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Continue driving in your lane</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is merging into the road in front of you from the right side</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1086&end=1107&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe driving."
    },
    {
      number: 29,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cycle at the pedestrian crossing to cross the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1122&end=1143&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 30,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cycle at the pedestrian crossing to cross the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1122&end=1143&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 31,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cycle at the pedestrian crossing to cross the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection, indicating a right turn</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1158&end=1179&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 32,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Across the road</li>
          <li><strong>Objective:</strong> Cycle mid block to cross the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1158&end=1179&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 33,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cycle at the pedestrian crossing to cross the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection, indicating a right turn</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1194&end=1216&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 34,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cycle straight through an intersection</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) is approaching the same intersection, indicating a right turn</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1231&end=1253&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 35,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cycle straight down the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) ahead dropped off a passenger; wants to begin driving again</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1269&end=1291&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    },
    {
      number: 36,
      instruction: `
      <div style="max-width: 800px; margin: auto; text-align: left;">
        <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px;">
          Imagine being the cyclist
        </h1>
        <ul style="font-size: 20px; list-style-type: disc; padding-left: 40px; line-height: 1.8;">
          <li><strong>Context:</strong> You are late for an appointment</li>
          <li><strong>Destination:</strong> Down the road</li>
          <li><strong>Objective:</strong> Cycle straight down the road</li>
          <li><strong>Other actors:</strong> A vehicle (grey SUV) in the oncoming lane indicates turning into an alleyway (pedestrian zone) on your right</li>
        </ul>
      </div>
    `,
      url: "https://www.youtube.com/embed/-FWMwYM-bqQ?start=1306&end=1329&autoplay=1&mute=1&cc_load_policy=0&disablekb=1&modestbranding=1&rel=0",
      message: "Press and hold the space bar when you would feel safe crossing (cycling) the road."
    }
];


  // Set the order of displayed videos as follows:
  // Group 1: Videos 1–6
  // Group 2: Videos 13–18
  // Group 3: Videos 7–12
  // Group 4: Videos 19–24
  // Group 5: Videos 31–36
  // Group 6: Videos 25–30
  let group1 = videoList.filter(video => video.number >= 1 && video.number <= 6);
  let group2 = videoList.filter(video => video.number >= 13 && video.number <= 18);
  let group3 = videoList.filter(video => video.number >= 7 && video.number <= 12);
  let group4 = videoList.filter(video => video.number >= 19 && video.number <= 24);
  let group5 = videoList.filter(video => video.number >= 31 && video.number <= 36);
  let group6 = videoList.filter(video => video.number >= 25 && video.number <= 30);
  let orderedVideoList = group1.concat(group2, group3, group4, group5, group6);

  // Create trials for each video in the ordered list
  orderedVideoList.forEach((video, index) => {
    let instructionTrial = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
              <div style="text-align: center;">
                  ${video.instruction}
              </div>
          `,
      choices: ["Proceed to Video"]
    };

    // Corrected regex: using a single backslash to extract the start time properly.
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
                          ${index === orderedVideoList.length - 1 ? "Finish Section" : "Proceed to Next Video"}
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

        handleKeydown = function (event) {
          if (event.code === "Space" && !keyIsDown) {
            keyIsDown = true;
            pressStart = performance.now() / 1000;
            console.log("Space bar pressed (DOWN) at", pressStart, "seconds");
          }
        };

        handleKeyup = function (event) {
          if (event.code === "Space" && keyIsDown) {
            keyIsDown = false;
            let pressEnd = performance.now() / 1000;
            console.log("Space bar released (UP) at", pressEnd, "seconds");

            let dataToSend = {
              participantID: participantID,
              dateTime: getFormattedDateTime(),
              experimentBlock: 11,
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
            }).catch(err => {
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
