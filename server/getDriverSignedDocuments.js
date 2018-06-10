const firebase = require('./services/firebase');

module.exports = (callback) => {
  // Get all driver signed documents
  firebase.read('documents-signed-driver', (error, firebaseResponse) => {
    if (error) {
      callback(error, null);
    }
    else {
      callback(null, firebaseResponse);
    }
  });
}