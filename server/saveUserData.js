const firebase = require('./services/firebase.js');

module.exports = (payload, callback) => {
  // Save user data to database
  // Create DocuSign template
  // Send template to DocuSign to send email requesting signature to user
  firebase.push('signed-documents', payload, (error, data) => {
  	if (error) {
  		callback(error);
  	} else {
    	callback('saveUserData response');
	}
  });
}