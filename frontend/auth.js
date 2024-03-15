// Function to handle the login form submission
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        //alert("Login successful!");
        window.location.href = "/";
      } else {
        alert("Login failed: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed");
    });
}

// Attach the event listener to the login form
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});
