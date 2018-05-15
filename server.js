const express = require('express');
const app = express();
const fs = require('fs');
const rt = require('./resource_tracker.js');
const port = 1337;
const mainPage = 'index.html';
let router = express.Router();

router.use((request, response, next) => {
  console.log(request.url);
  next();
});

router.get('/', (request, response) => {
  fs.readFile(mainPage, 'utf8', (error, pageHtml) => {
    if (error) {
      response.status(500).send('Error reading main page.');
    }
    response.status(200).send(pageHtml);
  });
});

router.get('/data', (request, response) => {
  const stuff = {
    things: 'derp',
    who: 'what'
  };
  response.json(stuff);
});

app.all('*', router);

let server = app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  // const serverHost = server.address().address;
  // const serverPort = server.address().port;

  console.log(`server is listening on ${port}`);
});

