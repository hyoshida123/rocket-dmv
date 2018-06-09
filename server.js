'use strict';
const express = require('express');
const approveSignedDocument = require('./server/approveSignedDocument.js');
const getSignedDocuments = require('./server/getSignedDocuments.js');
const submitSignedDocument = require('./server/submitSignedDocument.js');
const app = express();

app.use(express.static('./client'));

app.get('/api/approveSignedDocument', (request, response) => {
  approveSignedDocument((data) => {
    response.send(data);
  });
});

app.get('/api/getSignedDocuments', (request, response) => {
  getSignedDocuments((data) => {
    response.send(data);
  });
});

app.get('/api/submitSignedDocument', (request, response) => {
  submitSignedDocument((data) => {
    response.send(data);
  });
});

app.get('*', (request, response) => {
  response.sendFile(__dirname + '/client/build/index.html');
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});