const verify = require("./verifyLogin");

function handleRegister(event) {
  event.preventDefault();

  // Retrieve input values from the form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const phone = document.getElementById("phone").value;
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;
  const errorMessage = document.getElementById("errorMessage");

  // Send a POST request to the server with the form data
  fetch("/user/management/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      fname: fname,
      lname: lname,
      phone: phone,
      gender: gender,
      dob: dob,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // Log the response status and message
        console.log("Response status:", response.status);
        console.log("Response json:", response.json.body);
        return response.json(); // Convert response body to JSON
      }
      return response.json(); // Convert response body to JSON
    })
    .then((data) => {
      console.log(data);
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error("Error:", error);
      errorMessage.textContent =
        "Registration failed. Please check your information. " + error;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
    console.log("Added event listener to the registration form.");
  }
});
