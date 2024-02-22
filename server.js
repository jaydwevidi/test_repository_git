const express = require('express');
const app = express();
const logger = require('./middleware/logger')

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/getSameNumber/:id', (req,res) => {
  res.status(200).send(req.params.id);
});

app.post('/user/register/', (req, res) => {
    res.send(JSON.stringify(req.body['hi']));
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
