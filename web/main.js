document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('message', function(event) {
    const item = event.data;

    switch (event.data.action) {
      case 'show':
        document.getElementById('interact-text-content-b').textContent = item.text;

        if (item.key) {
            document.getElementById('interact-key-content').textContent = item.key;
            document.getElementById('interact-key').style.display = 'block';
        }

        const interactionApp = document.getElementById('interaction-app');
        interactionApp.style.display = 'block';
        interactionApp.style.opacity = '0';
        
        setTimeout(() => {
            interactionApp.style.transition = 'opacity 0.4s';
            interactionApp.style.opacity = '1';
        }, 10);
        break;
        
      case 'hide':
        const hideApp = document.getElementById('interaction-app');
        hideApp.style.transition = 'opacity 0.35s';
        hideApp.style.opacity = '0';
        
        setTimeout(() => {
            hideApp.style.display = 'none';
            document.getElementById('interact-key-content').textContent = '';
            document.getElementById('interact-text-content-b').textContent = '';
            document.getElementById('interact-key').style.display = 'none';
        }, 350);
        break;
    }
  });

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');
    * {
        font-family: "Cairo", sans-serif;
    }
    @keyframes slideIn {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translate(-50%, -25%);
        }
    }

    #interaction-app {
        display: none;
        user-select: none;
    }

    #container {
        position: fixed;
        display: flex;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, -25%);
        animation: slideIn 0.3s ease-in-out;
    }

    #interact-key {
        font-size: 15px;
        font-weight: 700;
        color: #a0ffed;
        background: radial-gradient(31.98% 56.85% at 50% 50%, rgba(26, 29, 41, 0.9) 0%, rgba(34, 37, 48, 0.92) 100%);
        padding: 5px;
        margin: 5px;
        border-radius: 0.3rem;
    }

    #interact-key-b {
        background: radial-gradient(62.19% 62.19% at 50% 50%, rgba(160, 255, 237, 0.25) 0%, rgba(94, 149, 139, 0.25) 100%);
        padding-left: 9px;
        padding-right: 9px;
        border-radius: 0.3rem;
        border: 1px solid #a0ffed;
    }

    #interact-text {
        font-size: calc(0.092592592vh * 16);
        font-weight: 500;
        color: #fff;
        background: radial-gradient(31.98% 56.85% at 50% 50%, rgba(26, 29, 41, 0.9) 0%, rgba(34, 37, 48, 0.92) 100%);
        padding-left: 25px;
        padding-right: 25px;
        margin: 5px;
        border-radius: 0.3rem;
    }

    #interact-text-content-a {
        position: relative;
        width: calc(0.092592592vh * 5);
        height: calc(0.092592592vh * 5);
        border-radius: 0.3rem;
        background-color: #a0ffed;
        right: 17px;
        top: 2px;
    }
  `;
  document.head.appendChild(style);
  
  const root = document.getElementById('root');
  
  const interactionApp = document.createElement('div');
  interactionApp.id = 'interaction-app';
  interactionApp.style.display = 'none';
  root.appendChild(interactionApp);
  
  interactionApp.innerHTML = `
      <div id="container">
          <div id="interact-key" style="display: none;">
              <div id="interact-key-content"></div>
          </div>
          <div id="interact-text">
              <div id="interact-text-content-a"></div>
              <div id="interact-text-content-b"></div>
          </div>
      </div>
  `;
});