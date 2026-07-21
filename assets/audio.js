const audio = new Audio("https://8967.lol/assets/fat.mp3");
audio.loop = true;

let started = false;

function startNOWWW() {
    if (started) return;
    started = true;
    audio.play().catch(err => { 
        console.log("err : ", err); 
        started = false;
     });
    events.forEach(e => window.removeEventListener(e, startNOWWW, true));
}

const events = [ "click", "mousedown", "mouseup", "mousemove", "keydown", "keyup", "keypress",
    "touchstart", "touchend", "pointerdown", "pointerup", "wheel", "scroll"
];

events.forEach(e => window.addEventListener(e, startNOWWW, true));
