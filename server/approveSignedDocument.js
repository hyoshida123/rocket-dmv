const firebase = require('./../firebase.js');

module.exports = (callback) => {
  // Update document's approved boolean field in Google Clouds
  firebase.push('signed-documents', {key: 'value'}, (error, data) => {
    callback('approveSignedDocument response');
  });
}