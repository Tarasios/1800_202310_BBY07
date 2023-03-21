const firebaseConfig = {
    apiKey: "AIzaSyBDYry2LfiVRQWGZvzf6cR9QgzVKeBPLAc",
    authDomain: "comp1800-bby07.firebaseapp.com",
    projectId: "comp1800-bby07",
    storageBucket: "comp1800-bby07.appspot.com",
    messagingSenderId: "233381287510",
    appId: "1:233381287510:web:2145c0493e5122e24d0df7"
  };
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
