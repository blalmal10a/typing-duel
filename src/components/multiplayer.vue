<template>
  <q-page
    class="text-center container bg-grey-10 q-pt-xl"
    style="max-height: 100vh; white-space: nowrap; overflow: hidden"
  >
    <div
      class="row"
      v-if="!showResult"
    >
      <div class="col-xs-10 offset-xs-1 col-sm-4 offset-sm-4">
        <q-toolbar class="text-white">
          <div>
            timer: <span v-if="timer >= 0">{{ 15 - timer }}</span>
            <span v-else>15</span>
          </div>
          <q-space />
          <q-toolbar-title class="text-right">
            <span v-if="wpm || wpm == 0"> {{ wpm }} WPM</span>
            <span v-else>calculating...</span>
          </q-toolbar-title>
        </q-toolbar>
      </div>
    </div>

    <span
      v-if="!showResult"
      class="row"
      style="font-size: 20px; height: 50px; white-space: nowrap"
    >
      <span
        class="wordDisplay col-xs-2 col-md-2 text-right q-pr-sm offset-md-3 q-ml-xl"
        style="direction: rtl; white-space: nowrap"
      >
        <span
          class="wordDisplay"
          :style="entered[ind - 2] == words[ind - 2]
            ? 'color:lightgreen '
            : 'color: red'
            "
          v-if="words[ind - 2]"
        >
          {{ words[ind - 2] + " " }}
        </span>
        <span
          class="wordDisplay"
          :style="entered[ind - 1] == words[ind - 1]
            ? 'color: lightgreen'
            : 'color: red'
            "
          v-if="words[ind - 1]"
        >
          {{ words[ind - 1] + " " }}
        </span>
      </span>
      <span
        style=""
        class="wordDisplay col-shrink q-pr-sm"
      >
        <span
          v-if="words[ind]"
          style=" ;"
        >
          {{ words[ind] + " " }}
        </span>
      </span>
      <span
        class="wordDisplay col-xs-1 col-md-2 text-left"
        style="white-space: nowrap"
      >
        <span
          v-for="n in ind + 5"
          :key="n"
        >
          <span
            v-if="n > ind && words[n]"
            :style="n == ind + 1 ? ' ; font-weight:200' : 'font-weight:200'"
          >
            {{ " " + words[n] + " " }}
          </span>
        </span>
      </span>
    </span>

    <span
      v-else
      class="text-white"
      style="font-size: 30px"
    >
      <span v-if="resultReady">
        <div>{{ username }}: {{ wpm }} WPM (you)</div>
        <div>{{ another }}: {{ awpm }} WPM</div>
      </span>

      <span v-else>Loading{{ place }} </span>
    </span>

    <div class="col-12 q-mt-md">
      <div class="flex flex-center">
        <q-input
          v-if="!showResult"
          @keydown="keyinput"
          dark
          input-class="q-pa-md"
          input-style=" font-size: 25px;caret-color: transparent; cursor:default; user-select: none"
          borderless
          :placeholder="place"
          ref="typinginput"
          @keydown.space="next"
          autofocus
          @blur="focusfn"
          style="width: 200px"
          dense
          v-model="text"
          type="text"
          id="typinginput"
        />
      </div>
    </div>
    <q-btn
      v-if="showResult"
      class="q-mt-md"
      flat
      color="grey"
      icon="mdi-backburger"
      icon-right="assignment"
      label="MENU"
      @click="close_result"
    />

    <q-dialog
      full-width
      v-model="menu"
      position="top"
      persistent
    >
      <q-card
        v-if="!readysetdialog"
        style="margin-left: 20%; margin-right: 20%;  margin-top: 150px; border-radius: 10px; border: double grey"
        class="bg-grey-10 text-white q-py-xl"
      >
        <q-card-section
          style="font-size: 35px"
          class="flex flex-center full-width"
        >
          Are you ready to duel?
        </q-card-section>
        <q-card-section class="q-mt-md flex flex-center full-width">
          <q-input
            dark
            outlined
            input-class="q-pa-md"
            input-style=" font-size: 25px; cursor:default; user-select: none"
            borderless
            @blur="focusfn"
            placeholder="Enter your name"
            ref="typinginput"
            autofocus
            color="white"
            style="width: 30vw"
            @keyup.enter="join"
            v-model="username"
            pre
            type="text"
          />
        </q-card-section>
        <q-card-section class=" text-center full-width">
          <q-btn
            :loading="joinloadingflag"
            style="width: 30vw"
            color="grey"
            icon="mdi-connection"
            label="JOIN A MULTIPLAYER GAME"
            @click="join"
          />
        </q-card-section>
        <q-card-section class="q-pb-xl  text-center full-width">
          <q-btn
            style="width: 30vw"
            color="grey-6"
            icon="mdi-emoticon-sad-outline"
            label="SINGLE PLAYER MODE"
            to="/"
          />
        </q-card-section>
      </q-card>

      <q-card
        v-else
        style="
          font-size: 200px;
          font-weight: 200;
          margin-top: 150px;
          padding: 100px;
          border-radius: 10px;
          border: double grey;
        "
        class="text-center q-mx-xl bg-grey-10 text-white"
      >
        {{ startingin }}
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from "vue";

var hostdata = {
  hosted: false,
  joined: false,
  started: false,
};
var p1 = true;
var temp;
var total = 0;
var timecounter;
const menu = ref(true);

const username = ref(null);
const another = ref(null);
const awpm = ref(null);
const typinginput = ref(null);
const joinloadingflag = ref(false);
const readysetdialog = ref(false);
const startingin = ref(5);

const words = ref(null);
const ind = ref(0);
const entered = ref([]);

const text = ref(null);
const wpm = ref(0);
const place = ref("...");
const startflag = ref(false);
const showResult = ref(false);
const resultReady = ref(false);
const timer = ref(0);

export default {
  setup() {
    words.value = temp;

    shuffle(words.value);
    return {
      startingin,
      menu,
      username,
      another,
      awpm,
      join,
      joinloadingflag,
      hostdata,
      updatehost,
      resetfn,
      gethost,
      updateinfo,
      searchfunction,
      readysetdialog,
      keyinput,
      words,
      typinginput,
      entered,
      ind,
      place,
      startflag,
      getopponent,
      showResult,
      resultReady,
      text,
      total,
      timer,
      wpm,
      next,
      reset,
      start,
      close_result,
      shuffle,
      focusfn,
    };
  },
};

async function join() {
  if (!username.value) {
    username.value = "player";
  }
  const servercheck = await gethost();
  if (!servercheck) {
    resetfn();
  } else {
    hostdata = servercheck;
  }
  if (servercheck.startflag) {
    //cant game was started
    setTimeout(() => {
      resetfn();
    }, 15000);

    alert("match is going on, please wait for your turn");
    return;
  }

  if (servercheck.hosted) {
    //found a hosted game, you joined the hosted game
    hostdata.joined = true;
    updatehost(hostdata);
    updateinfo("player_2");
    p1 = false;
    await searchfunction("hosted");
  } else {
    //game was not hosted, you hosted a game
    p1 = true;
    hostdata.hosted = true;
    updateinfo();
    updatehost(hostdata);
    searchfunction();
  }
}

async function searchfunction(param) {
  var counter = 0;
  var intrvl = 1000;
  if (param == "hosted") intrvl = 20;
  joinloadingflag.value = true;
  var searchinterval = setInterval(async () => {
    counter++;
    if (counter == 10) {
      alert("unable to find match, you may invite your frineds :)");
      clearInterval(searchinterval);
      joinloadingflag.value = false;
      counter = 0;
      resetfn();
    } else {
      const hostdata = await gethost();
      if (hostdata.hosted && hostdata.joined) {
        clearInterval(searchinterval);
        joinloadingflag.value = false;
        hostdata.hosted = true;
        hostdata.started = true;
        hostdata.joined = true;
        await updatehost(hostdata);
        console.log(hostdata);

        readysetdialog.value = true;
        var readyset = setInterval(() => {
          startingin.value--;
          if (startingin.value < 0) {
            clearInterval(readyset);
            readysetdialog.value = false;
            startingin.value = 3;
            menu.value = false;
            showResult.value = false;
            start();
            console.log("started");
          }
        }, 1000);
        setTimeout(() => {
          resetfn();
        }, 15000);
      }
    }
  }, 900);
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
function resetfn() {
  // console.log("reset");
  const resetdata = {
    hosted: false,
    joined: false,
    started: false,
  };
  updatehost(resetdata);
  // shuffle(words.value);
}

async function updateinfo(player) {
  // if (!name) {
  //   name = "grouse";
  // }
  if (!player) {
    player = "player_1";
  }
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
        name: username.value,
        wpm: wpm.value,
      }),
    }
  ).catch((error) => {
    console.log(error);
  });
}
async function getopponent(seat) {
  const opponent = await fetch(
    "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/" +
    seat +
    ".json"
  )
    .then((Response) => Response.json())
    .catch((error) => {
      console.log("gethost catch", error);
    });
  console.log(opponent);
  return opponent;
}

function start() {
  startflag.value = true;
  setTimeout(() => {
    typinginput.value.focus();
  }, 300);

  timecounter = setInterval(async () => {

    if (!startflag.value) return;
    if (timer.value == 15) {
      showResult.value = true;
      clearInterval(timecounter);
      reset();
      var player = "player_2";
      var other = "player_1";
      if (p1) {
        player = "player_1";
        other = "player_2";
      }
      await updateinfo(other);

      setTimeout(async () => {
        const res = await getopponent(player);
        another.value = res.name;
        awpm.value = res.wpm;
        resultReady.value = true;
        if (!res.wpm) {
          awpm.value = "ERROR LOADING";
        }
      }, 1500);
    }
    if (startflag.value) {
      timer.value++;
    }
  }, 1000);
}

function focusfn() {
  typinginput.value.focus();
}

function keyinput(ev) {
  if (!startflag.value) {
    // ev.preventDefault();
  }
}

function next(e) {
  e.preventDefault();


  if (!text.value) return;
  ind.value++;
  if (words.value[ind.value - 1] == text.value) {
    total += text.value.length;
  }

  entered.value.push(text.value);

  if (total)
    wpm.value = parseInt((total / 5) / (timer.value / 60))
  else wpm.value = 0;

  text.value = null;
}

function close_result() {
  menu.value = true;
  showResult.value = false;
  reset();
}

function reset() {
  clearInterval(timecounter);
  ind.value = 0;
  entered.value = [];
  text.value = null;
  startflag.value = false;
  timer.value = 0;
  shuffle(words.value);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

temp = [
  "code",
  "alcohol",
  "control",
  "chip",
  "nomination",
  "kidnap",
  "vacuum",
  "holiday",
  "cheque",
  "context",
  "nationalist",
  "offer",
  "herb",
  "layout",
  "climb",
  "harbor",
  "consider",
  "ambiguity",
  "gossip",
  "inside",
  "veil",
  "wrist",
  "turn",
  "guerrilla",
  "marketing",
  "biology",
  "topple",
  "population",
  "operation",
  "tin",
  "joke",
  "pioneer",
  "sum",
  "standard",
  "hate",
  "tie",
  "seal",
  "summer",
  "suffering",
  "franchise",
  "likely",
  "blow",
  "arrest",
  "spring",
  "default",
  "thaw",
  "gap",
  "brick",
  "reinforce",
  "inspire",
];

setInterval(() => {
  place.value = place.value + ".";
  if (place.value == "....") place.value = "";
}, 500);
</script>

<style>
.wordDisplay {
  color: antiquewhite;
  /* color: ; */
}
</style>
