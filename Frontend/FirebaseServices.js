import firebase from 'firebase';
class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: 'AIzaSyB48r7GmWqAWG7-hPzeIq1wQncgRr1on-o',
        authDomain: 'meetup-d4725.firebaseapp.com',
        databaseURL: 'https://meetup-d4725.firebaseio.com',
        projectId: 'meetup-d4725',
        storageBucket: 'meetup-d4725.appspot.com',
        messagingSenderId: '849288176375',
        appId: '1:849288176375:web:4e4ac74086e96717',
      });
    }
  }
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };
  createAccount = async (user, success_callback, failed_callback) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };
}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
