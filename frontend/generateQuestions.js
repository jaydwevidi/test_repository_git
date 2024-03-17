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
      document.getElementById("result").innerHTML =
        "No authentication token found, please login.";
      return;
    }

    fetch("/userData/getSummary", {
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
        document.getElementById("result").textContent = JSON.stringify(
          data,
          null,
          2
        );
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
});
