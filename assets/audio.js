const songs = [
    "https://8967.lol/assets/theatre.mp3",
    "https://8967.lol/assets/starship%20invaders.mp3",
    "https://8967.lol/assets/fat.mp3",
    "https://8967.lol/s.mp3"
];

let CS = 0;
const audio = new Audio(songs[CS]);
audio.volume = 0.5;

audio.addEventListener("ended", () => {
    CS = (CS + 1) % songs.length;
    audio.src = songs[CS];
    audio.play().catch(err => console.log("err:", err));
});

let started = false;
const events = ["click", "pointerdown", "touchstart", "keydown"];

function startNOWWW() {
    if (started) return;
    started = true;

    audio.play()
        .then(() => {
            events.forEach(e => window.removeEventListener(e, startNOWWW, true));
        })
        .catch(err => { console.log("err:", err); started = false; });
}

events.forEach(e => window.addEventListener(e, startNOWWW, true));
