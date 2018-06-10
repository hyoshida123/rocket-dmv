const docusign = require('./services/docusign');
const firebase = require('./services/firebase');

module.exports = (userData, callback) => {
  // Save user data to database
  console.log(JSON.stringify(userData, null, 2));
  if (JSON.stringify(userData, null, 2) !== '{}') {
    userData = JSON.parse(Object.keys(userData)[0]);
  }
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
          roleName: 'Applicant',
          name: (userData.firstName && userData.lastName) ? `${userData.firstName} ${userData.lastName}` : 'Oscar Shaw',
          email: (userData.email) ?  userData.email : 'oshaw587@insite.4cd.edu',
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