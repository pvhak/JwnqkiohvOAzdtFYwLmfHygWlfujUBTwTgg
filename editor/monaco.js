require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' } });

require(["vs/editor/editor.main"], function () {
  monaco.editor.defineTheme('faggot', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: { 'editor.background': '#191a1e' }
  });

  const editor = monaco.editor.create(document.getElementById('editor'), {
    value: "-- book.club / main.lua",
    language: "lua",
    theme: "faggot",
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
  });

  window.editor = editor;

  ////////////// tabs? boi this is tuff isnt it i already know it is heh.
  
  const tcontainer = document.getElementById('tabsc');
  const newtab1 = document.getElementById('newtab-btn');
  let tabs = [{ id: 1, name: "main.lua", language: "lua", value: "-- book.club / main.lua" }];
  let ctab_id = 1;

  function switch_tab(id) {
    const tdata = tabs.find(t => t.id === id);
    if (!tdata) return;
    const otab = tabs.find(t => t.id === ctab_id);
    if (otab) otab.value = editor.getValue();
    ctab_id = id;
    editor.setValue(tdata.value);
    monaco.editor.setModelLanguage(editor.getModel(), tdata.language);
    document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));
    document.querySelector(`.tab[data-id="${id}"]`).classList.add("active");
  }

  function createtab() {
    const new_id = Date.now();
    const new_name = `untitled${tabs.length}.lua`;
    const new_tab = { id: new_id, name: new_name, language: "lua", value: `-- book.club / ${new_name}` };
    tabs.push(new_tab);

    const tel = document.createElement("div");
    tel.className = "tab";
    tel.dataset.id = new_id;
    tel.innerHTML = `${new_tab.name} <span class="close-btn">&times;</span>`;
    tcontainer.insertBefore(tel, newtab1);

    switch_tab(new_id);
  }

  function close_tab(id) {
    if (tabs.length === 1) return notify("Must have at least one tab open", "warning", 4000);

    const idx = tabs.findIndex(t => t.id === id);
    tabs.splice(idx, 1);

    const tel = document.querySelector(`.tab[data-id="${id}"]`);
    if (tel) tel.remove();
    if (ctab_id === id) { switch_tab(tabs[Math.max(0, idx - 1)].id); }
  }

  tcontainer.addEventListener("click", e => {
    const tel = e.target.closest(".tab");
    if (!tel) return;

    const id = parseInt(tel.dataset.id);
    if (e.target.classList.contains("close-btn")) { close_tab(id); } else { switch_tab(id); }
  });

  newtab1.addEventListener("click", createtab);
});
