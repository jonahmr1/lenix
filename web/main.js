document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const playVideoEl = document.getElementById('playVideo');
  const closeVideoEl = document.getElementById('closeVideo');

  const fade = document.createElement('div');
  fade.id = "fade";
  document.body.appendChild(fade);

  function playAudio(name) {
    new Audio(`./${name}.mp3`).play().catch(() => {});
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
      <div id="contextLine" role="button" tabindex="0">
        <span id="pressLeft">Press the</span>
        <p class="loader" aria-hidden="true"><span>SPACE BAR</span></p>
        <span id="pressRight">to start</span>
      </div>
    `;

    root.appendChild(context);

    requestAnimationFrame(() => {
      context.classList.add('show');
    });

    function startSequence() {
      playAudio('click');
      
      const loaderEl = document.querySelector('.loader');
      loaderEl.classList.add('pressed');

      const left = document.getElementById('pressLeft');
      const right = document.getElementById('pressRight');
      left.classList.add('press-anim');
      right.classList.add('press-anim');

      setTimeout(() => {
        closeVideo();
        setTimeout(() => {
          fadeOut(700);
          setTimeout(() => fadeIn(1000), 1000);
        }, 600);
      }, 250);

      document.removeEventListener('keydown', checkKey);
      context.removeEventListener('click', onClick);
      context.removeEventListener('keydown', onEnter);
    }


    function onClick() { startSequence(); }
    function onEnter(e) { if (e.key === 'Enter' || e.key === ' ') startSequence(); }
    function checkKey(e) { if (e.code === 'Space') startSequence(); }

    context.addEventListener('click', onClick);
    context.addEventListener('keydown', onEnter);
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

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const brandText = document.getElementById('brandText');
            brandText.classList.add('brandFadeIn');
            setTimeout(() => {
              const brandDiv = document.getElementById('brand');
              brandDiv.classList.add('brandDown');
              setTimeout(() => {
                brandDiv.classList.remove('brandDown');
                brandDiv.classList.add('brandUp');
              }, 50);
            }, 1150);
          });
        });

        setTimeout(() => { showContext(); }, 3500);
      }, 1500);

    }, 6000);

  }, 1000);

  const styleContent = `
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');

    body, #root {
      margin: 0;
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      font-family: 'Poppins', sans-serif;
      background: #000;
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
      width: auto;
      pointer-events: auto;
      opacity: 0;
      transform: translate(-50%, -40%);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }

    #context.show {
      opacity: 1;
      transform: translate(-50%, -50%);
    }

    #contextLine {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 1.5em;
      color: white;
      cursor: pointer;
      user-select: none;
      outline: none;
    }

    #pressLeft, #pressRight {
      text-shadow: 0 0 15px rgba(255,255,255,0.7);
      font-family: "Bebas Neue", sans-serif;
      font-weight: 500;
      letter-spacing: 1px;
      transition: transform 220ms ease, opacity 220ms ease;
    }

    .press-anim {
      transform: scale(0.95);
      opacity: 0.6;
    }

    .loader {
      max-width: fit-content;
      color: rgb(242, 255, 240);
      font-size: 1.5em;
      font-family: "Archivo Black", sans-serif;
      position: relative;
      font-style: italic;
      font-weight: 500;
      margin: 0;
      padding: 0 6px;
      z-index: 2;
    }

    .loader span {
      animation: cut 2s infinite;
      display: inline-block;
    }

    .loader::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 6px;
      border-radius: 4px;
      background-color: #00ff9d91;
      top: 0px;
      filter: blur(10px);
      animation: scan 2s infinite;
      left: 0;
      z-index: -1;
      pointer-events: none;
    }

    .loader::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 5px;
      border-radius: 4px;
      background-color: #00ff9d;
      top: 0px;
      animation: scan 2s infinite;
      left: 0;
      z-index: 0;
      pointer-events: none;
    }

    .loader.pressed span {
      color: #00ff9d; /* neon green or any color you want */
      text-shadow: 0 0 15px #00ff9d;
    }


    @keyframes scan {
      0% { top: 0px; }
      25% { top: 2rem; }
      50% { top: 0px; }
      75% { top: 2rem; }
    }

    @keyframes cut {
      0% { clip-path: inset(0 0 0 0); }
      25% { clip-path: inset(100% 0 0 0); }
      50% { clip-path: inset(0 0 100% 0); }
      75% { clip-path: inset(0 0 0 0); }
    }

    /* Brand (Trippler) */
    #brand {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: transform 0.45s cubic-bezier(.2,.9,.3,1);
      will-change: transform;
      pointer-events: none;
    }

    #brandText {
      font-size: 3em;
      font-weight: 600;
      color: white;
      letter-spacing: 4px;
      font-family: "Urbanist", sans-serif;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.65s ease, transform 0.65s ease;
      will-change: transform, opacity;
    }

    #brandText.brandFadeIn {
      opacity: 1;
      transform: translateY(0);
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

    /* small accessibility & responsiveness tweaks */
    @media (max-width: 600px) {
      .loader { font-size: 1.1rem; }
      #pressLeft, #pressRight { font-size: 0.95rem; }
      #brandText { font-size: 2rem; }
    }
  `;

  const style = document.createElement('style');
  style.innerHTML = styleContent;
  document.head.appendChild(style);
});
