'use strict';
const express = require('express');
const app = express();

const approveSignedDocument = require('./server/approveSignedDocument.js');
const docusign = require('./server/services/docusign.js');
const getOperatorSignedDocuments = require('./server/getOperatorSignedDocuments.js');
const getDriverSignedDocuments = require('./server/getDriverSignedDocuments.js');
const submitUserData = require('./server/submitUserData.js');

app.use(express.static('./client'));

const display = (error, data, response) => {
  if (error) {
    response.send('ERROR:', error);
  }
  else {
    response.send(data);
  }
}

// docusign.signatureUpdateListener((error, envelopes) => { // Listen for updates
//   console.log(envelopes);
// });

// docusign.getAccountListStatus((error, data) => { // Listen for updates
//   console.log(data);
// });

app.post('/api', (request, response) => {
  switch (request.query.endpoint) {
    case 'approveSignedDocument': { // DONE, except for text and email notifications
      approveSignedDocument('-LEbo-3QdesvhpjLzjXy', (error, data) => { display(error, data, response) });
      break;
    }
    case 'submitUserData': { // DONE, except for getting template
      submitUserData(
        {
          firstName: 'Oscar',
          lastName: 'Shaw',
          zipCode: '90120',
        },
        (error, data) => { display(error, data, response) }
      );
      break;
    }
    default: {
      display('Invalid or missing endpoint', null, response);
      break;
    }
  }
});

app.get('/api', (request, response) => {
  switch (request.query.endpoint) {
    case 'getDriverSignedDocuments': { // DONE
      getDriverSignedDocuments((error, data) => { display(error, data, response) });
      break;
    }
    case 'getOperatorSignedDocuments': { // DONE
      getOperatorSignedDocuments((error, data) => { display(error, data, response) });
      break;
    }
    default: {
      display('Invalid or missing endpoint', null, response);
      break;
    }
  }
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});

// // DONE, except for text and email notifications
// app.get('/api/approveSignedDocument', (request, response) => {
//   approveSignedDocument('-LEbo-3QdesvhpjLzjXy', (error, data) => {
//     if (error) {
//       response.send('ERROR:', error);
//     }
//     else {
//       response.send(data);
//     }
//   });
// });

// // TODO, need to check what callback Docusign sends
// app.get('/api/callbackOperatorSignedDocument', (request, response) => {
//   callbackOperatorSignedDocument((error, data) => {
//     if (error) {
//       response.send('ERROR:', error);
//     }
//     else {
//       response.send(data);
//     }
//   });
// });

// // DONE
// app.get('/api/getDriverSignedDocuments', (request, response) => {
//   getDriverSignedDocuments((error, data) => {
//     if (error) {
//       response.send('ERROR:', error);
//     }
//     else {
//       response.send(data);
//     }
//   });
// });

// // DONE
// app.get('/api/getOperatorSignedDocuments', (request, response) => {
//   getOperatorSignedDocuments((error, data) => {
//     if (error) {
//       response.send('ERROR:', error);
//     }
//     else {
//       response.send(data);
//     }
//   });
// });

// // TODO, need to check what callback Docusign sends
// app.get('/api/callbackDriverSignedDocument', (request, response) => {
//   callbackDriverSignedDocument((error, data) => {
//     if (error) {
//       response.send('ERROR:', error);
//     }
//     else {
//       response.send(data);
//     }
//   });
// });

// // DONE, except for getting template
// app.get('/api/submitUserData', (request, response) => {
//   submitUserData(
//     {
//       firstName: 'Oscar',
//       lastName: 'Shaw',
//       zipCode: '90120',
//     },
//     (error, data) => {
//       if (error) {
//         response.send('ERROR:', error);
//       }
//       else {
//         response.send(data);
//       }
//     }
//   );
// });