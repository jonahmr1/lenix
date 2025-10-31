document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  root.innerHTML = `
    <audio id="audio" src="./public/effect.mp3"></audio>
    <div id="container" style="display: none;">
      <div class="key">
        <div class="key-text"></div>
      </div>
      <div class="text"></div>
      <div class="icon">
        <div class="icon-text"></div>
      </div>
    </div>
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slidein {
      0% {
        opacity: 0;
        bottom: 0;
      }

      100% {
        opacity: 1;
        bottom: 2rem;
      }
    }

    @keyframes slideout {
      0% {
        opacity: 1;
        bottom: 2rem;
      }

      100% {
        opacity: 0;
        bottom: 0;
      }
    }

    #root {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      overflow: hidden;
      font-family: 'Open Sans', sans-serif;
      margin: 0;
      padding: 0;
      width: 98vw;
      height: 98vh;
      background: transparent;
    }

    #container {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .icon {
      height: 3.95vh;
      width: 3.8vh;
      background: #272727f6;
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.9);
      border-radius: 0.75rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      right: 1rem;
      top: 0.1rem;
    }

    .icon-text {
      color: var(--primary-color);
      text-shadow: 0 0 12px var(--primary-color);
      font-size: 20px;
    }

    .text {
      width: fit-content;
      min-width: 1%;
      color: #ffffff;
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.4);
      background: #181818f6;
      margin-top: 0.2rem;
      border-radius: 0.75rem;
      padding: 0.55rem 1.85rem;
      font-size: 16px;
      font-weight: bold;
      white-space: nowrap;
    }

    .container {
      animation: slidein 0.5s forwards;
    }

    .slide-out {
      animation: slideout 0.5s forwards;
    }

    .key {
      height: 3.95vh;
      width: 2.5rem;
      left: 1rem;
      background: #272727f6;
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.9);
      border-radius: 0.75rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0.1rem;
    }

    .key-text {
      font-weight: 900;
      color: #fffffff1;
      text-shadow: 0 0 12px #fffffff1;
      font-size: 20px;
    }
  `;
  root.appendChild(style);

  const container = document.getElementById('container');
  const iconElement = document.querySelector('.icon');
  const iconText = document.querySelector('.icon-text');
  const textElement = document.querySelector('.text');
  const keyElement = document.querySelector('.key');
  const keyText = document.querySelector('.key-text');
  const audio = document.getElementById('audio');

  function playSound() {
    if (audio) {
      audio.volume = 1.0;
      audio.play().catch(() => { });
    }
  }

  function show(data) {
    playSound();

    textElement.textContent = data.text || '';

    if (data.icon !== false || data.icon !== undefined || data.icon !== null) {
        iconText.innerHTML = `<i class="${data.icon}"></i>`;
        iconElement.style.display = 'flex';
    } else {
      if (data.icon == false) {
        iconElement.style.display = 'none';
      } else {
        iconText.innerHTML = `<i class="fas fa-bells"></i>`;
        iconElement.style.display = 'flex';
      }
    }

    if (data.key) {
      keyText.textContent = data.key;
      keyElement.style.display = 'flex';
    } else {
      keyElement.style.display = 'none';
    }

    container.style.display = 'flex';
    container.classList.remove('slide-out');
    container.classList.add('container');
  }
    
  function hide() {
    playSound();
    container.classList.remove('container');
    container.classList.add('slide-out');

    setTimeout(() => {
      container.style.display = 'none';
    }, 500);
  }

  window.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.type) {
      case 'init':
        document.documentElement.style.setProperty('--primary-color', data.color);
        break;
      case 'show':
        show(data);
        break;
      case 'hide':
        hide();
      break;
      default:
        hide();
      break;
    }
  });
  fetch(`https://${GetParentResourceName()}/nuiReady`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
})