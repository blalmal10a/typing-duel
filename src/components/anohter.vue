<template>
  <q-page class="text-center">
    <h5>{{ wpm }}</h5>
    <!-- <div class="row full-width">
      <pre v-for="(word, index) in words" :key="index"> {{ word }}  </pre>
    </div> -->
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
          <span style="color: blue; font-size: 20px">
            {{ words[ind] + " " }}
          </span>
        </div>
        <div class="col-4 text-left">
          <span v-for="n in ind + 3" :key="n">
            <span v-if="n > ind">
              {{ " " + words[n] + " " }}
            </span>
          </span>
        </div>
      </h6>
      <div class="col-12">
        <div class="flex flex-center">
          <q-input
            @blur="blurfn"
            @keydown.esc="stopper"
            @keyup="timer"
            @keydown.tab="restart"
            autofocus
            style="width: 200px"
            @keydown.space="next"
            outlined
            dense
            v-model="text"
            type="text"
            id="typinginput"
          />
          <!-- <q-btn
            flat
            round
            color="primary"
            icon="mdi-restart"
            @click="restart"
          /> -->
        </div>
      </div>
    </div>

    <!-- <q-btn color="primary" icon="check" label="get" @click="download" />
    <q-btn color="primary" icon="check" label="upload" @click="upload" /> -->
  </q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { confirmPasswordReset } from "@firebase/auth";

export default {
  setup() {
    const wpm = ref(0);
    const mywatch = ref(null);
    const mymanager = ref(null);
    const router = useRouter();
    const ind = ref(0);
    const time = ref(-1);
    const text = ref(null);
    const entered = ref([]);
    const characters = ref(0);
    const url =
      "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/sadge.json";

    function manager() {
      mymanager.value = setInterval(() => {
        if (time.value == 15) {
          console.log("ended");
          stopper();
          setTimeout(() => {
            time.value = -1;
          }, 1000);
        } else {
          console.log('else')
          wpm.value = parseInt((characters.value * 60) / (4 * time.value));
          try {
            axios.put(
              url,
              JSON.stringify({
                name: "sadge",
                wpm: wpm.value,
              })
            );
            console.log("uploaded");
          } catch (error) {
            console.log(error);
          }
        }
      }, 1000);
    }
    return {
      time,
      text,
      wpm,
      words,
      characters,
      ind,
      entered,
      async upload() {
        // try {
        //   const response = await fetch(url, {
        //     method: 'PUT',
        //     mode: 'cors',
        //     cache: 'no-cache',
        //     body: JSON.stringify(['ASDF', '22','FFFF', 2, 3,1234])
        //   }
        //   )
        //   console.log(response.json())

        // } catch (error) {

        // }
        try {
          const mydata = ["kkkk", "hehe", 12];
          axios.put(
            url,
            JSON.stringify(["what the fuck", "ASDF", "22", "FFFF", 2, 3, 1234])
          );
        } catch (error) {
          console.log(error);
        }
      },
      next(ev) {
        ev.preventDefault();
        if (!text.value) return;
        entered.value.push(text.value);

        text.value = null;
        if (words[ind.value] == entered.value[ind.value]) {
          characters.value += words[ind.value].length;
          if (time.value < 1) time.value = 1;
          // wpm.value = parseInt((characters.value * 60) / (4 * time.value));

          // try {
          //   axios.put(
          //     url,
          //     JSON.stringify({
          //       name: "grouse",
          //       wpm: wpm.value,
          //     })
          //   );
          //   console.log('uploaded')
          // } catch (error) {
          //   console.log(error);
          // }
        }

        ind.value++;
      },
      blurfn() {
        time.value = -1;
        console.log(time.value);
      },
      restart(e) {
        // console.log("hehe");
        // router.push('/test')
        e.preventDefault();

        router.go();

        // window.setTimeout(() => {element.focus()
        // console.log('aaa')}, 1);
      },
      timer() {
        if (time.value < 0) {
          manager();
          time.value = 0;
          mywatch.value = setInterval(() => {
            console.log(time.value);
            time.value++;
          }, 1000);
        } else {
          return;
        }
      },
      manager,
      stopper() {
        clearInterval(mywatch.value);
      },
      async download() {
        // try {
        //   fetch(
        //     "https://tilte-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/tie.json"
        //   )
        //     .then((response) => response.json())
        //     .then((data) => console.log(data));
        // } catch (error) {
        //   console.log(error);
        // }
        try {
          const res = await axios.get(url);
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      },
    };
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

function timerfun() {
  console.log("call timer fun");
  time.value++;
  console.log(time.value);
}
</script>
