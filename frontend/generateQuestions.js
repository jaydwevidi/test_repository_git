document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("questionsForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const videoId = document.getElementById("video_id").value;
    const wordLimit = parseInt(document.getElementById("word_limit").value, 10);
    const numberOfQuestions = parseInt(
      document.getElementById("number_of_questions").value,
      10
    );

    const data = {
      video_id: videoId,
      word_limit: wordLimit,
      number_of_questions: numberOfQuestions,
    };

    console.log("Sending data:", data);

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!token) {
      document.getElementById("result").textContent =
        "No authentication token found, please login.";
      return;
    }

    fetch("/user/action/getSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("Response is ---", response);
        if (!response.ok) {
          console.log(
            `Response Status: ${response.status} ${response.statusText}`
          );
          return response.text().then((text) => {
            throw new Error(text || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        displayResults(data);
      })
      .catch((error) => {
        console.error(
          "There was a problem with your fetch operation: ---- ",
          error
        );
        document.getElementById(
          "result"
        ).textContent = `Error fetching data: ${error}`;
      });
  });

  function displayResults(data) {
    const transcriptDiv = document.getElementById("transcript");
    const summaryDiv = document.getElementById("summary");
    const nextButton = document.getElementById("nextScreen");
    const mcqDiv = document.getElementById("mcq");

    transcriptDiv.style.display = "block";
    summaryDiv.style.display = "block";
    nextButton.style.display = "block";
    mcqDiv.style.display = "block";

    transcriptDiv.textContent = `Transcript: ${data.transcript}`;
    summaryDiv.textContent = `Summary: ${data.summary}`;
    mcqDiv.textContent = `mcq : ${JSON.stringify(data.mcq)}`;

    nextButton.addEventListener("click", () => {
      // Logic to go to the next screen for MCQs will be implemented here
      window.location.href = `mcq_screen.html?mcqId=your_mcq_id`;
    });
  }
  w;
});
