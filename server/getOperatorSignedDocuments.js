module.exports = (firstName, lastName, callback) => {
  firebase.read('documents-signed-operator', (error, firebaseResponse) => {
    if (error) {
      callback(error, null);
    }
    else {
      firebaseResponse = firebaseResponse.filter(document => document.firstName === firstName && document.lastName === lastName);
      callback(null, firebaseResponse);
    }
  });
}