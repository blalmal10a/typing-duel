<template>
  <q-page padding> asdfasdf </q-page>
</template>

<script>
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getFirestore,
} from "firebase/firestore";

const asdf = require("firebase/functions");
// const admin = require('firebase/firead')

// console.log(asdf);
// initializeApp()

listenchange()

const db = getFirestore();

// console.log(db)

// Add a new document in collection "cities"

// firefunction();

export default {
  setup() {
    return {};
  },
};

async function firefunction() {
  // import { collection, addDoc } from "firebase/firestore";

  // Add a new document with a generated id.
  const docRef = await addDoc(collection(db, "cities"), {
    name: "Tokyoyo",
    country: "Japaan",
  });
  console.log("Document written with ID: ", docRef.id);

  // await setDoc(doc(db, "cities", "LA"), {
  //   name: "Los Angeles",
  //   state: "CA",
  //   country: "USA",
  // });
  // await setDoc(doc());

  //another version 8
  // db.collection("cities")
  //   .doc("LA")
  //   .set({
  //     name: "Los Angeles",
  //     state: "CA",
  //     country: "USA",
  //   })
  //   .then(() => {
  //     console.log("Document successfully written!");
  //   })
  //   .catch((error) => {
  //     console.error("Error writing document: ", error);
  //   });

  //nodejs version

  // const res = await db.collection('cities').doc('LA').set(data);
}

function listenchange() {
  console.log(asdf)
  // exports.myFunctionName = functions.firestore
  //   .document("cities")
  //   .onWrite((change, context) => {
  //     console.log("there is change");
  //     console.log("change", change, "context", context);
  //   });
}
</script>
