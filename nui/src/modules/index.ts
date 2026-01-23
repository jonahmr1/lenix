import { useDiv } from "@trippler/tr_kit/nui"
import { nuiFocus } from "@trippler/tr_lib/nui"

const audioInstances: Record<string, HTMLAudioElement> = {}
const playVideoEl = document.getElementById('playVideo')! as HTMLVideoElement

const playVideo = () => {
  playVideoEl.style.display = 'block'
  playVideoEl.play().catch(() => {})
}

const stopVideo = () => {
  playVideoEl.style.display = 'none'
  playVideoEl.pause()
}

const playAudio = (name: string) => {
  audioInstances[name] = new Audio(`https://r2.fivemanage.com/COKMc8Wcmk9K5dp547rEw/click.mp3`)
  audioInstances[name].volume = 1
  audioInstances[name].play().catch(() => {})
}

const hideTheLoader = () => {
  stopVideo()
  const rootEl = document.getElementById('root')!
  rootEl.style.transition = 'transform 1s ease'
  rootEl.style.transform = 'translateY(-100%)'
  
  setTimeout(() => {
    rootEl.style.display = 'none'
  }, 800)
}

const showContext = () => {
  requestAnimationFrame(() => {
    document.getElementById('context')?.classList.add('show')
  })
}

const startScene = () => {
  playVideo()
  setTimeout(() => {
    showContext()
  }, 11200)
}

const endScene = () => {
  playAudio('click')
  
  const loaderEl = document.querySelector('.loader')!
  loaderEl.classList.add('pressed')

  const left = document.getElementById('pressLeft')!
  const right = document.getElementById('pressRight')!
  left.classList.add('press-anim')
  right.classList.add('press-anim')

  setTimeout(() => {
    hideTheLoader()
    nuiFocus(false, false)
  }, 1500)
}

const checkKey = (e: KeyboardEvent) => {
  if (e.code === 'Space') return true
}

export const generateContext = () => {
  useDiv({
    parent: 'root',
    id: 'context',
    content: `
      <div id="contextLine" role="button" tabindex="0">
        <span id="pressLeft">Press the</span>
        <p class="loader"><span>&nbsp;SPACE BAR&nbsp;</span></p>
        <span id="pressRight">to start</span>
      </div>
    `,
  })
}

export const Init = () => {
  nuiFocus()
  startScene()
  let hasEnded = false;
  document.addEventListener('keydown', (e) => {
    if (checkKey(e) && !hasEnded) {
      hasEnded = true;
      endScene();
    }
  });
}