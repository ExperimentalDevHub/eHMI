console.log("experimentTesting.js - Version 1");

document.addEventListener("DOMContentLoaded", function() {
  console.log("Document loaded. Initializing experiment...");

  // 1. Initialize jsPsych
  let jsPsych = initJsPsych({
    on_finish: function() {
      console.log("Experiment finished.");
    }
  });

  // 2. Your Google Apps Script web app URL
  const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxyWu6TdzxRb2v7Uw7O6F5UC_6Ry3GY6yUzBJqZME4KkC6KtOmgmZ64jvOTRPUXDcYZLQ/exec";

  // 3. A simple trial to record a space bar press
  let simpleTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <h1>YES, the website is working!</h1>
      <p>Press the space bar to record your tap and send it to Google Sheets.</p>
    `,
    choices: [" "],
    on_finish: function(data) {
      console.log("Space bar pressed!", data);

      // Build the data object
      let dataToSend = {
        participantID: "exampleID",
        date: new Date().toISOString().split('T')[0],
        experimentCode: 1
      };

      // 4. Send data to Google Sheets (no-cors mode)
      fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentData: dataToSend }),
        mode: "no-cors"  // Bypass CORS errors, but can't read the response
      })
      .catch(error => {
        console.error("Error sending data:", error);
      });

      // NOTE: Because mode: "no-cors" is used,
      // we can't do .then(response => response.json()) here.
    }
  };

  // 5. Run jsPsych
  jsPsych.run([simpleTrial]);
});
