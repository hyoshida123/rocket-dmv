const firebase = require('firebase-admin');
// let firebase = require('firebase');
/* firebase configuration file */

let database;

const config = {
  apiKey: "AIzaSyAUXBGDKPK8MOWJKavLVhaas_FpIlswrMc",
  authDomain: "uberdmv-206723.firebaseapp.com",
  credential: {
    getAccessToken: () => ({
      expires_in: 0,
      access_token: '',
    }),
  },
  databaseURL: "https://uberdmv-206723.firebaseio.com",
  projectId: "uberdmv-206723",
  storageBucket: "uberdmv-206723.appspot.com",
  messagingSenderId: "825281072043"
};

firebase.initializeApp(config);
database = firebase.database();

module.exports = {
  read: (collection, callback) => {
    const reference = database.ref(collection);
    reference.on('value', (data) => {
      callback(null, data.val());
    }, (error) => {
      callback(error, null);
    });
  },
  push: (collection, payload, callback) => {
    const reference = database.ref(collection);
    reference.push(payload);
    reference.on('value', (data) => {
      callback(null, data.val());
    }, (error) => {
      callback(error, null);
    });
  },
  update: (collection, key, payload, callback) => {
    const reference = database.ref(collection);
    reference.child(key).set(payload);
    reference.on('value', (data) => {
      callback(null, data.val());
    }, (error) => {
      callback(error, null);
    });
  }
}

