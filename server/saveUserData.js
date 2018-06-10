const docusign = require('./services/docusign');
const firebase = require('./services/firebase');

module.exports = (userData, callback) => {
  // Save user data to database
  firebase.push('user-data', userData, (error, firebaseResponse) => {
    if (error) {
      callback(error, null);
    }
    else {
      // Create DocuSign template
      
      // Send template to DocuSign to send email requesting signature to user
      docusign.sendEmailSignatureRequest((error, docusignResponse) => {
        if (error) {
          callback(error, null);
        }
        else {
          callback(null, docusignResponse);
        }
      });
    }
  });
}