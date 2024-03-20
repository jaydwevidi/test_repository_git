const sidebar = document.querySelector("#sidebar");
const hide_sidebar = document.querySelector(".hide-sidebar");
const new_chat_button = document.querySelector(".new-chat");

// Function to handle logout
function handleLogout() {
    // Clear the data from local storage
    localStorage.clear();
    // Redirect to the login page or perform any other necessary actions
    window.location.href = 'login.html'; // Replace 'login.html' with your actual login page URL
}

// Function to add event listener to the logout button
function addLogoutEventListener() {
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
}

// Call the function to add event listener to the logout button
addLogoutEventListener();

// Function to handle drag over event
function handleDragOver(event) {
    event.preventDefault();
    document.getElementById('fileDropArea').classList.add('highlight');
}

// Function to handle drag leave event
function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('fileDropArea').classList.remove('highlight');
}

// Function to handle drop event
function handleDrop(event) {
    event.preventDefault();
    document.getElementById('fileDropArea').classList.remove('highlight');
    const files = event.dataTransfer.files;
    handleFiles(files);
}

// Function to handle file input change event
document.getElementById('fileDropArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

// Function to handle file input change event
document.getElementById('fileInput').addEventListener('change', (event) => {
    const files = event.target.files;
    handleFiles(files);
});

// Function to handle files
function handleFiles(files) {
    // Handle file upload logic here
    console.log(files);

    // You can upload the files using AJAX or any other method here
}

function redirectToAnotherPage() {
    // Show the buffering animation
    document.getElementById('loading-spinner').style.display = 'block';

    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Retrieve the video URL from the input field
    const videoUrl = document.getElementById('videoUrlInput').value;

    // Prepare the request body with the video URL
    const requestBody = JSON.stringify({
        "word_limit": 50,
        "video_id": videoUrl,
        "number_of_questions": 5,
        "additional_instructions": ""
    });

    fetch("http://3.90.66.68:3000/user/action/getSummary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: requestBody
    })
    .then(response => response.json())
    .then(data => {
        if (data.hasOwnProperty('summary')) {
            // Encode the summary data and append it as a query parameter
            const summaryQueryParam = encodeURIComponent(data.summary);
            // Store the summary data in localStorage
            localStorage.setItem('summaryData', JSON.stringify(data.summary));

            // Store the MCQ data in localStorage
            localStorage.setItem('mcqData', JSON.stringify(data.mcq));
            // Redirect to index.html with both summary and MCQ data
            window.location.href = "index.html";
        } else {
            console.error("Error: Request was not successful");
        }
        // Hide the buffering animation
        document.getElementById('loading-spinner').style.display = 'none';
    })
    .catch(error => {
        console.error("Error:", error);
        // Hide the buffering animation
        document.getElementById('loading-spinner').style.display = 'none';
    });
}



const user_menu = document.querySelector(".user-menu ul");
const show_user_menu = document.querySelector(".user-menu button");

show_user_menu.addEventListener("click",
function() {
    if (user_menu.classList.contains("show")) {
        user_menu.classList.toggle("show");
        setTimeout(function() {
            user_menu.classList.toggle("show-animate");
        },
        200);
    } else {
        user_menu.classList.toggle("show-animate");
        setTimeout(function() {
            user_menu.classList.toggle("show");
        },
        50);
    }
});

const models = document.querySelectorAll(".model-selector button");

for (const model of models) {
    model.addEventListener("click", function() {
        const selectedButton = document.querySelector(".model-selector button.selected");
        if (selectedButton) {
            selectedButton.classList.remove("selected");
        }
        model.classList.add("selected");
    });
}

const message_box = document.querySelector("#message");

message_box.addEventListener("keyup",
function() {
    message_box.style.height = "auto";
    let height = message_box.scrollHeight + 2;
    if (height > 200) {
        height = 200;
    }
    message_box.style.height = height + "px";
});

function show_view(view_selector) {
    document.querySelectorAll(".view").forEach(view => {
        view.style.display = "none";
    });

    document.querySelector(view_selector).style.display = "flex";
}

new_chat_button.addEventListener("click", function() {
    show_view(".new-chat-view");
});

document.querySelectorAll(".conversation-button").forEach(button => {
    button.addEventListener("click", function() {
        show_view(".conversation-view");
    });
});