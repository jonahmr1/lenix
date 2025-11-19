document.addEventListener('DOMContentLoaded', () => {
  let root = document.getElementById('root')
  let styleContent = `
#root {
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
}
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
}
.upper_section {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lower_section {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
  animation: stretchText 1s ease-in-out infinite alternate;
}
img {
  height: 50%;
  box-shadow: 0 0 100px 1px #ffffff46;
  border-radius: 3rem;
  animation: growImage 10s ease-out forwards;
}

@keyframes growImage {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}

@keyframes stretchText {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(1.01);
  }
}
  `
  let style = document.createElement('style')
  style.innerHTML = styleContent
  root.appendChild(style)
})