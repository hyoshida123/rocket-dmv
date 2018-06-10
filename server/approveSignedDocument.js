const firebase = require('./../firebase.js');

module.exports = (key, callback) => {
  // Update document's approved boolean field in Google Clouds
  firebase.update('signed-documents', key, {approved: true}, (error, data) => {
  	if (error) {
  		callback(error);
  	} else {
    	callback('approveSignedDocument response');
	}
  });
}