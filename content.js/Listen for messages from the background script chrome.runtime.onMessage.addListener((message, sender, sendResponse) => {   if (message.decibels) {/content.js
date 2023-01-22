// content.js

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.decibels) {
    // Display the decibel level on the page
    const decibelDisplay = document.createElement('div');
    decibelDisplay.innerText = `Decibel Level: ${message.decibels.toFixed(2)} dB`;
    document.body.appendChild(decibelDisplay);
  }
});
