<template>
  <q-page padding>
    <q-btn color="primary" icon="check" label="OK" @click="firefunction" />
    <q-btn color="primary" icon="check" label="getdata" @click="getdata" />
  </q-page>
</template>

<script>
import {
  doc,
  setDoc,
  query,
  where,
  getDoc,
  collection,
  addDoc,
  onSnapshot ,
  getFirestore,
} from "firebase/firestore";
import { useAttrs } from "@vue/runtime-core";
import { api } from "../boot/axios";

const asdf = require("firebase/functions");
// const admin = require('firebase/firead')

// console.log(asdf);
// initializeApp()

// listenchange()

const db = getFirestore();

// console.log(db)

// Add a new document in collection "cities"

// firefunction();

export default {
  setup() {
    return {
      firefunction,
      listenchange,
      getdata,
    };
  },
};

const q = query(collection(db, "cities"), where("state", "==", "CA"));
const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
        console.log("New city: ", change.doc.data());
    }
    if (change.type === "modified") {
        console.log("Modified city: ", change.doc.data());
    }
    if (change.type === "removed") {
        console.log("Removed city: ", change.doc.data());
    }
  });
});

async function getdata() {
  const docRef = doc(db, "users", 'number');
  const docSnap = await getDoc(docRef);
  console.log('city changed: ', docSnap.data());
}
var userArray = [];

async function firefunction() {

  const citiesRef = collection(db, "cities");
  await setDoc(doc(citiesRef, "SF"), {
    name: "San Francisco",
    state: "CA",
    country: "zzz",
    capital: false,
    population: 860000,
    regions: ["west_coast", "norcal"],
  });

  return ;

  for (var i = 0; i < 30; i++) {
    const x = Math.random();
    userArray.push(parseInt(x * 100) * 1000 + i);
  }
  // Add a new document with a generated id.
  const docRef = await setDoc(doc(collection(db, "users"),'number'), {
    data: userArray,
  });
  console.log("Document written with ID: ", docRef.id);
}

function generatearray() {
  for (var i = 0; i < 30; i++) {
    const x = Math.random();
    userArray.push(parseInt(x * 100) * 1000 + i);
  }

  console.log(userArray);
}

function listenchange() {
  console.log(asdf);
  exports.myFunctionName = functions.firestore
    .document("cities")
    .onWrite((change, context) => {
      console.log("there is change");
      console.log("change", change, "context", context);
    });
}

async function addcities() {
  const citiesRef = collection(db, "cities");

  await setDoc(doc(citiesRef, "SF"), {
    name: "San Francisco",
    state: "CA",
    country: "USA",
    capital: false,
    population: 860000,
    regions: ["west_coast", "norcal"],
  });
  await setDoc(doc(citiesRef, "LA"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA",
    capital: false,
    population: 3900000,
    regions: ["west_coast", "socal"],
  });
  await setDoc(doc(citiesRef, "DC"), {
    name: "Washington, D.C.",
    state: null,
    country: "USA",
    capital: true,
    population: 680000,
    regions: ["east_coast"],
  });
  await setDoc(doc(citiesRef, "TOK"), {
    name: "Tokyo",
    state: null,
    country: "Japan",
    capital: true,
    population: 9000000,
    regions: ["kanto", "honshu"],
  });
  await setDoc(doc(citiesRef, "BJ"), {
    name: "Beijing",
    state: null,
    country: "China",
    capital: true,
    population: 21500000,
    regions: ["jingjinji", "hebei"],
  });
}
</script>
