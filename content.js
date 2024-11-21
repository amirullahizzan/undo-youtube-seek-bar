let undoStack = []; // Stores past playback times
let redoStack = []; // Stores "redo" playback times
let playbackInterval = null; // Interval for tracking playback time

// Start tracking playback time
function startTracking() {
  if (playbackInterval) clearInterval(playbackInterval); // Clear previous interval if exists

  let saveInterval = 3000; //5 seconds
  playbackInterval = setInterval(() => {
    const video = document.querySelector("video");
    if (video) 
      {
      const currentTime = video.currentTime;

      // Avoid duplicates in the undo stack
      if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== currentTime) 
        {
        undoStack.push(currentTime);

        // Clear redo stack since a new action invalidates redo
        redoStack = [];
      }

      // Limit undo stack size (e.g., last 10 actions)
      if (undoStack.length > 10) 
        {
        undoStack.shift();
      }
    }
  }, saveInterval); 
}

// Undo function
function undoSeek() {
  const video = document.querySelector("video");
  if (video && undoStack.length > 1) {
    const lastTime = undoStack.pop(); // Remove current time
    redoStack.push(lastTime); // Push it into redo stack
    video.currentTime = undoStack[undoStack.length - 1]; // Jump to the previous time

    // Restart the tracking interval
    startTracking();
  }
}

// Redo function
function redoSeek() {
  const video = document.querySelector("video");
  if (video && redoStack.length > 0) {
    const redoTime = redoStack.pop(); // Get the last redo time
    undoStack.push(redoTime); // Push it back into the undo stack
    video.currentTime = redoTime; // Jump to the redo time

    // Restart the tracking interval
    startTracking();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") {
    undoSeek(); // Go back to the previous time
  } else if (e.ctrlKey && e.key === "y") {
    redoSeek(); // Go forward to the next time
  }
});

// Start tracking when the page loads
startTracking();
