document.addEventListener('DOMContentLoaded', () => {
  let app = document.querySelector('.app')
  const styleContent = `
    body {
      margin: 0;
      background-image: url(./ped.png);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      font-family: 'Poppins', sans-serif;
    }
    ::selection {
      background-color: transparent;
    }
    #root {
      display: flex;
      justify-content: flex-start;
      align-items: end;
      height: 100vh;
    }
    .app {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      gap: 3rem;
      padding: 2rem;
      margin: 1rem;
      border-radius: 0.8rem;
      backdrop-filter: blur(1rem);
      animation: slideInLeft 2s ease-out;
    }
    .app > span {
      pointer-events: none;
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 3px 3px 12px rgba(0, 0, 0, 0.8),
                   0 0 20px rgba(255, 158, 11, 0.3);
      animation: fadeIn 2s ease-out;
      letter-spacing: 1px;
    }
    @keyframes slideInLeft {
      0% {
        opacity: 0;
        transform: translateX(-50px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  `
  const style = document.createElement('style')
  style.innerHTML = styleContent
  document.head.appendChild(style)

  app.innerHTML = `
    <span>Share Your Experience</span>
    <div class="radio">
      <input id="rating-5" type="radio" name="rating" value="5" />
      <label for="rating-5" title="5 stars">
        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
          <path
          d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
          ></path>
        </svg>
      </label>

      <input id="rating-4" type="radio" name="rating" value="4" />
      <label for="rating-4" title="4 stars">
        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
          <path
          d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
          ></path>
        </svg>
      </label>
      
      <input id="rating-3" type="radio" name="rating" value="3" />
      <label for="rating-3" title="3 stars">
        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
          <path
          d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
          ></path>
        </svg>
      </label>

      <input id="rating-2" type="radio" name="rating" value="2" />
      <label for="rating-2" title="2 stars">
        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
          <path
          d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
          ></path>
        </svg>
      </label>

      <input id="rating-1" type="radio" name="rating" value="1" />
      <label for="rating-1" title="1 star">
        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
          <path
          d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
          ></path>
        </svg>
      </label>
    </div>
  `
})