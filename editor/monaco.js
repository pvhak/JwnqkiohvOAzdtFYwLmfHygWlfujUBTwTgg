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
    quickSuggestions: { other: true, comments: true, strings: true },
    scrollBeyondLastLine: false,
  });

  window.editor = editor;

  function intellisense1(label, kind, doc, itext) {
    ccompls.push({
      label,
      kind: monaco.languages.CompletionItemKind[kind] || monaco.languages.CompletionItemKind.Text,
      insertText: itext,
      documentation: doc,
    });
  }

  const ccompls = [];

  for (const Key of ["_G", "_VERSION", "Enum", "game", "plugin", "shared", "script", "workspace", "DebuggerManager", "elapsedTime", "LoadLibrary", "PluginManager", "settings", "tick", "time", "typeof", "UserSettings"])
    intellisense1(Key, "Keyword", Key, Key);

  for (const Key of ["and", "break", "do", "else", "elseif", "end", "false", "for", "function", "if", "in", "local", "nil", "not", "or", "repeat", "return", "then", "true", "until", "while"])
    intellisense1(Key, "Keyword", Key, Key);

  for (const Key of ["math.abs", "math.acos", "math.asin", "math.atan", "math.atan2", "math.ceil", "math.cos", "math.cosh", "math.deg", "math.exp", "math.floor", "math.fmod", "math.frexp", "math.huge", "math.ldexp", "math.log", "math.max", "math.min", "math.modf", "math.pi", "math.pow", "math.rad", "math.random", "math.randomseed", "math.sin", "math.sinh", "math.sqrt", "math.tan", "math.tanh", "table.concat", "table.foreach", "table.foreachi", "table.sort", "table.insert", "table.remove", "Color3.new", "Instance.new", "BrickColor.new", "Vector3.new", "Vector2.new", "debug.gethook", "debug.getinfo", "debug.getlocal", "debug.getmetatable", "debug.getregistry", "debug.getupvalue", "debug.getuservalue", "debug.sethook", "debug.setlocal", "debug.setmetatable", "debug.setupvalue", "debug.setuservalue", "debug.traceback", "debug.upvalueid", "debug.upvaluejoin", "string.byte", "string.char", "string.dump", "string.find", "string.format", "string.gmatch", "string.gsub", "string.len", "string.lower", "string.match", "string.rep", "string.reverse", "string.sub", "string.upper", "coroutine.create", "coroutine.resume", "coroutine.running", "coroutine.status", "coroutine.wrap", "coroutine.yield"])
    intellisense1(Key, "Method", Key, Key);

  for (const Key of ["Drawing", "debug", "Instance", "Color3", "Vector3", "Vector2", "BrickColor", "math", "table", "string", "coroutine", "Humanoid", "ClickDetector", "LocalScript", "Model", "ModuleScript", "Mouse", "Part", "Player", "Script", "Tool", "RunService", "UserInputService", "Workspace"])
    intellisense1(Key, "Class", Key, Key);

  for (const Key of ["print", "warn", "wait", "info", "printidentity", "assert", "collectgarbage", "error", "getfenv", "getmetatable", "setmetatable", "ipairs", "loadfile", "loadstring", "newproxy", "next", "pairs", "pcall", "spawn", "rawequal", "rawget", "rawset", "select", "tonumber", "tostring", "type", "unpack", "xpcall", "delay", "stats", ":Remove()", ":BreakJoints()", ":GetChildren()", ":FindFirstChild()", ":FireServer()", ":InvokeServer()", ":ClearAllChildren()", ":Clone()", ":Destroy()", ":FindFirstAncestor()", ":FindFirstAncestorOfClass()", ":FindFirstAncestorWhichIsA()", ":FindFirstChildOfClass()", ":FindFirstChildWhichIsA()", ":GetDebugId()", ":GetDescendants()", ":GetFullName()", ":IsA()", ":GetPropertyChangedSignal()", ":IsAncestorOf()", ":IsDescendantOf()", ":WaitForChild()", ":Connect()", ":AncestryChanged()", ":Changed()", ":ChildAdded()", ":ChildRemoved()", ":DescendantAdded()", ":DescendantRemoving()", ":GetService()", ":GetObjects()", ":HttpGet()", ":Wait()"])
    intellisense1(Key, "Function", Key, Key.includes(":") ? Key.substring(1) : Key);

  for (const Key of ["Visible", "Color", "Transparency", "Thickness", "From", "To", "Text", "Size", "Center", "Outline", "OutlineColor", "Position", "TextBounds", "Font", "Data", "Rounding", "NumSides", "Radius", "Filled", "PointA", "PointB", "PointC", "PointD"])
    intellisense1(Key, "Property", "Property for Drawing Library", Key);

    monaco.languages.registerCompletionItemProvider('lua', {
      triggerCharacters: [
        '.', ':',
        '_',
        ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
      ],
      provideCompletionItems: function (model, position) {return { suggestions: ccompls };}
    });


  
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
