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
      // template = {
      //   id: '',
      //   role: {
      //     roleName: '',
      //     name: '',
      //     email: '',
      //   },
      // }
      const template = {
        id: '32a7dd00-5df7-431d-98f9-6269c7b4d9a7',
        role: {
          roleName: 'Applicantd',
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
        },
      }
      docusign.sendEmailSignatureRequest(template, (error, docusignResponse) => {
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