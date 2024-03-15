// logout.js

function handleLogout() {
  // Remove the stored token from localStorage
  localStorage.removeItem("token");

  // Optionally, perform any cleanup actions before logging out

  // Redirect to the login page or home page
  window.location.href = "/login";
}

// Attach the logout function to a logout button or event
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
});
