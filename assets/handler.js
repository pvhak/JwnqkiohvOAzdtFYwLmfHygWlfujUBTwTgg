        const cr = document.getElementById('cursor');
        const cs = document.getElementById('cs');
        const co = document.getElementById('coords');

        document.addEventListener('mousemove', e => {
            cr.style.left = e.clientX + 'px';
            cr.style.top  = e.clientY + 'px';
            co.textContent =
                String(e.clientX).padStart(4,'0') + ' / ' +
                String(e.clientY).padStart(4,'0');
            co.classList.add('active');
        });

        document.addEventListener('mousedown', () => { cs.style.scale = '0.7'; });
        document.addEventListener('mouseup',   () => { cs.style.scale = '1';   });

        const sp = document.getElementById('splash');
        const mn = document.getElementById('main');
        const mu = document.getElementById('music');
        const cv = document.getElementById('particles');
        const cx = cv.getContext('2d');

        cx.imageSmoothingEnabled = false;

        const G = 4;
        cv.width  = window.innerWidth;
        cv.height = window.innerHeight;

        const FS = [
            [[0,0]],
            [[0,0],[1,0],[-1,0],[0,1],[0,-1]],
            [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]],
            [[0,0],[2,0],[-2,0],[0,2],[0,-2],[1,1],[-1,1],[1,-1],[-1,-1]],
            [[0,0],[1,0],[0,1],[1,1]],
        ];

        const SG = [
            "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/i%20just%20wanna%20be%20with%20u.mp3",
            "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/iloveusomuch.mp3",
            "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/you%20left%20now%20look%20at%20you.mp3",
            "https://raw.githubusercontent.com/pvhak/pvhak/e0c9c101a67f1b65b2feccbd1b558475c42a0271/youhurtme.mp3"
        ];

        let li = -1;

        class f {
            constructor(ry = false) {
                this.rst();
                if (ry) this.y = Math.floor(Math.random() * cv.height / G) * G;
            }
            rst() {
                this.x   = Math.floor(Math.random() * (cv.width / G)) * G;
                this.y   = -G * 4;
                this.sy  = Math.floor(Math.random() * 2) + 1;
                this.op  = Math.random() * 0.5 + 0.3;
                this.sc  = 0;
                this.si  = Math.floor(Math.random() * 30) + 20;
                this.sd  = Math.random() > 0.5 ? 1 : -1;
                this.sh  = FS[Math.floor(Math.random() * FS.length)];
                this.tr  = Math.floor(Math.random() * 2) + 1;
                this.tc  = 0;
                this.spn = Math.random() < 0.4;
                this.ag  = Math.random() * Math.PI * 2;
                const ds = 45 + Math.random() * 135;
                this.asp = (ds * Math.PI / 180) / (60 / this.tr);
                this.asd = Math.random() < 0.5 ? 1 : -1;
                this.tw  = Math.random() < 0.3;
                this.tp  = Math.random() * Math.PI * 2;
                this.ts  = 0.04 + Math.random() * 0.06;
                this.bo  = this.op;
            }
            upd() {
                this.tc++;
                if (this.tc < this.tr) return;
                this.tc = 0;
                this.y += this.sy * G;
                this.sc++;
                if (this.sc >= this.si) {
                    this.sc = 0;
                    this.x += this.sd * G;
                    this.sd *= (Math.random() > 0.3 ? 1 : -1);
                }
                if (this.spn) this.ag += this.asp * this.asd;
                if (this.tw) {
                    this.tp += this.ts;
                    this.op = this.bo * (0.5 + 0.5 * Math.sin(this.tp));
                }
                if (this.y > cv.height + G * 4) this.rst();
                if (this.x < 0)           this.x = Math.floor(cv.width / G) * G;
                if (this.x > cv.width)    this.x = 0;
            }
            drw() {
                cx.fillStyle = `rgba(247,247,247,${this.op})`;
                if (this.spn && this.sh.length > 1) {
                    cx.save();
                    cx.translate(this.x + G / 2, this.y + G / 2);
                    cx.rotate(this.ag);
                    for (const [dx, dy] of this.sh)
                        cx.fillRect(dx * G - G / 2, dy * G - G / 2, G, G);
                    cx.restore();
                } else {
                    for (const [dx, dy] of this.sh)
                        cx.fillRect(this.x + dx * G, this.y + dy * G, G, G);
                }
            }
        }

        const pt = [];
        for (let i = 0; i < 100; i++) pt.push(new f(true));

        function ani() {
            cx.clearRect(0, 0, cv.width, cv.height);
            pt.forEach(p => { p.upd(); p.drw(); });
            requestAnimationFrame(ani);
        }
        ani();

        function ply() {
            let n;
            do { n = Math.floor(Math.random() * SG.length); } while (n === li);
            li = n;
            mu.src = SG[n];
            mu.play().catch(() => {});
        }

        mu.volume = 0.2;
        mu.addEventListener('ended', ply);

        sp.addEventListener('click', () => {
            sp.classList.add('goaway');
            ply();
            setTimeout(() => {
                sp.style.display = 'none';
                mn.classList.remove('hidden');
                setTimeout(() => mn.classList.add('visible'), 50);
            }, 500);
        });

        window.addEventListener('resize', () => {
            cv.width  = window.innerWidth;
            cv.height = window.innerHeight;
            cx.imageSmoothingEnabled = false;
        });
