import { useDiv } from '@trippler/tr_kit/nui'

document.body.id = 'body'

export const generateRawHTML = () => {
  useDiv({
    parent: 'body',
    content: `
      <audio src="./public/effect.mp3"></audio>
      <div id="container" style="display: none;">
        <div class="key">
          <div class="key-text"></div>
        </div>
        <div class="text"></div>
        <div class="icon">
          <div class="icon-text"></div>
        </div>
      </div>
    `
  })
}

export const generateRawStyle = () =>  {
  const style = document.createElement('style')
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
      height: 4.45vh;
      width: 2.5rem;
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

    i {
      color: var(--primary-color)
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
      font-size: 14px;
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
      height: 4.45vh;
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
  `
  document.head.appendChild(style)
}