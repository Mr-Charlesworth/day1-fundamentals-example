import express from 'express';
import { check, validationResult } from 'express-validator';


import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();

const messages = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());


app.get('/api/messages', (req, res) => {
  res.send(messages);
});

app.post('/api/messages', check(['from', 'message']), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  console.log(req.body);
  messages.push(req.body);
  res.sendStatus(200);
});

app.get('/message-count', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Message Count</title>
  </head>
  <body>
      <h1>Message Count</h1>
      <p>There are ${messages.length} message(s)</p>
      <a href="/messages.html">Back</a>
  </body>
  </html>  
  `)
})


const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});