const player = document.querySelector(".player");
const audio = player.querySelector("audio");
const controls = player.querySelector(".player-controls");
const button = player.querySelector(".play");
const playIcon = player.querySelector(".play-icon");
const pauseIcon = player.querySelector(".pause-icon");
const seek = player.querySelector(".seek");
const elapsed = player.querySelector(".elapsed");
const duration = player.querySelector(".duration");
const feedback = player.querySelector(".player-feedback");

function timestamp(seconds) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function updatePosition() {
  seek.value = audio.currentTime;
  elapsed.textContent = timestamp(audio.currentTime);
}

function updateDuration() {
  const seconds = Number.isFinite(audio.duration) ? audio.duration : 0;
  seek.max = seconds || 1;
  seek.disabled = seconds === 0;
  duration.textContent = timestamp(seconds);
  updatePosition();
}

function updatePlayback() {
  const playing = !audio.paused && !audio.ended;
  button.setAttribute("aria-label", playing ? "暂停音乐" : "播放音乐");
  playIcon.toggleAttribute("hidden", playing);
  pauseIcon.toggleAttribute("hidden", !playing);
}

button.addEventListener("click", async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }
  try {
    await audio.play();
    feedback.hidden = true;
  } catch {
    feedback.hidden = false;
  }
});

seek.addEventListener("input", () => {
  audio.currentTime = seek.valueAsNumber;
  updatePosition();
});

audio.addEventListener("durationchange", updateDuration);
audio.addEventListener("timeupdate", updatePosition);
audio.addEventListener("play", updatePlayback);
audio.addEventListener("pause", updatePlayback);
audio.addEventListener("ended", updatePlayback);
audio.addEventListener("error", () => { feedback.hidden = false; });

updateDuration();
updatePlayback();
feedback.hidden = !audio.error;
controls.hidden = false;
audio.hidden = true;
