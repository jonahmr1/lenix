document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const playVideoEl = document.getElementById('playVideo');
  const closeVideoEl = document.getElementById('closeVideo');

  const fade = document.createElement('div');
  fade.id = "fade";
  document.body.appendChild(fade);

  function playAudio(name) {
    const audio = new Audio(`./${name}.mp3`);
    audio.play().catch(() => {});
  }

  function playVideo() {
    playVideoEl.style.display = 'block';
    closeVideoEl.style.display = 'none';
    playVideoEl.play().catch(() => {});
  }

  function closeVideo() {
    playVideoEl.style.display = 'none';
    closeVideoEl.style.display = 'block';
    closeVideoEl.currentTime = 1;
    closeVideoEl.play().catch(() => {});
  }

  function fadeOut(ms = 800) {
    fade.style.transition = `opacity ${ms}ms ease`;
    fade.style.opacity = 1;
  }

  function fadeIn(ms = 800) {
    fade.style.transition = `opacity ${ms}ms ease`;
    fade.style.opacity = 0;
  }

  function showContext() {
    const context = document.createElement('div');
    context.id = 'context';
    context.innerHTML = `
      <p class="loader"><span>Space Bar</span></p>
    `;

    root.appendChild(context);

    function handlePress() {
      const t = document.getElementById('contextText');
      t.classList.add('pressAnim');
      playAudio('click');
      setTimeout(() => {
        setTimeout(() => {
          closeVideo();
          setTimeout(() => {
            fadeOut(700);
            setTimeout(() => {
              fadeIn(1000);
            }, 1000)
          }, 600)
        }, 800);
      }, 200);
      document.removeEventListener('keydown', checkKey);
    }

    function checkKey(e) {
      if (e.keyCode === 32) handlePress();
    }

    document.addEventListener('keydown', checkKey);
  }

  setTimeout(() => {
    playVideo();
    playAudio('hype_audio');

    setTimeout(() => {
      playAudio('speech');

      setTimeout(() => {
        const brand = document.createElement('div');
        brand.id = 'brand';
        brand.innerHTML = `<span id="brandText">Trippler</span>`;
        root.appendChild(brand);

        setTimeout(() => {
          const brandDiv = document.getElementById('brand');

          brandDiv.classList.add('brandDown');

          setTimeout(() => {
            brandDiv.classList.remove('brandDown');
            brandDiv.classList.add('brandUp');
          }, 50); // wait for the first animation to finish
        }, 1150);


        setTimeout(() => {
          showContext();
        }, 4500);

      }, 1500);

    }, 6000);

  }, 1000);

  const styleContent = `
    body, #root {
      margin: 0;
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      font-family: 'Poppins', sans-serif;
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: none;
    }

    #context {
      position: absolute;
      top: 80%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    #contextText {
      font-size: 2.2em;
      color: white;
      letter-spacing: 2px;
      text-shadow: 0 0 20px rgba(255,255,255,0.7);
      transition: transform 0.2s ease, opacity 0.2s ease;
      animation: blink 1.2s infinite ease-in-out;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }

    .pressAnim {
      transform: scale(1.2);
      opacity: 0;
    }

    #brand {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: transform 0.2s ease;
    }

    #brandText {
      font-size: 3em;
      font-weight: 600;
      color: white;
      letter-spacing: 4px;
      text-shadow: 0 0 25px rgba(255,255,255,0.8);
      transition: transform 0.1s ease;
    }

    #brand.brandDown {
      transform: translate(-50%, -50%) translateY(1rem);
    }

    #brand.brandUp {
      transform: translate(-50%, -50%) translateY(-2rem);
    }

    #fade {
      position: fixed;
      inset: 0;
      background: black;
      opacity: 0;
      z-index: 9999;
      pointer-events: none;
    }
  `;

  const style = document.createElement('style');
  style.innerHTML = styleContent;
  document.head.appendChild(style);
});
