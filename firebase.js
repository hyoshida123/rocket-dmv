let firebase = require('firebase');
/* firebase configuration file */

let config = {
  apiKey: "AIzaSyAUXBGDKPK8MOWJKavLVhaas_FpIlswrMc",
  authDomain: "uberdmv-206723.firebaseapp.com",
  databaseURL: "https://uberdmv-206723.firebaseio.com",
  projectId: "uberdmv-206723",
  storageBucket: "",
  messagingSenderId: "825281072043"
};

firebase.initializeApp(config);

module.exports = firebase;

