function fetchUserDetails() {
  const token = localStorage.getItem("token");
  if (!token) {
    document.getElementById("userData").innerHTML =
      "No authentication token found, please login.";
    return;
  }

  fetch("/user/management/getUserDetails", {
    method: "POST", // Ensure this method is correct; it might be GET
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Format and display the user details
      const userDetails = `
        <li><label>ID:</label> ${data.id}</li>
        <li><label>First Name:</label> ${data.fname}</li>
        <li><label>Last Name:</label> ${data.lname}</li>
        <li><label>Email:</label> ${data.email}</li>
        <li><label>Phone:</label> ${data.phone}</li>
        <li><label>Password Hash:</label> ${data.password}</li>
        <li><label>Gender:</label> ${
          data.gender === 1 ? "Male" : data.gender === 2 ? "Female" : "Other"
        }</li>
        <li><label>Date of Birth:</label> ${new Date(
          data.dob
        ).toLocaleDateString()}</li>
        <li><label>Account Created At:</label> ${new Date(
          data.account_created_at
        ).toLocaleString()}</li>
      `;

      console.log(data);

      document.getElementById("userData").innerHTML = userDetails;
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
      document.getElementById("userData").innerHTML = "Error fetching data.";
    });
}

// Call fetchUserDetails when the page loads
document.addEventListener("DOMContentLoaded", fetchUserDetails);
