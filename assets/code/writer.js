const titles = ['8967.lol', '@bestskid', 'gooningto89.lol'];
const el = document.getElementById('pagetitletwin');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  let index = 0;

  while (true) {
    const text = titles[index];

    for (let i = 0; i <= text.length; i++) {
      el.textContent = text.slice(0, i);
      await sleep(150);
    }

    await sleep(1500);

    for (let i = text.length; i >= 0; i--) {
      el.textContent = text.slice(0, i);
      await sleep(100);
    }

    await sleep(400);

    index = (index + 1) % titles.length;
  }
}

main();
