const amigooningrn = window.location.pathname.includes("editor"); // Sorry?
const ebtn = document.getElementById("editor_button");
const cbtn = document.getElementById("console_button");

// editor tab
if (amigooningrn) {
    ebtn.classList.add("active");
    ebtn.onclick = null;
    ebtn.onclick = () => window.location.href = "/console";
}

// console tab
else {
    cbtn.classList.add("active");
    cbtn.onclick = null;
    ebtn.onclick = () => window.location.href = "/editor";
}
