const amigooningrn = window.location.pathname.includes("editor");
const ebtn = document.getElementById("editor_button");
const cbtn = document.getElementById("console_button");

if (amigooningrn) {
    ebtn.classList.add("active");
    ebtn.onclick = null;
    cbtn.onclick = () => {
        console.log("console click");
        window.location.href = "/console";
    };
}

else {
    cbtn.classList.add("active");
    cbtn.onclick = null;
    ebtn.onclick = () => {
        console.log("editor click");
        window.location.href = "/editor";
    };
}
