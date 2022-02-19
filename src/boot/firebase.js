
import { initializeApp } from "firebase/app";
import { browserLocalPersistence } from "firebase/auth";

const serviceAccount = require('./service.json')


const firebaseConfig = {
  apiKey: "AIzaSyDWp4tt9FgtwxHQ9Fr7VyH7IRzsG9eLN8k",
  authDomain: "asdf-a2032.firebaseapp.com",
  databaseURL: "https://asdf-a2032-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "asdf-a2032",
  storageBucket: "asdf-a2032.appspot.com",
  messagingSenderId: "1053175531568",
  appId: "1:1053175531568:web:0680c482f227d5f41f45f5",
  persistence: "browserLocalPersistence",
  credential: serviceAccount
};


// initializeApp.getCurrentUser = () => {
//   return new Promise((resolve, reject) => {
//     const unsubscribe = firebase.auth().onAuthStateChanged(user => {
//       unsubscribe();
//       resolve(user);
//     }, reject);
//   })
// };



const app = initializeApp(firebaseConfig);
export default firebaseConfig

export { app }
