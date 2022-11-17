<template>
  <nav class="navbar is-fixed-top">
    <div id="navbarBasicExample" class="navbar-menu bar">
      <div class="navbar-start">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-dark is-small" @click="showDiv()" style="left: 10vw">
              <strong>+</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <br>
  <div class="box position" style="height: 93vh; width: 40vw; right: -38vw; z-index: 2" v-show="showDialogue">
    <button class="button is-light is-small" style="right: -33vw" v-on:click="showDialogue = false">X</button>

    <h1 class="title block">Eintrag erstellen</h1>
    <br>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label" style="text-align: left">Typ</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <label class="radio">
              <input type="radio" name="member" v-model="newEventIsPeriod" value="period" checked>
              Zeitraum
            </label>
            <label class="radio">
              <input type="radio" name="member" v-model="newEventIsPeriod" value="point">
              Zeitpunkt
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Datum</label>
      </div>
      <div class="field-body">
        <input type="month">
        <input type="month" v-show="newEventIsPeriod == 'period'">
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Dimension</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth">
              <select >
                <option v-for="value in dimensionOptions" :key="value">
                  {{ value }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Titel</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
                class="input"
                type="text"
                placeholder="Anzeigename des Events"
                id="eventNameId">
                <!-- v-model="eventTitle">class: is danger -->
          </div>
          <!--
          <p class="help is-danger">
            Bitte beschreibe das Event
          </p>
          -->
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Notizen</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea class="textarea" placeholder="Notizen zum Event" id="noteId"></textarea>
          </div>
        </div>
      </div>
    </div>
    <br>
    <button class="button is-white" style="margin-right: 1vw; right: -20vw" v-on:click="showDialogue = false; test">Abbrechen</button>
    <button class="button is-link is-light" style="right: -20vw" v-on:click="addEvent">Fertig</button>
  </div>
<table>
  <thead>
  <tr class="year_age">
    <td class="content">
      <p>
        Jahr
      </p>
      <p class="subcontent">
        Alter
      </p>
    </td>
    <td class="year-wrap">
      <div v-for="(year, index) in years" class="year">
        <p>
          {{year}}
        </p>
        <p class="subcontent">
          {{index}}
        </p>
      </div>
    </td>
  </tr>
  </thead>
  <tbody >
  <tr v-for="value in dimensionOptions" :key="value">
    <td class="content">
      <div>
        <font-awesome-icon icon="family" />
        {{ value }}
      </div>
    </td>
    <td>
      <div>
        <div v-if="value == 'Familie'" class="period" style="margin-left: 135px">
          <p>
            Scheidung der Eltern
          </p>
          <p class="subcontent">
            Mutter hat Sorgerecht
          </p>
        </div>
        <div v-if="value == 'Gesundheit'" class="event" style="margin-left: 335px">
          <p>
            Mandel-OP
          </p>
          <p class="subcontent">
            Dez 2001
          </p>
        </div>
      </div>
    </td>
  </tr>
  <!--
  <tr>
      <td class="content">
        <div>
          <font-awesome-icon icon="family" />
        Familie
        </div>
      </td>
      <td>
        <div>
          <div>
            Blubb
          </div>
          <div>
            Hi
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="content">
        <div>
        Wohnen
        </div>
      </td>
      <td>
        <div>
          <div class="event">
            <p>
              Delogierung
            </p>
            <p class="subcontent">
              Jänner 2000
            </p>
          </div>
          <div class="period" style="margin-left: 135px">
            <p>
              Wohnung der Mutter
            </p>
            <p class="subcontent">
              Zweimal
            </p>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="content">
        <div>
        Bildung
        </div>
      </td>
      <td>
        <div>
          Blubb
        </div>
      </td>
    </tr>
    <tr>
      <td class="content">
        <div>
          Arbeit
        </div>
      </td>
      <td>
        <div>
          Blubb
        </div>
      </td>
    </tr>
    -->
  </tbody>
</table>
</template>

<script lang="ts">
import {computed, ref} from "vue";
import { useStore } from "vuex";
import { initEvent } from "@/data/ZBEvent";
import { Dimension } from "@/data/Dimension";

const store = useStore();

export default {
  name: "TimeGraph",
  props: {
    event: {
      type: Object,
      required: true,
    }
  },
  setup() {
    const dimensionOptions = ref(Dimension);
    //const eventTitle = ref(store.state.data.events.description);

    return {
      dimensionOptions,
      //eventTitle,
    }
  },
  data(){
    return {
      years: [2000, 2001, 2002, 2003, 2004, 2005],
      showDialogue: false,
      newEventIsPeriod: 'period',
    }
  },
  methods: {
    showDiv() {
      this.showDialogue = true; //Code works - how to fix error?
    },
    addEvent(){
      let newEvent = initEvent();
      newEvent.dimensionId = 0;
      newEvent.description = '';
      newEvent.notes = '';
      newEvent.isInterval = true; //this.newEventIsPeriod == 'period' ? true : false;
      store.commit("data/addEvent", newEvent)
      console.log(newEvent.dimensionId, newEvent.description, newEvent.notes, newEvent.isInterval)
    }
  }
}
</script>

<style scoped lang="scss">
table {
  //border-collapse: collapse;
  border-spacing: 0;
  width: 100vw;
  height: 93vh;
  display: table;
  margin-top: 1vh;
  margin-left: -6vh;
}

td {
  text-align: center;
  padding: 8px;
}

tr:nth-child(odd){background-color: $gridgrey}
thead > tr{background-color: white !important;}

.year{
  padding: 0 10px;
}
.year:nth-child(1){padding-left: 0px}

.year-wrap{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: center;
}
.year_age{
  border-bottom: 0.5px solid lightgrey;
}
.content{
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}
.event{
  display: block;
  background-color: $eventgrey;
  border-left: 3px solid $eventgreen;
  width: 10%;
  margin: 5px 0;
  border-radius: 3px;
}
.period{
  display: block;
  background-color: $periodblue;
  border: 2px solid $periodborderblue;
  width: 15%;
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
}
.subcontent{
  color: darkgrey;
}
.event_dialogue{
  background-color: white;
  z-index: 2;
  width: 500px;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bar{
  background-color: #181818;
  width: 100vw;
  height: 5.25vh;
  left: -3vw;
  top: -0.5vh;
}
</style>