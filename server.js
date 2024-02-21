const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!' + ``);
});

app.post('user/register/', (req, res) => {
    res.send("User Registered Successfully.")
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 