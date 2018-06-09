'use strict';
const express = require('express');
const iosSave = require('./server/ios/save.js');
const app = express();

app.use(express.static('./client'));

app.get('/api/ios/save', (request, response) => {
  iosSave((data) => {
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