window.addEventListener("DOMContentLoaded", async () => {
  const soundIcon = document.getElementById("sound-icon");
  const muteIcon = document.getElementById("mute-icon");

  // Use or create the audio element
  let backgroundMusic = document.getElementById("background-music");
  if (!backgroundMusic) {
    backgroundMusic = new Audio("song.m4a");
    backgroundMusic.id = "background-music";
    backgroundMusic.loop = true;
    backgroundMusic.preload = "auto"; // Preload the audio
    document.body.appendChild(backgroundMusic);
  } else {
    backgroundMusic.preload = "auto";
  }

  // Load saved states
  const savedTime = parseFloat(localStorage.getItem("musicTime") || "0");
  const wasPlaying = localStorage.getItem("musicPlaying") === "true";
  const isMuted = localStorage.getItem("musicMuted") === "true";

  // Apply states
  backgroundMusic.currentTime = savedTime;
  backgroundMusic.muted = isMuted;

  // Update icons based on mute state
  if (isMuted) {
    soundIcon.style.display = "none";
    muteIcon.style.display = "block";
  } else {
    soundIcon.style.display = "block";
    muteIcon.style.display = "none";
  }

  // Auto-play if it was playing before (with user interaction fallback)
  if (wasPlaying) {
    try {
      await backgroundMusic.play();
      localStorage.setItem("musicPlaying", "true");
    } catch (err) {
      console.log("Autoplay blocked; adding click listener to resume.");
      
      // Add one-time click listener to resume music
      const resumeMusic = async () => {
        try {
          await backgroundMusic.play();
          localStorage.setItem("musicPlaying", "true");
          document.removeEventListener("click", resumeMusic);
        } catch (e) {
          console.log("Still blocked:", e);
        }
      };
      document.addEventListener("click", resumeMusic);
    }
  }

  // Sync storage every second
  setInterval(() => {
    localStorage.setItem("musicTime", backgroundMusic.currentTime);
    localStorage.setItem("musicPlaying", !backgroundMusic.paused);
    localStorage.setItem("musicMuted", backgroundMusic.muted);
  }, 1000);

  // Icon interactions
  soundIcon.addEventListener("click", () => {
    backgroundMusic.muted = true;
    soundIcon.style.display = "none";
    muteIcon.style.display = "block";
    localStorage.setItem("musicMuted", "true");
  });

  muteIcon.addEventListener("click", async () => {
    backgroundMusic.muted = false;
    muteIcon.style.display = "none";
    soundIcon.style.display = "block";
    localStorage.setItem("musicMuted", "false");

    // If music was paused, play it
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        localStorage.setItem("musicPlaying", "true");
      } catch (err) {
        console.log("Autoplay blocked after unmute.");
      }
    }
  });
});