const splash = document.getElementById('splash');
const main = document.getElementById('main');
const music = document.getElementById('music');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

music.volume = 0.1;

const GRID = 4;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const FLAKE_SHAPES = [
    // single pixel
    [[0,0]],

    // small cross
    [[0,0],[1,0],[-1,0],[0,1],[0,-1]],

    // plus w corners
    [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]],

    // diamond
    [[0,0],[2,0],[-2,0],[0,2],[0,-2],[1,1],[-1,1],[1,-1],[-1,-1]],

    // 2x2
    [[0,0],[1,0],[0,1],[1,1]],
];

const songs = [
  "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/happier.mp3",
  "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/i%20just%20wanna%20be%20with%20u.mp3",
  "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/iloveusomuch.mp3",
  "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/you%20left%20now%20look%20at%20you.mp3",
  "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/youhurtme.mp3"
];

let lsindex = -1;

class p {
    constructor(randomY = false) {
        this.reset();
        if (randomY) {

            this.y = Math.floor(Math.random() * canvas.height / GRID) * GRID;
        }
        this.angle = Math.floor(Math.random() * 100);
    }

    reset() {
        this.x = Math.floor(Math.random() * (canvas.width / GRID)) * GRID;
        this.y = -GRID * 4;
        this.speedY = (Math.floor(Math.random() * 2) + 1);
        this.speedX = Math.floor(Math.random() * 3) - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.swingCounter = 0;
        this.swingInterval = Math.floor(Math.random() * 30) + 20;
        this.swingDir = Math.random() > 0.5 ? 1 : -1;
        this.shape = FLAKE_SHAPES[Math.floor(Math.random() * FLAKE_SHAPES.length)];
        this.angle = 0;
        this.tickRate = Math.floor(Math.random() * 2) + 1;
        this.tickCounter = 0;
    }

    update() {
        this.tickCounter++;
        if (this.tickCounter < this.tickRate) return;
        this.tickCounter = 0;

        this.y += this.speedY * GRID;

        this.swingCounter++;
        if (this.swingCounter >= this.swingInterval) {
            this.swingCounter = 0;
            this.x += this.swingDir * GRID;
            this.swingDir *= (Math.random() > 0.3 ? 1 : -1);
        }

        if (this.y > canvas.height + GRID * 4) this.reset();
        if (this.x < 0) this.x = Math.floor(canvas.width / GRID) * GRID;
        if (this.x > canvas.width) this.x = 0;
    }

    draw() {
        ctx.fillStyle = `rgba(247, 247, 247, ${this.opacity})`;
        for (const [dx, dy] of this.shape) {
            ctx.fillRect(this.x + dx * GRID, this.y + dy * GRID, GRID, GRID);
        }
    }
}

const particles = [];

for (let i = 0; i < 100; i++) {
    particles.push(new p(true));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => { particle.update(); particle.draw(); });
    requestAnimationFrame(animate);
}

animate();

function play() {
    let nindex;

    do {
        nindex = Math.floor(Math.random() * songs.length);
    } while (nindex === lsindex);

    lsindex = nindex;
    music.src = songs[nindex];
    music.play().catch(err => console.log(err));
}

music.volume = 0.2;
music.addEventListener("ended", play);

splash.addEventListener('click', () => {
    splash.classList.add('goaway');
    play();
    setTimeout(() => {
        splash.style.display = 'none';
        main.classList.remove('hidden');
        setTimeout(() => { main.classList.add('visible'); }, 50);
    }, 500);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
});
