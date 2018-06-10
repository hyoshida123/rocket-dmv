'use strict';
const express = require('express');
const approveSignedDocument = require('./server/approveSignedDocument.js');
const callbackDriverSignedDocument = require('./server/callbackDriverSignedDocument.js');
const callbackOperatorSignedDocument = require('./server/callbackOperatorSignedDocument.js');
const getOperatorSignedDocuments = require('./server/getOperatorSignedDocuments.js');
const getDriverSignedDocuments = require('./server/getDriverSignedDocuments.js');
const saveUserData = require('./server/saveUserData.js');
const app = express();

app.use(express.static('./client'));

// DONE, except for text and email notifications
app.get('/api/approveSignedDocument', (request, response) => {
  approveSignedDocument('-LEbo-3QdesvhpjLzjXy', (error, data) => {
    if (error) {
      response.send('ERROR:', error);
    }
    else {
      response.send(data);
    }
  });
});

// TODO, need to check what callback Docusign sends
app.get('/api/callbackOperatorSignedDocument', (request, response) => {
  callbackOperatorSignedDocument((error, data) => {
    if (error) {
      response.send('ERROR:', error);
    }
    else {
      response.send(data);
    }
  });
});

// DONE
app.get('/api/getDriverSignedDocuments', (request, response) => {
  getDriverSignedDocuments((error, data) => {
    if (error) {
      response.send('ERROR:', error);
    }
    else {
      response.send(data);
    }
  });
});

// DONE
app.get('/api/getOperatorSignedDocuments', (request, response) => {
  getOperatorSignedDocuments((error, data) => {
    if (error) {
      response.send('ERROR:', error);
    }
    else {
      response.send(data);
    }
  });
});

// TODO, need to check what callback Docusign sends
app.get('/api/callbackDriverSignedDocument', (request, response) => {
  callbackDriverSignedDocument((error, data) => {
    if (error) {
      response.send('ERROR:', error);
    }
    else {
      response.send(data);
    }
  });
});

// DONE, except for getting template
app.get('/api/saveUserData', (request, response) => {
  saveUserData(
    {
      firstName: 'Oscar',
      lastName: 'Shaw',
      zipCode: '90120',
    },
    (error, data) => {
      if (error) {
        response.send('ERROR:', error);
      }
      else {
        response.send(data);
      }
    }
  );
});

app.get('*', (request, response) => {
  response.sendFile(__dirname + '/client/build/index.html');
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});