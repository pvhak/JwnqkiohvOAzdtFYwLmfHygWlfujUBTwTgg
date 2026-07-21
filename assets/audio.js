const audio = new Audio("https://8967.lol/assets/fat.mp3");
audio.loop = true;

let started = false;
const events = ["click", "pointerdown", "touchstart", "keydown"];

function startNOWWW() {
    if (started) return;
    started = true;

    audio.play()
        .then(() => { events.forEach(e => window.removeEventListener(e, startNOWWW, true));  })
        .catch(err => {
            console.log("err:", err);
            started = false;
        });
}

events.forEach(e => window.addEventListener(e, startNOWWW, true) );
