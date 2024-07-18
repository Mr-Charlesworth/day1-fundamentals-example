import express from 'express';
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator';


import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();

const messages = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


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
  res.sendStatus(201);
});

app.get('/message-count', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Message Count</title>
      <link rel="stylesheet" href="style.css">
  </head>
  <body>
      <h1>Message Count</h1>
      <a href="/"><p>Home</p></a>
      <p>There are ${messages.length} message(s)</p>
  </body>
  </html>  
  `)
});

app.post('/post-message-broken', check(['from', 'message']), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  console.log(req.body);
  messages.push(req.body);
  res.sendStatus(200)
});

app.post('/post-message', check(['from', 'message']), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  console.log(req.body);
  messages.push(req.body);
  res.redirect('/messages-trad')
});

const getMessagesHtml = (isBroken) => {
  const populateMessages = () => {
    return messages.map(({ from, message }) => `
          <p>From: ${from}</p>
          <p>Message: ${message}<p>
          <hr>
    `).join('')
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Messages</title>
      <link rel="stylesheet" href="style.css">
  </head>
  <body>
      <h1>Messages</h1>
      <a href="/"><p>Home</p></a>
      <form method="post" action="/post-message${isBroken ? "-broken" : ""}">
          <label for="from-input">From</label>
          <input type="text" name="from" id="from-input">
          <label for="from-input">Message</label>
          <input type="text" name="message" id="message-input">
          <input type="submit">
      </form>
      <div id="messages">
          ${populateMessages()}
      </div>
  </body>
  </html>
  `
}

app.get('/messages-trad', (req, res) => {
  const html = getMessagesHtml(false)
  res.send(html);
})

app.get('/messages-trad-broken', (req, res) => {
  const html = getMessagesHtml(true);
  res.send(html);
})


const port = process.env.PORT || 3001;


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});