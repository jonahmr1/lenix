import { exitDesk } from "../modules";

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    exitDesk();
  }
});