const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_in_btn1 = document.querySelector("#sign-in-btn1");
const sign_up_btn = document.querySelector("#sign-up-btn");
const sign_up_btn1 = document.querySelector("#sign-up-btn1");

const container = document.querySelector(".container");

// Get form elements
const signInForm = document.querySelector(".sign-in-form");
const signUpForm = document.querySelector(".sign-up-form");

// Event listeners for switching forms
sign_up_btn1.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

sign_in_btn1.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Function to validate email
function validateEmail(email) {
  // Regular expression to check if the email follows the proper format
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the regular expression
  const isValid = regex.test(email);

  // Return true if the email follows the proper format, otherwise false
  return isValid;
}

// Function to validate password
function validatePassword(password) {
  // Regular expression to check if the password meets the required criteria
  const regex =
    /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  // Check if the password matches the regular expression
  const isValid = regex.test(password);

  // Return true if the password meets the criteria, otherwise false
  return isValid;
}

function displayPopup(div_name, message) {
  // Get the alert container
  const alertContainer = document.querySelector(div_name);

  // Create the alert message element
  const alertMessage = document.createElement("div");
  alertMessage.classList.add("alert");
  alertMessage.textContent = message;

  // Append the alert message to the container
  alertContainer.appendChild(alertMessage);

  // Remove the alert message after a certain time
  setTimeout(() => {
    alertMessage.remove();
  }, 2000); // Adjust the time (in milliseconds) as needed
}

// Sign Up validation
signUpForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submit action

  function handleSignup(event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const email = document.querySelector(
      '.sign-up-form input[type="email"]'
    ).value;
    const password = document.querySelector(
      '.sign-up-form input[type="password"]'
    ).value;

    // Prepare request body
    const requestBody = JSON.stringify({
      email: email,
      password: password,
      fname: "aa",
      lname: "aa",
      phone: "456468",
      gender: "male",
      dob: "2020-11-1",
      // Add other fields if needed (e.g., fname, lname, phone, gender, dob)
    });

    // Make a POST request to the register endpoint
    fetch("/user/management/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response from the server
        console.log(data);
        // Check for successful signup or error
        if (data.hasOwnProperty("error")) {
          // Display error message in a pop-up
          displayPopup(".password-container", "Account already exists!");
        } else {
          // Redirect to sign in page
          const signUpSuccessfulDiv = document.querySelector(
            ".sign-up-successful"
          );
          signUpSuccessfulDiv.innerHTML =
            "Sign up successful!, Please Sign In!"; // Set inner HTML content
          container.classList.remove("sign-up-mode");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors here
        // Display error message in a pop-up
        displayPopup("An error occurred. Please try again later.");
      });
  }
  // Function to display error message in the alert container

  console.log("signUpForm");
  const email = signUpForm.querySelector('input[type="email"]').value;
  const password = signUpForm.querySelector('input[type="password"]').value;
  if (!validateEmail(email) || !validatePassword(password)) {
    if (!validateEmail(email)) {
      console.log("validateEmail");
      displayPopup(".email-container", "Please enter a valid email address.");
    } else if (!validatePassword(password)) {
      console.log("validatePassword");
      displayPopup(
        ".password-container",
        "Password must be 8 characters long, include 1 uppercase, 1 lowercase, 1 number, & 1 special character."
      );
    } else {
      console.log("all field container");
      displayPopup(
        ".all-field-container",
        "Please fill in all fields for signing up."
      );
    }
  } else {
    // Proceed with form submission or further validation here
    const sign_up_btn = document.querySelector("#sign-up-btn");
    handleSignup(event);
  }
});

// Function to handle sign-in form submission
function handleSignin(event) {
  event.preventDefault(); // Prevent form submission

  // Get input values
  const email = document.querySelector(
    '.sign-in-form input[type="email"]'
  ).value;
  const password = document.querySelector(
    '.sign-in-form input[type="password"]'
  ).value;

  // Prepare request body
  const requestBody = JSON.stringify({
    email: email,
    password: password,
  });

  // Make a POST request to the login endpoint
  fetch("http://3.90.66.68:3000/user/management/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle response from the server
      console.log(data);

      // Check if the response contains a token
      if (data.hasOwnProperty("token")) {
        // Save the token for future use (e.g., in local storage or a cookie)
        localStorage.setItem("token", data.token);
        // Redirect to another page or perform further actions
        window.location.href = "Upload with url.html";
      } else {
        // Display error message in a pop-up
        displayPopup(
          ".sign-in-error",
          "Invalid email or password. Please try again."
        );
      }
    })
    .catch((error) => {
      // console.error("Error:", error);
      // Handle errors here
      // Display error message in a pop-up
      displayPopup(
        ".sign-in-error",
        "An error occurred. Please try again later."
      );
    });
}

// function handleSignin(event) {
//   event.preventDefault(); // Prevent form submission

//   // Get input values
//   const email = document.querySelector('.sign-in-form input[type="email"]').value;
//   const password = document.querySelector('.sign-in-form input[type="password"]').value;

//   // Prepare request body
//   const requestBody = JSON.stringify({
//       email: email,
//       password: password
//   });

//   // Simulated mock data from the API
//   const mockData = {
//       'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJpYXQiOjE3MDk2ODcxNTYsImV4cCI6MTcwOTY5MDc1Nn0.bPsKh_Yj4E3L5DWlFcAr0O-0FBNZ3YQPFZrPGEKclUw'
//   };

//   // Simulate fetching data from the server (replace with actual fetch call)
//   setTimeout(() => {
//       // Check if the response contains a token
//       if (mockData.hasOwnProperty('token')) {
//           // Save the token for future use (e.g., in local storage or a cookie)
//           localStorage.setItem('token', mockData.token);
//           // Redirect to another page or perform further actions
//           window.location.href = 'Upload with url.html';
//       } else {
//           // Display error message in a pop-up
//           displayPopup(".sign-in-error", "Invalid email or password. Please try again.");
//       }
//   }, 1000); // Simulated delay of 1 second for API call
// }

// Event listener for sign-in form submission
signInForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submit action

  // Get input values
  const email = signInForm.querySelector('input[type="email"]').value;
  const password = signInForm.querySelector('input[type="password"]').value;

  // Validate email and password
  if (!validateEmail(email) || !password) {
    // Display error message in a pop-up
    displayPopup(".sign-in-error", "Please enter a valid email and password.");
  } else {
    // Proceed with sign-in
    handleSignin(event);
  }
});
