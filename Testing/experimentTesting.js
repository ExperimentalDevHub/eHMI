console.log("experimentTesting.js - Version 1");

// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", function() {
  console.log("Document loaded. Initializing experiment...");

  // Initialize jsPsych (make sure your HTML loads jspsych.js and the plugins beforehand)
  let jsPsych = initJsPsych({
    on_finish: function() {
      console.log("Experiment finished.");
    }
  });

  // Replace with your Google Apps Script web app URL.
  const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbz09kp140En8jEb_svivi6u-xiG-puZiQ5EDYyCx8b4ksHpklFSXfZCGJ0py5j6z66e6w/exec";

  // Create a timeline for the experiment
  let timeline = [];

  // Define a simple trial that listens for a space bar press.
  let simpleTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <h1>YES, the website is working!</h1>
      <p>Press the space bar to record your tap and send it to Google Sheets.</p>
    `,
    choices: [" "], // Only the space bar is accepted.
    on_finish: function(data) {
      console.log("Space bar pressed!", data);

      // Build the data object to send. Customize fields as needed.
      let dataToSend = {
        participantID: "exampleID", // You can replace this with a generated or stored participant ID.
        date: new Date().toISOString().split('T')[0],
        experimentCode: 1,
        key_press: data.response, // The key code (should be space bar)
        rt: data.rt             // Reaction time (in ms)
      };

      // Send data to Google Sheets via the Web App.
      fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentData: dataToSend })
        // You may add mode: "no-cors" if you run into CORS issues,
        // but note that this will prevent you from reading the response.
      })
      .then(response => response.json())
      .then(responseData => {
        console.log("Data sent successfully:", responseData);
      })
      .catch(error => {
        console.error("Error sending data:", error);
      });
    }
  };

  timeline.push(simpleTrial);

  // Start the experiment.
  jsPsych.run(timeline);
});
