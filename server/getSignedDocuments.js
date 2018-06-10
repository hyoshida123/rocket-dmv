const firebase = require('./services/firebase.js');

module.exports = (callback) => {
	var retrieved_data = firebase.read('signed-documents', (error, data) => {
  		if (error) {
  			callback(error);
  		} else {
    		callback(data);
		}
	});

	
	for (var key in retrieved_data) {
		console.log(key);
	}

}