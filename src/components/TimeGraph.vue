<template>
  <PersonDialogue v-show="showCreateBiograph" @close="closePerson" />
  <nav class="navbar is-fixed-top" v-show="!showCreateBiograph">
    <div id="navbarBasicExample" class="navbar-menu bar">
      <div class="navbar-start">
        <div class="navbar-item">
          <div class="buttons">
            <a
              class="button is-dark is-small"
              @click="showDiv()"
              style="left: 10vw"
            >
              <strong>+</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav >
  <br />

  <DeleteEditDialogue v-show="showEditDialogue" @close="closeEditDiv" :selectedEvent="clickedEvent" @reload="loadEvents"/>
  <div
    class="box position"
    id="box"
    style="height: 93vh; width: 40vw; z-index: 2"
    v-show="showDialogue"
  >
    <button
      class="button is-light is-small"
      style="right: -33vw"
      v-on:click="showDialogue = false"
    >
      X
    </button>

    <h1 class="title block">Eintrag erstellen</h1>
    <br />
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label" style="text-align: left">Typ</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <label class="radio">
              <input
                type="radio"
                name="member"
                v-model="newEventDetails.newEventIsPeriod"
                value="period"
                checked
              />
              Zeitraum
            </label>
            <label class="radio">
              <input
                type="radio"
                name="member"
                v-model="newEventDetails.newEventIsPeriod"
                value="point"
              />
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
        <input type="month" v-model="newEventDetails.startDate" />
        <input
          type="month"
          v-show="newEventDetails.newEventIsPeriod == 'period'"
          v-model="newEventDetails.endDate"
        />
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
              <select v-model="newEventDetails.dimension">
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
              v-model="newEventDetails.description"
              type="text"
              placeholder="Anzeigename des Events"
              id="eventNameId"
            />
          </div>
          <!--
          <p class="help is-danger">
            Bitte gib dem Event einen Titel
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
            <textarea
              class="textarea"
              v-model="newEventDetails.note"
              placeholder="Notizen zum Event"
              id="noteId"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <br />
    <button
      class="button is-white"
      style="margin-right: 1vw; right: -20vw"
      v-on:click="showDialogue = false"
    >
      Abbrechen
    </button>
    <button
      class="button is-link is-light"
      style="right: -20vw"
      v-on:click="addEvent"
      v-on:mouseup="showDialogue = false"
    >
      Fertig
    </button>
  </div>
  <table>
    <thead>
      <tr class="year_age">
        <td class="content">
          <p>Jahr</p>
          <p class="subcontent">Alter</p>
        </td>
        <td class="year-wrap" id="year-wrap" ref="yearwrapper">
          <div v-for="(year, index) in personYears" class="year">
            <p>
              {{ year }}
            </p>
            <p class="subcontent">
              {{ index }}
            </p>
          </div>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="value in dimensionOptions" :key="value">
        <td class="content">
          <div>
            {{ value }}
          </div>
        </td>
        <td class="eventWrap">
          <!-- -->
          <div
            v-for="event in filterEvents(value)"
            id="tdContent"
          >
            <TimeEvent :event="event" :style="calcPos(event)" @click="editDiv(event)" style="cursor: pointer !important;" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { initEvent } from "@/data/ZBEvent";
import { Dimension } from "@/data/Dimension";
import { store } from "@/store";
import TimeEvent from "@/components/TimeEvent.vue";
import DeleteEditDialogue from "@/components/DeleteEditDialogue.vue";
import PersonDialogue from "@/components/PersonDialogue.vue";

export default {
  name: "TimeGraph",
  components: { TimeEvent, DeleteEditDialogue, PersonDialogue },

  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    //console.log(store.getters.getEvents);

    const dimensionOptions = Object.keys(Dimension).filter((v) =>
      isNaN(Number(v))
    );
    return {
      dimensionOptions,
    };
  },
  data() {
    return {
      personYears: store.getters.getTimeline,
      showDialogue: false,
      showEditDialogue: false,
      showCreateBiograph: true,
      clickedEvent: {},
      newEventDetails: {
        newEventIsPeriod: "period",
        description: "",
        note: "",
        dimension: Dimension.Familie,
        startDate: "",
        endDate: "",
      },
      events: store.getters.getEvents,
    };
  },
  methods: {
    loadEvents(){
      //@ts-ignore
      this.events = store.getters.getEvents;
      //@ts-ignore
      console.table(this.events)
    },
    showDiv() {
      //@ts-ignore
      this.showDialogue = true;
    },
    removeEvent() {
      store.commit("data/removeEvent", 0);
    },
    editDiv(event: any) {
      console.log(PersonDialogue.data().personYears)
      //@ts-ignore
      this.clickedEvent = store.getters.getEventById(event.eventId)
      //@ts-ignore
      console.table(this.clickedEvent)
      //@ts-ignore
      this.showEditDialogue = true;
      //console.log(event.eventId);
    },
    closeEditDiv(){
      //@ts-ignore
      this.showEditDialogue = false;
    },
    closePerson(){
      //@ts-ignore
      this.personYears = store.getters.getTimeline;
      //@ts-ignore
      this.showCreateBiograph = false;
    },
    addEvent() {
      const newEvent = initEvent();
      //@ts-ignore
      newEvent.dimensionId = Dimension[this.newEventDetails.dimension];
      //@ts-ignore
      newEvent.description = this.newEventDetails.description;
      //@ts-ignore
      newEvent.notes = this.newEventDetails.note;
      newEvent.isInterval =
        //@ts-ignore
        this.newEventDetails.newEventIsPeriod == "period" ? true : false;
      //@ts-ignore
      newEvent.startDate = this.newEventDetails.startDate;
      //@ts-ignore
      newEvent.endDate = this.newEventDetails.endDate;
      store.commit("data/addEvent", newEvent);
      //console.log(store.getters.getEvents);
    },
    filterEvents(dimension: String): any {
      //@ts-ignore
      return this.events.filter(function (el) {
        //@ts-ignore
        return el.dimensionId == Dimension[dimension];
      });
    },
    calcPos(event: any) {
      let totalYearWidth = 100;
      //@ts-ignore
      let months = this.personYears.length * 12;
      //@ts-ignore
      let startYear = +event.startDate.substring(0, 4);
      //@ts-ignore
      let endYear = +event.endDate.substring(0, 4);
      //@ts-ignore
      let startMonth = parseInt(event.startDate.substring(5, 7), 10);
      //@ts-ignore
      let endMonth = parseInt(event.endDate.substring(5, 7), 10);
      let eventMonths = this.calcEventMonths(
        startYear,
        endYear,
        startMonth,
        endMonth
      );
      //@ts-ignore
      let yearsTilBegin: number = this.personYears.indexOf(startYear) * 12;
      let monthsTilBegin: number = yearsTilBegin + startMonth;

      let margin: number = (totalYearWidth / months) * monthsTilBegin;

      let width: number = (totalYearWidth / months) * eventMonths;
      let styleObject = {
        marginLeft: margin + "%",
        width: width + "%",
      };
      let eventObject = {
        marginLeft: margin + "%",
        width: "11%",
      };
      return event.isInterval ? styleObject : eventObject;
    },
    calcEventMonths(sy: number, ey: number, sm: number, em: number) {
      return em - sm + 12 * (ey - sy);
    },
    displayPersonYears(): Array<number> {
      let displayedArray: number[] = []
      //@ts-ignore
      let years: number[] = this.personYears
      console.log(years)

      const displayMaximum: number = 20

      if(years.length <= displayMaximum) return years

      let gap = years.length / displayMaximum
      let leftOver = years.length % displayMaximum
      const firstYear: number = years.shift() || 0
      const lastYear: number = years.pop() || 0

      displayedArray.push(firstYear)
      for(let i = gap; i < years.length; i += gap + 1){
        displayedArray.push(years[i])
      }
      displayedArray.push(lastYear)

      console.log(displayedArray)
      return displayedArray
    },
  },
};
</script>

<style scoped lang="scss">
table {
  border-spacing: 0;
  width: 100vw;
  height: 93vh;
  display: table;
  margin-top: 1vh;
  margin-left: -5vh;
  table-layout: fixed;
}

td {
  text-align: center;
}

td:not(.eventWrap, .year-wrap) {
  padding: 8px;
}

tr:nth-child(odd) {
  background-color: $gridgrey;
}

thead > tr {
  background-color: white !important;
}

.year {
  padding: 0 10px;
}

.year:nth-child(1) {
  padding-left: 0px;
}

.year-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: center;
  font-size: small;
}

.year_age {
  border-bottom: 0.5px solid lightgrey;
}

.content {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}

.event {
  display: block;
  background-color: $eventgrey;
  border-left: 3px solid $eventgreen;
  width: 10%;
  margin: 5px 0;
  border-radius: 3px;
}

.period {
  display: block;
  background-color: $periodblue;
  border: 2px solid $periodborderblue;
  width: 15%;
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
}

.subcontent {
  color: darkgrey;
}

.event_dialogue {
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

.bar {
  background-color: #181818;
  width: 100vw;
  height: 5.25vh;
  left: -3vw;
  top: -0.5vh;
}

</style>
