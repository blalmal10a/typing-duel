<template>
  <!-- <q-page class="text-center"> -->
  <div
    class="text-center container bg-grey-10 q-pt-xl"
    style="max-height: 100vh; white-space: nowrap; overflow: hidden"
  >
    <div class="row">
      <div class="col-xs-10 offset-xs-1 col-sm-4 offset-sm-4">
        <q-toolbar class="text-white">
          <!-- <div>
            timer: <span v-if="time >= 0">{{ 15 - time }}</span>
            <span v-else>15</span>
          </div> -->
          <q-space />
          <q-toolbar-title class="text-right">
            <!-- <span v-if="wpm || wpm == 0"> {{ wpm }} WPM</span>
            <span v-else>calculating...</span> -->
          </q-toolbar-title>
        </q-toolbar>
      </div>
    </div>
    <!-- <h5 v-if="wpm < 0">0</h5>
    <h5 v-else>{{ wpm }}</h5> -->
    <!-- <div class="row full-width">
      <pre v-for="(word, index) in words" :key="index"> {{ word }}  </pre>
    </div> -->
    <div
      class="full-width text-center"
      :style="
        $q.platform.has.touch
          ? ' margin-top: 20px; white-space:nowrap'
          : ' margin-top: 50px;  font-size: 20px; white-space: nowrap'
      "
    >
      <!-- <h6>{{ words[ind]+ " "+ words[ind+1] }}</h6> -->
      <span v-if="!opendialog" class="row" style="white-space: nowrap">
        <!-- <span  v-for="word, index in words" :key="index" >
          <span v-if="index>=ind">{{word}}</span>
           </span> -->
        <span
          class="wordDisplay col-xs-2 col-md-2 text-right q-pr-sm offset-md-3 q-ml-xl"
          style="direction: rtl; white-space: nowrap"
        >
          <!-- <span v-for="n in 2" :key="n">
            <span :style="entered[ind-2 + n]==words[ind-2 + n]? 'color: blue' : 'color: red' " v-if="words[ind -2+ n]">
              {{ words[ind - 2 + n] + " " }}
            </span>
          </span> -->

          <span
            class="wordDisplay"
            :style="
              entered[ind - 2] == words[ind - 2]
                ? 'color:lightgreen '
                : 'color: red'
            "
            v-if="words[ind - 2]"
          >
            {{ words[ind - 2] + " " }}
          </span>
          <span
            class="wordDisplay"
            :style="
              entered[ind - 1] == words[ind - 1]
                ? 'color: lightgreen'
                : 'color: red'
            "
            v-if="words[ind - 1]"
          >
            {{ words[ind - 1] + " " }}
          </span>
        </span>
        <span style="" class="wordDisplay col-shrink q-pr-sm">
          <span v-if="words[ind]" style=" ;">
            {{ words[ind] + " " }}
          </span>
        </span>
        <span
          class="wordDisplay col-xs-1 col-md-2 text-left"
          style="white-space: nowrap"
        >
          <span v-for="n in ind + 5" :key="n">
            <span
              v-if="n > ind && words[n]"
              :style="n == ind + 1 ? ' ; font-weight:200' : 'font-weight:200'"
            >
              {{ " " + words[n] + " " }}
            </span>
          </span>
        </span>
      </span>
      <span v-else class="text-white">
        <!-- <h5>{{ wpm }} WPM</h5> -->
      </span>
      <div class="col-12 q-mt-md">
        <div class="flex flex-center">
          <q-input
            v-if="!opendialog"
            dark
            input-class="q-pa-md"
            input-style=" font-size: 25px;caret-color: transparent; cursor:default; user-select: none"
            borderless
            placeholder="..."
            ref="typinginput"
            @focus="onfocus"
            @keyup="timer"
            @keydown.esc="stopper"
            @keydown.tab="restart"
            @keydown.space="next"
            @blur="focusfn"
            autofocus
            style="width: 200px"
            dense
            :disable="disableflag"
            v-model="text"
            type="text"
            id="typinginput"
          />
          <q-btn
            @blur="btnfocus"
            ref="replay"
            v-if="opendialog"
            flat
            round
            color="white"
            icon="mdi-restart"
            @click="hideresult"
          />
          <q-btn
            v-else
            flat
            round
            color="white"
            icon="mdi-restart"
            @click="restart"
          />
        </div>
      </div>
    </div>
    <!-- <q-dialog v-model="opendialog" persistent>
      <q-card class="q-pa-xl" style="border: double orange">
        <q-card-section class="full-wdith" style="font-size: 28px; color: blue">
          youre typing in
          <span style="color: purple; font-size: 32px">{{ wpm }}</span> words
          per minute.. press enter to close the dialog
        </q-card-section>
        <q-card-actions class="q-mt-md" vertical align="center">
          <q-btn
            unelevated
            outline
            @keydown="restart"
            @click="restart"
            label="close"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </div>

  <!-- <q-btn color="primary" icon="check" label="get" @click="download" />
    <q-btn color="primary" icon="check" label="upload" @click="upload" /> -->
  <!-- </q-page> -->
</template>

<script>
import axios from "axios";
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

var el;

export default {
  props: ["username", "playerid"],

  setup(props) {
    const route = useRoute();
    // console.log(props.playerid);
    const propstest = ref("props.test");
    const $q = useQuasar();
    const disableflag = ref(false);
    const wpm = ref(0);
    const mywatch = ref(null);
    // const mymanager = ref(null);
    const typinginput = ref(null);
    const ind = ref(0);
    const time = ref(-1);
    const newinput = ref(false);
    const text = ref(null);
    const entered = ref([]);
    const characters = ref(0);
    const opendialog = ref(false);
    const replay = ref(null);
    const SERVER_URL = ref(
      "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/grouse.json"
    );
    const words = ref([
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
    ]);

    function printer() {
      console.log(props.playerid);
    }
    shuffle(words.value);
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

    watch(propstest, (newvalue, oldvalue) => {
      console.log("propstest");
      console.log(propstest.value);
    });

    onMounted(() => {});

    return {
      printer,
      propstest,
      time,
      text,
      wpm,
      words,
      typinginput,
      characters,
      ind,
      disableflag,
      entered,
      shown: ref(false),
      opendialog,
      replay,
      hideresult(e) {
        disableflag.value = false;
        opendialog.value = false;
        shuffle(words.value);
        e.preventDefault();
        ind.value = -1;
        entered.value = [];
      },
      btnfocus(ev) {
        // replay.value.focus()
      },
    };
  },
  methods: {
    onfocus() {
      if (this.ind == -1) {
        this.restart();
      }
    },
    timer(ev) {
      const charCode = ev.which;

      if (charCode < 64 || charCode > 91) {
        ev.preventDefault();
        return;
      }

      if (this.time < 0) {
        this.manager();
        this.time = 0;
        this.mywatch = setInterval(() => {
          this.time++;
        }, 1000);
      } else {
        return;
      }
    },
    focusfn() {
      this.$refs.typinginput.focus();
    },
    restart(e) {
      return;
      this.shuffle(this.words);
      if (e) e.preventDefault();
      // this.$refs.typinginput.blur();
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     this.$refs.typinginput.focus();
      //   }, 20);
      // });

      this.opendialog = false;
      this.disableflag = false;
      this.ind = 0;
      this.entered = [];
      clearInterval(this.mywatch);
      clearInterval(this.mymanager);
      this.time = -1;
      this.characters = 0;
      this.text = null;
      this.opendialog = false;
      this.wpm = 0;
    },
    manager() {
      console.log(this.playerid);
      this.mymanager = setInterval(() => {
        if (this.time == 15) {
          this.stopper();
          this.opendialog = true;
        } else {
          this.wpm = parseInt((this.characters * 60) / (4 * this.time));
          if (this.newinput) {
            try {
              var player;
              if (this.playerid) {
                player = "player_1";
              } else {
                player = "player_2";
              }
              fetch(
                "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/" +
                  player +
                  ".json",
                {
                  method: "PATCH",
                  mode: "cors",
                  cache: "no-cache",
                  body: JSON.stringify({
                    wpm: this.wpm,
                  }),
                }
              );
            } catch (error) {
              console.log(error);
            }
            // try {
            //   axios.put(
            //     this.url,
            //     JSON.stringify({
            //       name: "grouse",
            //       wpm: this.wpm,
            //     })
            //   );
            // } catch (error) {
            //   console.log(error);
            // }
            this.newinput = false;
          }
        }
      }, 1000);
    },

    next(ev) {
      ev.preventDefault();
      if (!this.text) return;
      this.entered.push(this.text);
      this.text = null;
      if (this.words[this.ind] == this.entered[this.ind]) {
        this.characters += this.words[this.ind].length;
        if (this.time < 1) this.time = 1;
      }
      this.ind++;
      if (!this.words[this.ind] || this.time == 15) {
        this.disableflag = true;
        this.stopper();
        this.opendialog = true;
        setTimeout(() => {
          this.shown = true;
        }, 3000);

        try {
          fetch(
            "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/player_1.json",
            {
              method: "PUT",
              mode: "cors",
              cache: "no-cache",
              body: JSON.stringify({
                wpm: this.wpm,
              }),
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      this.newinput = true;
    },
    stopper() {
      this.disableflag = true;
      clearInterval(this.mywatch);
      clearInterval(this.mymanager);
    },
    shuffle(array) {
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

      // return array;
    },
  },
};

// function test() {
//   restart()
// }
</script>

<style scoped>
.wordDisplay {
  color: antiquewhite;
  /* color: ; */
}

::selection {
  color: rgba(255, 255, 255, 1);
}
</style>

<style lang="sass" scoped>

.container
  border: 20px solid $grey-10
</style>
