// Function to handle the login form submission
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  fetch("/user/management/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // Log the response status and message
        console.log("Response status:", response.status);
        console.log("Response json:", response.json);
        return response.json(); // Convert response body to JSON
      }
      return response.json(); // Convert response body to JSON
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        throw new Error("Token not received.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      errorMessage.textContent =
        "Login failed. Please check your credentials." + error;
    });
}

// Attach the event listener to the login form
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});
