const firebase = require('./services/firebase.js');

module.exports = (key, callback) => {
	// Remove from driver signed docs
	firebase.remove('documents-signed-driver', key, (error, removeResponse) => {
  	if (error) {
  		callback(error, null);
		}
		else {
			// Add to operator signed docs
			firebase.push('documents-signed-operator', pushResponse, (error, pushResponse) => {
				if (error) {
					callback(error, null);
				}
				else {
					callback(pushResponse);
					// Notify driver
				}
			});
		}
	});
	
}