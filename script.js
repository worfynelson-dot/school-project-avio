document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const feedback = document.getElementById("login-feedback");

  function handleLogin() {
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (user === "user" && pass === "user") {
      localStorage.setItem("role", "user");
      window.location.href = "dashboard.html";
    } else if (user === "adityagalihpratama" && pass === "aditya1717") {
      localStorage.setItem("role", "admin");
      window.location.href = "dashboard.html";
    } else {
      feedback.textContent = "Login gagal. Coba lagi.";
    }
  }

  loginBtn.addEventListener("click", handleLogin);

  // Trigger login on Enter key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  });
});
