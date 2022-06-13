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

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const usersCollection = firebase.firestore().collection('users');
export const songsCollection = firebase.firestore().collection('songs');
export const commentsCollection = firebase.firestore().collection('comments');
export const storage = firebase.storage();
