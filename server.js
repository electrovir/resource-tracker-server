const express = require('express');
const fs = require('fs');
const tracker = require('./resource_tracker.js');
const chalk = require('chalk');

const app = express();
const port = 1337;
const mainPage = 'index.html';
let router = express.Router();

router.use((request, response, next) => {
  const requestTime = new Date();
  console.log(chalk`{magenta.bold ${request.originalUrl}} from {bold ${request.ip}} at {bold ${request.hostname}} ${requestTime}`);
  next();
});

router.get('/data', (request, response) => {
  response.json(tracker.trackedValues);
});

router.get('/', (request, response) => {
  fs.readFile(mainPage, 'utf8', (error, pageHtml) => {
    if (error) {
      response.status(500).send('Error reading main page.');
      console.error('Error reading main page:', error);
    }
    response.status(200).send(pageHtml);
  });
});

router.get('/stop-updating', (request, response) => {
  console.info('Stopping tracker updating.');
  tracker.stopUpdating();
});

router.get('/start-updating', (request, response) => {
  console.info('Starting tracker updating.');
  tracker.startUpdating();
});

app.all('*', router);

let server = app.listen(port, (err) => {
  if (err) {
    return console.error('Server failed to startup with error:', err);
  }
  
  tracker.changeDelay(5000);
  tracker.startUpdating();
  
  console.log(chalk`{yellow Server is listening on port {bold ${port}}.}`);
});

