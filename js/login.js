async function handleLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://localhost:7146/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            document.getElementById('error-msg').classList.remove('hidden');
            return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);

        // 🧠 تأكد إنه Admin
        if (data.role !== "Admin") {
            alert("You are not admin");
            return;
        }

        window.location.href = "edu-admin.html";

    } catch (error) {
        document.getElementById('error-msg').classList.remove('hidden');
    }
}

// Enter key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleLogin();
});