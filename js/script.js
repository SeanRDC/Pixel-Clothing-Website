const startButton = document.getElementById('start-button');
const menuText = document.getElementById('menu-text');
const soundIcon = document.getElementById('sound-icon');
const muteIcon = document.getElementById('mute-icon');
const backgroundMusic = document.getElementById('background-music');
const blurOverlay = document.getElementById('blur-overlay');

console.log("Sound icon:", soundIcon);
console.log("Mute icon:", muteIcon);

let isPlaying = true;

// ===================================================
// PAGE READY
// ===================================================
window.addEventListener('DOMContentLoaded', () => {
  backgroundMusic.load();

  // Hide both icons at start
  if (soundIcon) {
    soundIcon.style.display = 'none';
    soundIcon.style.opacity = '0';
    soundIcon.classList.remove('show');
  }
  if (muteIcon) {
    muteIcon.style.display = 'none';
    muteIcon.style.opacity = '0';
    muteIcon.classList.remove('show');
  }

  // Handle page reloads from Quest/About navigation
  const hash = window.location.hash;
  if (hash === '#quest' || hash === '#about') {
    startButton.style.display = 'none';
    blurOverlay.classList.add('remove-blur');
    menuText.style.display = 'flex';
    menuText.style.opacity = '1';

    // show sound icon when coming back from subpage
    if (soundIcon) {
      setTimeout(() => {
        soundIcon.style.display = 'block';
        soundIcon.style.opacity = '1';
        soundIcon.classList.add('show');
      }, 300);
    }

    if (hash === '#quest') {
      setTimeout(() => {
        questLink.click();
      }, 100);
    } else if (hash === '#about') {
      setTimeout(() => {
        aboutLink.click();
      }, 100);
    }

    history.replaceState(null, null, ' ');
  }
});

// ===================================================
// START BUTTON
// ===================================================
startButton.addEventListener('click', async function () {
  // Remove blur
  blurOverlay.classList.add('remove-blur');

  // Fade out start button smoothly
  this.style.transition = 'opacity 0.8s ease-out';
  this.style.opacity = '0';

  // Remove background blur
  blurOverlay.style.backdropFilter = 'blur(0px)';
  blurOverlay.style.background = 'rgba(0,0,0,0)';

  // Hide start button
  setTimeout(() => {
    this.style.display = 'none';
  }, 800);

  // Fade in menu
  menuText.style.display = 'flex';
  requestAnimationFrame(() => {
    menuText.style.opacity = '1';
  });

  // Fade in sound icon after start click
  setTimeout(() => {
    soundIcon.style.display = 'block';
    soundIcon.style.opacity = '1';
    soundIcon.classList.add('show');
  }, 700);

  // Play music
  try {
    backgroundMusic.currentTime = 0;
    await backgroundMusic.play();
    isPlaying = true;

    localStorage.setItem("musicTime", "0");
    localStorage.setItem("musicPlaying", "true");
  } catch (err) {
    console.log("Autoplay blocked:", err);
  }
});

// ===================================================
// SOUND TOGGLE
// ===================================================
soundIcon.addEventListener('click', () => {
  backgroundMusic.pause();
  soundIcon.classList.remove('show');
  soundIcon.style.display = 'none';

  muteIcon.style.display = 'block';
  muteIcon.style.opacity = '1';
  muteIcon.classList.add('show');
  isPlaying = false;
});

muteIcon.addEventListener('click', () => {
  backgroundMusic.play();
  muteIcon.classList.remove('show');
  muteIcon.style.display = 'none';

  soundIcon.style.display = 'block';
  soundIcon.style.opacity = '1';
  soundIcon.classList.add('show');
  isPlaying = true;
});

// ===================================================
// QUEST POPUP
// ===================================================
const questPopup = document.getElementById('quest-popup');
const closeQuestBtn = document.getElementById('close-quest');
const questLink = document.getElementById('quest-link');

questLink.addEventListener('click', function() {
  blurOverlay.classList.remove('remove-blur');
  questPopup.style.display = 'block';
  document.body.classList.add('quest-active');
  setTimeout(() => {
    questPopup.classList.add('show');
  }, 10);
});

closeQuestBtn.addEventListener('click', function() {
  questPopup.classList.remove('show');
  document.body.classList.remove('quest-active');
  blurOverlay.classList.add('remove-blur');
  setTimeout(() => {
    questPopup.style.display = 'none';
  }, 500);
});

questPopup.addEventListener('click', function(e) {
  if (e.target === questPopup) {
    questPopup.classList.remove('show');
    document.body.classList.remove('quest-active');
    blurOverlay.classList.add('remove-blur');
    setTimeout(() => {
      questPopup.style.display = 'none';
    }, 500);
  }
});

// ===================================================
// SOCIAL BUTTONS
// ===================================================
window.onload = function () {
  document.getElementById('tiktok-btn').addEventListener('click', () => {
    window.open('https://www.tiktok.com/@yourusername', '_blank');
  });

  document.getElementById('instagram-btn').addEventListener('click', () => {
    window.open('https://www.instagram.com/yourusername', '_blank');
  });

  document.getElementById('discord-btn').addEventListener('click', () => {
    window.open('https://discord.gg/yourinvitecode', '_blank');
  });
};

// ===================================================
// ABOUT US POPUP
// ===================================================
const aboutPopup = document.getElementById('about-popup');
const closeAboutBtn = document.getElementById('close-about');
const aboutLink = document.getElementById('about-link');

aboutLink.addEventListener('click', function() {
  aboutPopup.style.display = 'block';
  document.body.classList.add('about-active');
  setTimeout(() => {
    aboutPopup.classList.add('show');
  }, 10);
});

function closeAboutPopup() {
  aboutPopup.classList.remove('show');
  document.body.classList.remove('about-active');
  setTimeout(() => {
    aboutPopup.style.display = 'none';
  }, 500);
}

closeAboutBtn.addEventListener('click', closeAboutPopup);

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('fc') || e.target.id === 'close-about-x') {
    closeAboutPopup();
  }
});

aboutPopup.addEventListener('click', function(e) {
  if (e.target === aboutPopup) {
    closeAboutPopup();
  }
});

// GUIDE LINK — go directly to house.html and open Guide section
document.getElementById("guide-link").addEventListener("click", () => {
  window.location.href = "house.html#guide";
});

// ===================================================
// ENTER HOUSE - KEEP MUSIC PLAYING
// ===================================================
document.getElementById('house-link').addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    if (backgroundMusic.paused) {
      await backgroundMusic.play();
    }

    localStorage.setItem("musicTime", backgroundMusic.currentTime);
    localStorage.setItem("musicPlaying", !backgroundMusic.paused);
    localStorage.setItem("musicMuted", backgroundMusic.muted);

    window.location.href = 'house.html';
  } catch (err) {
    console.log("Autoplay prevented, continuing anyway:", err);
    window.location.href = 'house.html';
  }
});
