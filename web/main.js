try {
  if (window.frameElement) {
    window.frameElement.style.zIndex = '99999'
    window.frameElement.style.position = 'fixed'
  }
} catch(e) {}

function generateCSS() {
  const styleContent = `
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
    * {
      pointer-events: none;
    }
    body {
      margin: 0;
      padding: 0;
    }
    #root {
      overflow: hidden;
      width: 100%;
      height: 100%;
      font-family: 'Urbanist', sans-serif;
      background: #000;
      transition: transform 0.8s ease, opacity 0.8s ease;
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
      transform: translate(-50%, -40%);
      opacity: 0;
      transition: opacity 0.8s ease, transform 0.8s ease;
    }

    #context.show {
      opacity: 1;
      transform: translate(-50%, -50%);
    }

    #contextLine {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5em;
      color: white;
      user-select: none;
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
      color: rgb(242, 255, 240);
      font-size: 1.5em;
      font-family: "Archivo Black", sans-serif;
      position: relative;
      font-style: italic;
      font-weight: 500;
      margin: 0;
      padding: 0 6px;
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
      animation: scan 2s infinite;
      left: 0;
      z-index: -1;
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
    }

    .loader.pressed span {
      color: #00ff9d;
      text-shadow: 0 0 6px #00ff9d;
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

    #brand {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: transform 0.45s cubic-bezier(.2,.9,.3,1);
    }

    #brandText {
      font-size: 2em;
      font-weight: 200;
      color: white;
      letter-spacing: 4px;
      font-family: "Urbanist", sans-serif;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }

    #brandText.brandFadeIn {
      opacity: 1;
      transform: translateY(0);
    }

    #brand.brandDown {
      transform: translate(-50%, -50%) translateY(1rem);
    }

    #brand.brandUp {
      transform: translate(-50%, -50%) translateY(-5.5rem);
    }

    @media (max-width: 600px) {
      .loader { font-size: 1.1rem; }
      #pressLeft, #pressRight { font-size: 0.95rem; }
      #brandText { font-size: 2rem; }
    }
  `
  const style = document.createElement('style')
  style.innerHTML = styleContent
  document.head.appendChild(style)
}

const root = document.getElementById('root')
root.innerHTML = `
  <video id="playVideo" src="https://r2.fivemanage.com/COKMc8Wcmk9K5dp547rEw/playVideo.mp4" width="100%" height="100%"></video>
  <video id="closeVideo" src="https://r2.fivemanage.com/COKMc8Wcmk9K5dp547rEw/closeVideo.mp4" width="100%" height="100%"></video>
`

const audioInstances = {}
const playVideoEl = document.getElementById('playVideo')
const closeVideoEl = document.getElementById('closeVideo')
let skipped = true
let finishedScene = false
let playedSpeech = false

function playAudio(name) {
  audioInstances[name] = new Audio(`https://r2.fivemanage.com/COKMc8Wcmk9K5dp547rEw/${name}.mp3`)
  audioInstances[name].volume = 0.3
  audioInstances[name].play().catch(() => {})
}

function stopAudio(name) {
  if (audioInstances[name]) {
    audioInstances[name].pause()
    audioInstances[name].currentTime = 0
  }
}

function playVideo() {
  playVideoEl.style.display = 'block'
  closeVideoEl.style.display = 'none'
  playVideoEl.play().catch(() => {})
}

function closeVideo() {
  playVideoEl.style.display = 'none'
  closeVideoEl.style.display = 'block'
  closeVideoEl.currentTime = 1
  closeVideoEl.play().catch(() => {})
}

function generateContext() {
  const context = document.createElement('div')
  context.id = 'context'
  context.innerHTML = `
    <div id="contextLine" role="button" tabindex="0">
      <span id="pressLeft">Press the</span>
      <p class="loader"><span>SPACE BAR </span></p>
      <span id="pressRight">to start</span>
    </div>
  `
  root.appendChild(context)
}

function hideTheLoader() {
  const rootEl = document.getElementById('root')
  rootEl.style.transition = 'transform 1s ease'
  rootEl.style.transform = 'translateY(-100%)'
  
  setTimeout(() => {
    rootEl.style.display = 'none'
  }, 800)
}

function showContext() {
  requestAnimationFrame(() => {
    context.classList.add('show')
  })
}

function showBrand() {
  const brand = document.createElement('div')
  brand.id = 'brand'
  brand.innerHTML = `<span id="brandText">Trippler</span>`
  root.appendChild(brand)
  requestAnimationFrame(() => {
    const brandText = document.getElementById('brandText')
    brandText.classList.add('brandFadeIn')
    setTimeout(() => {
      const brandDiv = document.getElementById('brand')
      brandDiv.classList.add('brandDown')
      setTimeout(() => {
        brandDiv.classList.remove('brandDown')
        brandDiv.classList.add('brandUp')
      }, 50)
    }, 1150)
  })
}

function startScene() {
  playVideo()
  playAudio('hype_audio')
  setTimeout(() => {
    playAudio('speech')
    playedSpeech = true
    setTimeout(() => {
      showBrand()
      setTimeout(() => {
        showContext()
        finishedScene = true
      }, 3500)
    }, 1600)
  }, 6100)
}

function endScene() {
  playAudio('click')
  
  const loaderEl = document.querySelector('.loader')
  loaderEl.classList.add('pressed')

  const left = document.getElementById('pressLeft')
  const right = document.getElementById('pressRight')
  left.classList.add('press-anim')
  right.classList.add('press-anim')

  setTimeout(() => {
    if (!skipped) {
      closeVideo()
    }
  }, 250)

  setTimeout(() => {
    hideTheLoader()
    stopAudio('hype_audio')
    fetch(`https://${GetParentResourceName()}/loseFocus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
  }, 1500)
}

function checkKey(e) {
  if (e.code === 'Space') return true
}

function Init() {
  generateCSS()
  generateContext()
  startScene()
  let hasEnded = false;
  document.addEventListener('keydown', (e) => {
    if (checkKey(e) && !hasEnded) {
      hasEnded = true;
      if (!finishedScene) {
        skipped = true;
        if (playedSpeech) stopAudio('speech');
      }
      endScene();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch(`https://${GetParentResourceName()}/contentLoaded`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
  window.addEventListener('message', (event) => {
    if (event.data.action === 'init') {
      Init()
    }
  })
})