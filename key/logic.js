document.getElementById("login-btn").addEventListener("click", function () {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!user || !pass) {return;}

    if (user === "admin" && pass === "password") { alert("hi"); } else {alert("no");}
});
