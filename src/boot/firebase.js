
import { initializeApp } from "firebase/app";
import { browserLocalPersistence } from "firebase/auth";

const serviceAccount = require('./service.json')


// const firebaseConfig = {
//   apiKey: "AIzaSyDWp4tt9FgtwxHQ9Fr7VyH7IRzsG9eLN8k",
//   authDomain: "asdf-a2032.firebaseapp.com",
//   databaseURL: "https://asdf-a2032-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "asdf-a2032",
//   storageBucket: "asdf-a2032.appspot.com",
//   messagingSenderId: "1053175531568",
//   appId: "1:1053175531568:web:0680c482f227d5f41f45f5",
//   persistence: "browserLocalPersistence",
//   credential: serviceAccount
// };

const firebaseConfig = {
  apiKey: "AIzaSyCyPwykQ1zqhtCCn0bN0xiXjx94znYq0u8",
  authDomain: "tilte-do-list.firebaseapp.com",
  databaseURL: "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tilte-do-list",
  storageBucket: "tilte-do-list.appspot.com",
  messagingSenderId: "875408807380",
  appId: "1:875408807380:web:b313d9621417826473b241"
};



const app = initializeApp(firebaseConfig);

export default firebaseConfig

export { app }





// initializeApp.getCurrentUser = () => {
//   return new Promise((resolve, reject) => {
//     const unsubscribe = firebase.auth().onAuthStateChanged(user => {
//       unsubscribe();
//       resolve(user);
//     }, reject);
//   })
// };
