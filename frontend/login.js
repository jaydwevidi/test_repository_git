function handleLogin(event) {
  localStorage.removeItem("token");
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
        // Log the response status
        return response.json().then((data) => {
          console.log("Error response data:", data); // Log the error response data
          throw new Error(data.message || "Error during login");
        });
      }
      return response.json(); // Convert and return response body to JSON
    })
    .then((data) => {
      console.log("Response data:", data); // Log the success response data
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        throw new Error("Token not received.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      errorMessage.textContent = "Login failed. " + error;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});
