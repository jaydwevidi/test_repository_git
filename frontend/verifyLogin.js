// Function to check if the user is still logged in
async function isLoggedIn() {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    const response = await fetch("/user/management/getUserDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 403) {
      console.error("Invalid token:", data.message);
      return false; // Token is invalid
    }

    return response.ok; // True if status code is in the 200-299 range
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}

// Function to execute on page load or at specific intervals
async function verifyLoginStatus() {
  console.log("Verifying Login with token in front end.");
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    console.log("User is NOT logged in, redirecting");
    window.location.href = "/login";
  } else {
    console.log("User is logged in");
    // User is logged in, proceed with your application logic
  }
}

// Execute the check when needed (e.g., on page load)
document.addEventListener("DOMContentLoaded", verifyLoginStatus);
