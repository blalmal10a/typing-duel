<template>
  <q-page class="text-center">
    <h5 v-if="wpm < 0">0</h5>
    <h5 v-else>{{ wpm }}</h5>
    <!-- <div class="row full-width">
      <pre v-for="(word, index) in words" :key="index"> {{ word }}  </pre>
    </div> -->
    <div>
      timer: <span v-if="time >= 0">{{ 15-time }}</span> <span v-else>15</span>
    </div>
    <div class="full-width text-center">
      <!-- <h6>{{ words[ind]+ " "+ words[ind+1] }}</h6> -->
      <h6 class="row" style="">
        <!-- <span  v-for="word, index in words" :key="index" >
          <span v-if="index>=ind">{{word}}</span>
           </span> -->
        <div class="col-3 offset-3 text-right q-mr-sm">
          <!-- <span v-for="n in 2" :key="n">
            <span :style="entered[ind-2 + n]==words[ind-2 + n]? 'color: blue' : 'color: red' " v-if="words[ind -2+ n]">
              {{ words[ind - 2 + n] + " " }}
            </span>
          </span> -->

          <span
            :style="
              entered[ind - 2] == words[ind - 2] ? 'color: green' : 'color: red'
            "
            v-if="words[ind - 2]"
          >
            {{ words[ind - 2] + " " }}
          </span>
          <span
            :style="
              entered[ind - 1] == words[ind - 1] ? 'color: green' : 'color: red'
            "
            v-if="words[ind - 1]"
          >
            {{ words[ind - 1] + " " }}
          </span>
        </div>
        <div style="" class="flex-grow q-mr-sm">
          <span v-if="words[ind]" style="color: blue; font-size: 20px">
            {{ words[ind] + " " }}
          </span>
        </div>
        <div class="col-4 text-left">
          <span v-for="n in ind + 3" :key="n">
            <span v-if="n > ind && words[n]">
              {{ " " + words[n] + " " }}
            </span>
          </span>
        </div>
      </h6>
      <div class="col-12">
        <div class="flex flex-center">
          <q-input
            ref="typinginput"
            @keydown.esc="stopper"
            @keyup="timer"
            @keydown.tab="restart"
            autofocus
            style="width: 200px"
            @keydown.space="next"
            outlined
            dense
            :disable="disableflag"
            v-model="text"
            type="text"
            id="typinginput"
          />
          <q-btn
            flat
            round
            color="primary"
            icon="mdi-restart"
            @click="restart"
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="opendialog" persistent>
      <q-card class="q-pa-xl" style="border: double orange">
        <q-card-section class="full-wdith" style="font-size: 28px; color: blue">
          youre typing in
          <span style="color: purple; font-size: 32px">{{ wpm }}</span> words
          per minute.. press enter to close the dialog
        </q-card-section>
        <q-card-actions class="q-mt-md" vertical align="center">
          <q-btn
            autofocus
            unelevated
            outline
            @keydown="restart"
            @click="restart"
            label="close"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-btn color="primary" icon="check" label="get" @click="download" />
    <q-btn color="primary" icon="check" label="upload" @click="upload" /> -->
  </q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { confirmPasswordReset } from "@firebase/auth";

var el;
export default {
  setup() {
    const disableflag = ref(false);
    const wpm = ref(0);
    const mywatch = ref(null);
    // const mymanager = ref(null);
    const router = useRouter();
    const ind = ref(0);
    const time = ref(-1);
    const newinput = ref(false);
    const text = ref(null);
    const entered = ref([]);
    const characters = ref(0);
    const url =
      "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/grouse.json";

    return {
      time,
      text,
      wpm,
      words,
      characters,
      ind,
      disableflag,
      entered,
      shown: ref(false),
      opendialog: ref(false),
    };
  },
  methods: {
    timer() {
      if (this.time < 0) {
        this.manager();
        this.time = 0;
        this.mywatch = setInterval(() => {
          console.log(this.time);
          this.time++;
        }, 1000);
      } else {
        return;
      }
    },
    restart(e) {
      if(!this.shown) return
      this.opendialog = false;
      this.disableflag = false;
      // const el = document.getElementById('typinginput')

      this.$refs.typinginput.blur();
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.typinginput.focus();
        }, 500);
      });
      console.log("element", el);
      e.preventDefault();
      console.log("restart");
      this.ind = 0;
      this.entered = [];
      clearInterval(this.mywatch);
      clearInterval(this.mymanager);
      this.time = -1;
      this.wpm = 0;
      this.characters = 0;
      this.text = null;
      // router.go();
    },
    manager() {
      this.mymanager = setInterval(() => {
        if (this.time == 15) {
          console.log("ended");
          stopper();
          this.opendialog = true;
        } else {
          this.wpm = parseInt((this.characters * 60) / (4 * this.time));
          if (this.newinput) {
            console.log("upload");

            try {
              axios.put(
                this.url,
                JSON.stringify({
                  name: "grouse",
                  wpm: this.wpm,
                })
              );
            } catch (error) {
              console.log(error);
            }
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
      if (words[this.ind] == this.entered[this.ind]) {
        this.characters += words[this.ind].length;
        if (this.time < 1) this.time = 1;
      }
      this.ind++;
      if (!words[this.ind] || this.time==15) {
        console.log("done");
        this.stopper();
        this.opendialog = true;
        setTimeout(() => {
          this.shown = true
        }, 1500);
      }
      this.newinput = true;
    },
    stopper() {
      this.disableflag = true;
      clearInterval(this.mywatch);
      clearInterval(this.mymanager);
    },
  },
};

const words = [
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
</script>
