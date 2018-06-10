const docusign = require('./services/docusign');

module.exports = (callback) => {
  // Save user data to database
  // Create DocuSign template
  // Send template to DocuSign to send email requesting signature to user
  docusign.sendEmailSignatureRequest((error, data) => {
    if (error) {
      console.log(error);
    }
    else {
      callback(data);
    }
  });
}