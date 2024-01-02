<template>
  <q-layout
    view="hHh lpR fFf"
    style="height: 100vh"
  >
    <q-header
      v-if="!$route.meta.test"
      reveal
      class="bg-primary text-white"
    >
      <q-toolbar>
        <q-avatar
          size="100px"
          style="border-radius: 50%; border-color: aqua; border: 1px solid"
        >
          <q-img
            src="../assets/invo.webp"
            spinner-color="primary"
            spinner-size="82px"
          />
        </q-avatar>
        <q-toolbar-title
          style="border: double re"
          class="col-4"
        >
          <span
            class="q-mt-xl"
            style="font-size: 30px"
          > TILTE TYPING</span>
        </q-toolbar-title>

        <q-space />
        <q-btn
          v-if="!$route.meta.multiplayer"
          dense
          unelevated
          outline
          color="gold"
          :label="hostlabel"
          to="/multiplayer"
        />
        <!-- <q-separator class="q-my-lg" spaced vertical dark />
        <q-btn
          v-if="$route.meta.multiplayer"
          :loading="joinloadingflag"
          push
          class="q-mr-lg"
          color="red"
          label="JOIN"
          @click="join"
        /> -->
      </q-toolbar>
    </q-header>

    <q-page-container style="height: 100%; white-space: nowrap; overflow: hidden">
      <router-view
        ref="pageref"
        :playerid="p1"
        :username="username"
      />
      <q-dialog
        v-model="dialogflag"
        persistent
      >
        <q-card>
          <q-card-section style="font-size: 24px; font-weight: 500; height: 50px">
            {{ ign }}{{ suffix }}
          </q-card-section>
          <q-card-section class="q-mt-md">
            <q-input
              @focus="$event.target.select()"
              autofocus
              outlined
              dense
              v-model="ign"
              type="text"
            />
          </q-card-section>
          <q-card-actions
            vertical
            align="center"
          >
            <q-btn
              v-close-popup
              flat
              label="done"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="readysetdialog"
        persistent
      >
        <q-card
          class="flex flex-center"
          style="
            font-size: 30px;
            font-weight: 500;
            width: 60vw;
            min-height: 20%;
          "
        >
          <q-card-section> Starting in.. </q-card-section>
          <q-card-section class="text-center full-width">
            {{ startingin }}
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="resultdialog"
        persistent
      >
        <q-card style="font-size: 30px; font-weight: 700; width: 50vw">
          <q-card-section>
            {{ result }}
          </q-card-section>
          <!-- <q-card-section> {{yourname}}: <span v-if="myscore">{{ myscore }}</span> <span  v-else> Calculating..</span>  (you)</q-card-section>
          <q-card-section> {{oppname}}: <span v-if="oppscore">{{ oppscore }} </span> <span v-else> Calculating..</span> </q-card-section> -->

          <q-card-section>
            <div v-if="yourname">{{ yourname }}: {{ myscore }} WPM (YOU)</div>
            <div v-else>Calculating..</div>
          </q-card-section>
          <q-card-section style="q-mt-sm">
            <div v-if="oppscore">{{ oppname }}: {{ oppscore }}wpm</div>
          </q-card-section>
          <q-card-actions
            vertical
            align="center"
          >
            <q-btn
              v-close-popup
              flat
              label="close"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useQuasar } from "quasar";
// import {useRouter, useRoute} from 'vue-router'

import { useRoute, useRouter } from "vue-router";

let randno = Math.random();
// console.log(parseInt(randno * 100));
randno = parseInt(randno * 10000);

const suffix = "_0" + randno;
const startingin = ref(3);
const readysetdialog = ref(false);
const timer = ref(15);
const hostlabel = ref("Multiplayer");
const joinloadingflag = ref(false);
const p1 = ref(true);
const dialogflag = ref(false);
const ign = ref("Player");
const username = ref(ign.value + suffix);
const resultdialog = ref(false);
const myscore = ref(null);
const oppscore = ref(null);
const yourname = ref(null);
const oppname = ref(null);
const result = ref(null);
var hostdata = {
  hosted: false,
  joined: false,
  started: false,
};
var searchinterval,
  counter = 0;

// console.log($route.meta.multiplayer)
export default {
  setup() {
    const pageref = ref(null);
    const route = useRoute();
    const $router = useRouter();

    // if (route.meta.multiplayer) dialogflag.value = true;
    return {
      pageref,
      dialogflag,
      ign,
      username,
      startingin,
      readysetdialog,
      p1,
      resultdialog,
      timer,
      suffix,
      hostlabel,
      joinloadingflag,
      host,
      join,
      myscore,
      oppscore,
      result,
      yourname,
      oppname,
      pushmultiplayer() {
        $router.push("/multiplayer");
        setTimeout(() => {
          location.reload();
        }, 500);
      },
    };
  },
};

async function host() {
  // updateinfo();
  return;
  hostdata = await gethost();
  if (hostdata.hosted) {
    //game is hosted.. start button was pressed
    if (hostdata.joined) {
      //player has joined the host, start initialized
    } else {
      //player not joined cannot start
    }
  } else if (hostdata.started) {
    //game is started
  }
}
async function join() {
  if (hostdata.started) return;

  // $q.notify('searching')
  hostdata = await gethost();
  // console.log(hostdata);
  if (hostdata.started) {
    //cant game was started
    setTimeout(() => {
      resetfn();
    }, 15000);
    alert("match is going on, please wait for your turn");
    return;
  }
  if (hostdata.hosted) {
    //found a hosted game, you joined the hosted game
    updateinfo("player_2");
    p1.value = false;
    hostdata.joined = true;
    searchfunction("hosted");
    updatehost(hostdata);
  } else {
    //game was not hosted, you hosted a game
    hostdata.hosted = true;
    updateinfo();
    updatehost(hostdata);
    searchfunction();
  }
}

function searchfunction(param) {
  var intrvl = 1000;
  if (param == "hosted") intrvl = 20;
  joinloadingflag.value = true;
  searchinterval = setInterval(async () => {
    counter++;
    if (counter == 10) {
      alert("unable to find match, you may invite your frineds :)");
      // console.log("end");
      clearInterval(searchinterval);
      joinloadingflag.value = false;
      counter = 0;
      hostdata.hosted = false;
      hostdata.joined = false;
      hostdata.started = false;
      updatehost(hostdata);
      // $q.notify('unable to find match')
    } else {
      const hostdata = await gethost();
      if (hostdata.hosted && hostdata.joined) {
        clearInterval(searchinterval);
        // console.log("both ");
        joinloadingflag.value = false;
        hostdata.hosted = true;
        hostdata.started = true;
        hostdata.joined = true;
        updatehost(hostdata);

        readysetdialog.value = true;
        var readyset = setInterval(() => {
          // console.log(startingin.value);
          startingin.value--;
          if (startingin.value < 0) {
            clearInterval(readyset);
            readysetdialog.value = false;
            startingin.value = 3;
            countdown();
          }
        }, 1000);

        //reset everythign after 15 secs
        setTimeout(() => {
          resetfn();
        }, 15000);
      }
    }
    // console.log(counter);
  }, 900);
}

function startfunction() { }

async function updatehost(hostdata) {
  fetch(
    "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/host.json",
    {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify({
        hosted: hostdata.hosted,
        started: hostdata.started,
        joined: hostdata.joined,
      }),
    }
  ).catch((error) => {
    console.log(error);
  });
}

async function gethost() {
  const hostdata = await fetch(
    "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/host.json"
  )
    .then((Response) => Response.json())
    .catch((error) => {
      console.log("gethost catch", error);
    });
  // console.log(hostdata);
  return hostdata;
}
async function updateinfo(player) {
  // if (!name) {
  //   name = "grouse";
  // }
  if (!player) {
    player = "player_1";
  }
  const username = ign.value + suffix;
  // console.log(username);
  // return;
  fetch(
    "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/" +
    player +
    ".json",
    {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify({
        name: username,
        wpm: null,
      }),
    }
  ).catch((error) => {
    console.log(error);
  });
}

function countdown() {
  var intervariable = setInterval(() => {
    timer.value--;
    // console.log(timer.value);
    if (timer.value < 0) {
      // console.log("less than zero");
      timer.value = 15;
      clearInterval(intervariable);
      resultdialog.value = true;
      setTimeout(async () => {
        await getresult();
      }, 1200);
      // console.log("end of less than zero");
    }
  }, 1000);
}

function resetfn() {
  // console.log("reset");
  const resetdata = {
    hosted: false,
    joined: false,
    started: false,
  };
  updatehost(resetdata);
}

async function getresult() {
  // console.log("resultdialog");
  // const xxx  = await fetch(
  //   "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/player_1.json"
  // )
  //   .then((Response) => {
  //     Response.json();
  //   })
  //   .catch((error) => {
  //     console.log("error");
  //   });

  const player1 = await fetch(
    "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/player_1.json"
  )
    .then((Response) => Response.json())
    .catch((error) => {
      console.log("gethost catch", error);
    });

  const player2 = await fetch(
    "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/player_2.json"
  )
    .then((Response) => Response.json())
    .catch((error) => {
      console.log("gethost catch", error);
    });

  // console.log(player1);
  if (p1.value) {
    myscore.value = player1.wpm;
    yourname.value = player1.name;
    oppscore.value = player2.wpm;
    oppname.value = player2.name;
  } else {
    myscore.value = player2.wpm;
    yourname.value = player2.name;
    oppscore.value = player1.wpm;
    oppname.value = player1.name;
  }
}
</script>
