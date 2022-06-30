import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBK3RgGAAA55BWGxswVYC7LQ5w3rGdWg8U',
  authDomain: 'music-22e46.firebaseapp.com',
  projectId: 'music-22e46',
  storageBucket: 'music-22e46.appspot.com',
  messagingSenderId: '610467619693',
  appId: '1:610467619693:web:385508805c5e10d7f8b064',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

firestore.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
});

const usersCollection = firestore.collection('users');
const songsCollection = firestore.collection('songs');
const commentsCollection = firestore.collection('comments');

export {
  auth,
  firestore,
  storage,
  usersCollection,
  songsCollection,
  commentsCollection,
};
