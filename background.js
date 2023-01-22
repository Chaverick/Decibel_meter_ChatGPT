// background.js

// Initialize the microphone
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
  const audioContext = new AudioContext();
  const microphone = audioContext.createMediaStreamSource(stream);

  // Create an analyser node
  const analyser = audioContext.createAnalyser();
  microphone.connect(analyser);

  // Set the analyser's parameters
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Continuously update the decibel level
  setInterval(() => {
    analyser.getByteTimeDomainData(dataArray);

    // Calculate the decibel level
    let maxDecibels = -Infinity;
    for (let i = 0; i < bufferLength; i++) {
      const amplitude = dataArray[i] / 128;
      const decibels = 20 * Math.log10(amplitude);
      if (decibels > maxDecibels) {
        maxDecibels = decibels;
      }
    }

    // Send the decibel level to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { decibels: maxDecibels });
    });
  }, 100);
});

