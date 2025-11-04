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
    if (e.target.classList.contains("close-btn")) {
      close_tab(id);
    } else {
      switch_tab(id);
    }
  });

  newtab1.addEventListener("click", createtab);

  ////////////// tabs renaming

  tcontainer.addEventListener("dblclick", srename);
  tcontainer.addEventListener("contextmenu", e => {
    e.preventDefault();
    srename(e);
  });

  function srename(e) { // start ok thx
    const tel = e.target.closest(".tab");
    if (!tel || e.target.classList.contains("close-btn")) return;

    const id = parseInt(tel.dataset.id);
    const tdata = tabs.find(t => t.id === id);
    if (!tdata) return;
    if (tel.querySelector("input")) return;

    const cname = tdata.name.replace(".lua", "");

    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "0";
    wrapper.style.margin = "0";
    wrapper.style.padding = "0";

    const input = document.createElement("input");
    input.type = "text";
    input.value = cname;
    input.maxLength = 20;
    input.className = "tab-rename-input";
    input.style.width = Math.max(40, cname.length * 8) + "px";
    input.style.paddingRight = "0";
    input.style.marginRight = "-1px";
    input.style.borderRight = "none";
    input.style.display = "inline-block";

    const suffix = document.createElement("span");
    suffix.textContent = ".lua";
    suffix.style.pointerEvents = "none";
    suffix.style.color = "inherit";
    suffix.style.fontSize = "inherit";
    suffix.style.marginLeft = "0";
    suffix.style.paddingLeft = "0";

    const close_btn = tel.querySelector(".close-btn");
    if (close_btn) close_btn.style.display = "none";
    tel.textContent = "";
    tel.appendChild(wrapper);
    wrapper.appendChild(input);
    wrapper.appendChild(suffix);

    input.focus();
    input.select();

    input.addEventListener("input", () => {input.style.width = Math.max(40, input.value.length * 8) + "px";}); // idk if this will work btw

    const frename = () => { // finish ok thx np
      let new_name = input.value.trim().substring(0, 20);
      if (new_name === "") new_name = cname;; // cname = current
      tdata.name = new_name + ".lua";
      tel.innerHTML = `${new_name}.lua <span class="close-btn">&times;</span>`;
    };

    input.addEventListener("blur", frename);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") input.blur();
      else if (e.key === "Escape") {input.value = cname; input.blur();}
    });
  }
});
