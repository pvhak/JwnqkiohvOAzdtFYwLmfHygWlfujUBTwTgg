const splash = document.getElementById('splash');
const main = document.getElementById('main');
const music = document.getElementById('music');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

music.volume = 0.3;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class p {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.angle = Math.random() * Math.PI * 2;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 3 + 2;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.swing = Math.random() * 0.5;
        this.swingSpeed = Math.random() * 0.02 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.angle += this.swingSpeed;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * this.swing;
        if (this.y > canvas.height) { this.reset(); }
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 247, 247, ${this.opacity})`;
        ctx.fill();
        
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

const particles = [];

for (let i = 0; i < 100; i++) {
    particles.push(new p());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {particle.update(); particle.draw();});
    requestAnimationFrame(animate);
}

animate();

document.getElementById('enter').addEventListener('click', () => {
    splash.classList.add('goaway');
    
    music.play().catch(err => { console.log(err); });
    
    setTimeout(() => {
        splash.style.display = 'none';
        main.classList.remove('hidden');
        setTimeout(() => {main.classList.add('visible');}, 50);
    }, 500);
});

window.addEventListener('resize', () => {canvas.width = window.innerWidth; canvas.height = window.innerHeight;});
