const strings = [
    "UD since first build!",
    "sponsored by tea club",
    "this is just a test site btw",
    "made it bc i was bored"
];

const el = document.getElementById("typewriter");
let sindex = 0;
let cindex = 0;
let deleting = false;

function tick() {
    const current = strings[sindex];

    if (!deleting) {
        cindex++;
        el.innerHTML = current.slice(0, cindex) + '<span class="cursor">|</span>';

        if (cindex === current.length) {
            deleting = true;
            setTimeout(tick, 2400); // hold
            return;
        }
        setTimeout(tick, 55); // type speed
    } else {
        cindex--;
        el.innerHTML = current.slice(0, cindex) + '<span class="cursor">|</span>';

        if (cindex === 0) {
            deleting = false;
            sindex = (sindex + 1) % strings.length;
            setTimeout(tick, 400); // gap
            return;
        }
        setTimeout(tick, 30); // del speed
    }
}

tick();
