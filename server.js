'use strict';
const express = require('express');
const approveSignedDocument = require('./server/approveSignedDocument.js');
const callbackDriverSignedDocument = require('./server/callbackDriverSignedDocument.js');
const callbackOperatorSignedDocument = require('./server/callbackOperatorSignedDocument.js');
const getApprovedDocuments = require('./server/getApprovedDocuments.js');
const getSignedDocuments = require('./server/getSignedDocuments.js');
const saveUserData = require('./server/saveUserData.js');
const app = express();

app.use(express.static('./client'));

// Oscar
app.get('/api/approveSignedDocument', (request, response) => {
  approveSignedDocument('-LEbo-3QdesvhpjLzjXy', (data) => {
    response.send(data);
  });
});

// Oscar
app.get('/api/callbackOperatorSignedDocument', (request, response) => {
  callbackOperatorSignedDocument((data) => {
    response.send(data);
  });
});

// Hideaki
app.get('/api/getSignedDocuments', (request, response) => {
  getSignedDocuments((data) => {
    response.send(data);
  });
});

app.get('/api/getApprovedDocuments', (request, response) => {
  getApprovedDocuments((data) => {
    response.send(data);
  });
});

// Sang
app.get('/api/callbackDriverSignedDocument', (request, response) => {
  callbackDriverSignedDocument((data) => {
    response.send(data);
  });
});

// Hideaki
app.get('/api/saveUserData', (request, response) => {
  saveUserData((data) => {
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