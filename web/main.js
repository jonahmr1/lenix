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
      background: #ffffffff;
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
      top: 85%;
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
      gap: 0.2rem;
      font-size: 2rem;
      color: black;
      user-select: none;
    }

    #pressLeft, #pressRight {
      text-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
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
      color: rgba(0, 0, 0, 1);
      font-size: 2rem;
      font-family: "Archivo Black", sans-serif;
      position: relative;
      font-style: italic;
      font-weight: 100;
      top: -0.1rem;
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
      color: #007548ff;
      text-shadow: 0 0 6px #29ffadff;
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

    @media (max-width: 600px) {
      .loader { font-size: 1.1rem; }
      #pressLeft, #pressRight { font-size: 0.95rem; }
    }
  `
  const style = document.createElement('style')
  style.innerHTML = styleContent
  document.head.appendChild(style)
}

const root = document.getElementById('root')
root.innerHTML = `
  <video id="playVideo" src="https://r2.fivemanage.com/COKMc8Wcmk9K5dp547rEw/trippler.mp4" width="100%" height="100%"></video>
`

const audioInstances = {}
const playVideoEl = document.getElementById('playVideo')

function playVideo() {
  playVideoEl.style.display = 'block'
  playVideoEl.play().catch(() => {})
}

function playAudio(name) {
  audioInstances[name] = new Audio(`https://r2.fivemanage.com/COKMc8Wcmk9K5dp547rEw/${name}.mp3`)
  audioInstances[name].volume = 1
  audioInstances[name].play().catch(() => {})
}

function generateContext() {
  const context = document.createElement('div')
  context.id = 'context'
  context.innerHTML = `
    <div id="contextLine" role="button" tabindex="0">
      <span id="pressLeft">Press the</span>
      <p class="loader"><span>&nbsp;SPACE BAR&nbsp;</span></p>
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

function startScene() {
  playVideo()
  setTimeout(() => {
    showContext()
  }, 11200)
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
    hideTheLoader()
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
  startScene()
  let hasEnded = false;
  document.addEventListener('keydown', (e) => {
    if (checkKey(e) && !hasEnded) {
      hasEnded = true;
      endScene();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  generateCSS()
  generateContext()
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