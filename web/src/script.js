// Get DOM elements
const container = document.getElementById('container');
const iconElement = document.querySelector('.icon');
const iconText = document.querySelector('.icon-text');
const textElement = document.querySelector('.text');
const keyElement = document.querySelector('.key');
const keyText = document.querySelector('.key-text');
const audio = document.getElementById('audio');

// Play sound function
function playSound() {
  if (audio) {
    audio.volume = 1.0;
    audio.play().catch(() => { }); // Ignore audio errors
  }
}

// Show notification
function show(data) {
  playSound();

  // Set text
  textElement.textContent = data.text || '';

  // Handle icon
  if (data.icon) {
    iconText.innerHTML = `<i class="${data.icon}"></i>`;
    iconElement.style.display = 'flex';
  } else {
    iconElement.style.display = 'none';
  }

  // Handle key
  if (data.key) {
    keyText.textContent = data.key;
    keyElement.style.display = 'flex';
  } else {
    keyElement.style.display = 'none';
  }

  // Show with animation
  container.style.display = 'flex';
  container.classList.remove('slide-out');
  container.classList.add('container');
}

// Hide notification
function hide() {
  playSound();
  container.classList.remove('container');
  container.classList.add('slide-out');

  setTimeout(() => {
    container.style.display = 'none';
  }, 500);
}

// NUI Message Handler
window.addEventListener('message', (event) => {
  const data = event.data;

  switch (data.type) {
    case 'open':
      show(data);
      break;
    case 'close':
      hide();
      break;
    default:
      hide();
      break;
  }
});