<template>
  <PersonDialogue
    v-show="showCreateBiograph"
    :newPersonDetails="temporaryPerson"
    @close="closePerson"
    @abort="showCreateBiograph = false"
  />

  <DeleteEditDialogue
      v-show="showEditDialogue"
      @close="closeEditDiv"
      :selectedEvent="clickedEvent"
      @reload="loadEvents"
  />
  <nav class="navbar is-fixed-top is-black" v-show="!showCreateBiograph">
    <div class="navbar-brand">
      <div class="navbar-item">easyBiograph</div>
    </div>
    <div id="navbarBasicExample" class="navbar-menu bar">
      <div class="navbar-start">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-dark" @click="newData">
              <span class="icon is-small">
                <font-awesome-icon icon="file" />
              </span>
              <span>Neu</span>
            </a>

            <a class="file is-dark">
              <label class="file-label">
                <input class="file-input" type="file" @change="importData" />
                <span class="file-cta">
                  <span class="file-icon icon is-small">
                    <font-awesome-icon icon="folder-open" />
                  </span>
                  <span class="file-label">Öffnen</span>
                </span>
              </label>
            </a>

            <a class="button is-dark" @click="downloadData">
              <span class="icon is-small">
                <font-awesome-icon icon="save" />
              </span>
              <span>Speichern</span>
            </a>
          </div>
        </div>

        <div class="navbar-item">
          <!-- TODO fill from stored ZBPerson -->
          <span class="client">{{ $store.state.data.person.name }}</span>
          <a class="button is-dark" @click="showCreateBiograph = true">
            <!-- TODO edit instead of new -->
            <span class="icon">
              <font-awesome-icon icon="pencil-alt" />
            </span>
          </a>
        </div>

        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-dark" @click="showDiv()">
              <span class="icon">
                <font-awesome-icon icon="plus" />
              </span>
              <span>Event erstellen</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <br />

  <div id="modal-event" class="modal">
    <div class="modal-background" @click="closeModal"></div>

    <div class="modal-content">
      <div class="box">
        <EventDisplay :event="clickedEvent" @open-edit="editDiv" />
      </div>
    </div>

    <button
      class="modal-close is-large"
      aria-label="close"
      @click="closeModal"
    ></button>
  </div>


  <!-- begin add event dialog -->
  <div
    class="box position"
    id="box"
    style="position: absolute; top: 3vh; height: 93vh; left: 10vw; width: 40vw; z-index: 2"
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
  <!-- end of add event dialog -->
  <table v-show="!showCreateBiograph">
    <thead>
      <tr class="year_age">
        <td class="content">
          <p>Jahr</p>
          <p class="subcontent">Alter</p>
        </td>
        <td class="year-wrap" id="year-wrap" ref="yearwrapper">
          <div v-for="(year, index) in displayYears" :key="index" class="year">
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
      <tr v-for="(value, index) in dimensionOptions" :key="value" :id="value">
        <td class="content">
          <div>
            {{ value }}
          </div>
        </td>
        <td class="eventWrap">
          <!-- -->

            <TimeEvent
                v-for="event in filteredEvents[index]"
                :key="event.eventId"
                class="eventSelector"
              :event="event"
              :show-notes="isOnlyEventAtPos(event)"
              :style="calcPos(event)"
              @click="openEventDisplay(event)"
              style="cursor: pointer !important"
            />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { initEvent } from "@/data/ZBEvent";
import { Dimension } from "@/data/Dimension";
import { store } from "@/store";
import TimeEvent from "@/components/TimeEvent.vue";
import DeleteEditDialogue from "@/components/DeleteEditDialogue.vue";
import PersonDialogue from "@/components/PersonDialogue.vue";
import EventDisplay from "@/components/EventDisplay.vue";
import {loadSettingsFromStore} from "@/store/localStoragePlugin";

export default {
  name: "TimeGraph",
  components: { TimeEvent, DeleteEditDialogue, PersonDialogue, EventDisplay },

  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup() {
    //const store = useStore();

    //console.log(store.getters.getEvents);

    const dimensionOptions = Object.keys(Dimension).filter((v) =>
      isNaN(Number(v))
    );
    return {
      dimensionOptions,
    };
  },
  created() {
    if (store.getters.getPersonCreated) {
      //@ts-ignore
      this.personYears = store.getters.getTimeline;
      //@ts-ignore
      this.displayYears = this.displayPersonYears();
    }
  },
  data() {
    return {
      temporaryPerson: Object.assign({}, store.state.data.person), // shallow clone (ok for ZBPerson)
      personYears: store.getters.getTimeline,
      displayYears: {},
      eventPos: [],
      filteredEvents: [],
      showDialogue: false,
      showEditDialogue: false,
      showEventDisplay: false,
      showCreateBiograph: !store.getters.getPersonCreated,
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
  watch: {
    displayYears: {
      handler(newValue: Array<number>) {
        console.log(typeof newValue);
      },
      deep: true,
    },
  },
  mounted() {
    //@ts-ignore
    this.loadEvents()
  },
  methods: {
    loadEvents() {
      //@ts-ignore
      this.personYears = store.getters.getTimeline;
      this.displayPersonYears();
      //@ts-ignore
      this.events = store.getters.getEvents;
      const dims = Object.keys(Dimension).filter((item) => {
        return isNaN(Number(item))
      })
      for(let i = 0; i < dims.length; i++){
        //@ts-ignore
        this.filteredEvents.push(this.filterEvents(dims[i]))
      }
    },
    showDiv() {
      // TODO: use self-explaining function name, which <div>? add event dialog
      //@ts-ignore
      this.showDialogue = true;
    },
    removeEvent() {
      store.commit("data/removeEvent", 0);
    },
    editDiv() {
      this.closeModal();
      //@ts-ignore
      this.showEditDialogue = true;
    },
    checkHeight(dimension: string, stack: number){
      let selector = "#" + dimension
      const row = document.querySelector(selector)
      const itemHeight = 80
      const newHeight = itemHeight * stack


      if(!row){return}
      if(newHeight > row.style.height){
        row.style.height = newHeight + "px"
        console.log(dimension, newHeight)
      }

    },
    isOnlyEventAtPos(event: any): Boolean {
      const eventYears = [] as number[];
      const startYear = new Date(event.startDate).getFullYear();
      if (event.isInterval) {
        const endYear = new Date(event.endDate).getFullYear();
        for (let year = startYear; year <= endYear; year++) {
          eventYears.push(year);
        }
      } else {
        eventYears.push(startYear);
      }
      let years = [] as number[];

      let events = store.getters.getEvents.filter(
        //@ts-ignore
        (a) => a.dimensionId == event.dimensionId
      );
      for (let i = 0; i < events.length; i++) {
        if (events[i].eventId == event.eventId) continue;
        if (events[i].isInterval) {
          const sy = new Date(events[i].startDate).getFullYear();
          const ey = new Date(events[i].endDate).getFullYear();
          for (let year = sy; year <= ey; year++) {
            years.push(year);
          }
        } else {
          years.push(new Date(events[i].startDate).getFullYear());
        }
      }
      let isOnly = !eventYears.some((element) => years.includes(element));

      return isOnly;
    },
    openEventDisplay(event: any) {
      //@ts-ignore
      this.clickedEvent = store.getters.getEventById(event.eventId);
      const modal = document.querySelector("#modal-event"); // TODO: https://vuejs.org/guide/essentials/class-and-style.html#binding-html-classes
      if (modal) modal.classList.add("is-active");
    },
    closeEditDiv() {
      //@ts-ignore
      this.showEditDialogue = false;
    },
    closeModal() {
      const modal = document.querySelector("#modal-event");
      if (modal) modal.classList.remove("is-active");
    },
    closePerson() {
      //@ts-ignore
      this.personYears = store.getters.getTimeline;
      //@ts-ignore
      this.showCreateBiograph = false;

      //@ts-ignore
      this.displayYears = this.displayPersonYears();
      //@ts-ignore
      this.$forceUpdate();
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

      //@ts-ignore
      this.newEventDetails = {};
      //console.log(store.getters.getEvents);
    },
    filterEvents(dimension: String): any {

      //@ts-ignore
      return this.events.filter(function (el) {
        //@ts-ignore
        return el.dimensionId == Dimension[dimension];
      });
    },
    calcYPos(po: any): number {

      //@ts-ignore
      if(this.eventPos.length < 1) return 0
      let counter = 0
      //@ts-ignore
      this.eventPos.forEach((e) => {
        if(po.event.dimensionId == e.event.dimensionId){
          if(po.margin >= e.margin && po.margin <= e.margin + e.width || po.margin + po.width >= e.margin && po.margin + po.width <= e.margin + e.width){
            counter++
          }
        }
      })
      return counter
    },
    calcPos(event: any) {

      let totalYearWidth = 90;
      //@ts-ignore
      let dYears: number[] = Object.values(this.displayYears);

      //@ts-ignore
      let months = this.personYears.length * 12;

      if (
        //@ts-ignore
        this.personYears[this.personYears.length - 1] ==
        dYears[dYears.length - 1]
      ) {
        //@ts-ignore
        months = this.personYears.length * 12;
      } else {
        let extra =
          (dYears[dYears.length - 1] -
            //@ts-ignore
            this.personYears[this.personYears.length - 1]) *
          12;
        //@ts-ignore
        months = this.personYears.length * 12 + extra;
      }

      //@ts-ignore
      let startYear = +event.startDate.substring(0, 4);

      //@ts-ignore
      let startMonth = parseInt(event.startDate.substring(5, 7), 10);

      //@ts-ignore

      let eventMonths = 0;

      if (event.isInterval) {
        //@ts-ignore
        let endYear = +event.endDate.substring(0, 4);

        let endMonth = parseInt(event.endDate.substring(5, 7), 10);

        eventMonths = this.calcEventMonths(
          startYear,
          endYear,
          startMonth,
          endMonth
        );
      }
      //@ts-ignore
      let yearsTilBegin: number = this.personYears.indexOf(startYear) * 12;

      let monthsTilBegin: number = yearsTilBegin + startMonth;

      let margin: number = (totalYearWidth / months) * monthsTilBegin + 8;

      let marginPoint: number = totalYearWidth / dYears.length;

      //@ts-ignore
      let width: number = event.isInterval
        ? (totalYearWidth / months) * eventMonths
        : 5 + 8.5;

      //@ts-ignore
      let positionObject = this.eventPos.find((d) => d.event === event);

      if (!positionObject) {
        positionObject = {};

        //@ts-ignore
        positionObject.event = event;

        if (event.isInterval) {
          //@ts-ignore
          positionObject.margin = margin;
          //@ts-ignore
          positionObject.width = width;
        } else {
          //@ts-ignore
          positionObject.margin = margin;
          //@ts-ignore
          positionObject.width = marginPoint;
        }

        positionObject.yPos = this.calcYPos(positionObject);

        //@ts-ignore
        this.eventPos.push(positionObject);
        //@ts-ignore
        this.eventPos.sort((a, b) =>{
          let dateA = new Date(a.event.startDate)
          let dateB = new Date(b.event.startDate)
          //@ts-ignore
          return dateA - dateB
        })
      }

      let topGap = 25 * positionObject.yPos

      this.checkHeight(Dimension[event.dimensionId], positionObject.yPos)

      let styleObject = {
        left: margin + "%",
        width: width + "%",
        top: topGap + "px",
      };
      let eventObject = {
        left: margin + "%",
        width: marginPoint + "%",
        top: topGap + "px",
      };

      return event.isInterval ? styleObject : eventObject;
    },
    calcEventMonths(sy: number, ey: number, sm: number, em: number) {
      return em - sm + 12 * (ey - sy) + 1;
    },
    displayPersonYears(): object {
      let displayedArray: number[] = [];
      //@ts-ignore
      let years: number[] = Object.values(this.personYears);

      const displayMaximum: number = 15;

      //@ts-ignore
      if (years.length <= displayMaximum) return this.personYears;

      displayedArray = [years[0]];
      let gap = Math.round(years.length / displayMaximum);

      for (let i = 1; i < years.length - 1; i++) {
        if (i % gap === 0) {
          displayedArray.push(years[i]);
        }
      }

      //displayedArray.unshift(firstYear)
      const gapYear = displayedArray[2] - displayedArray[1];
      displayedArray.push(gapYear + displayedArray[displayedArray.length - 1]);
      //displayedArray.push(years[years.length - 1])
      const born = years[0];

      var displayObj = {};
      displayedArray.forEach((year) => {
        //@ts-ignore
        displayObj[year - born] = year;
      });

      return displayObj;
    },
    newData() {
      store.commit("data/newZeitbalken");
      //@ts-ignore
      this.temporaryPerson = Object.assign({}, store.state.data.person); // shallow clone (ok for ZBPerson)
      //@ts-ignore
      this.showCreateBiograph = true;
    },
    downloadData() {
      const dataObject = store.getters.getDownloadData;
      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(dataObject));
      var dlAnchorElem = document.createElement("a");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "easybiograph.json");
      dlAnchorElem.style.display = "none";
      document.body.appendChild(dlAnchorElem);
      dlAnchorElem.click();
      document.body.removeChild(dlAnchorElem);
    },
    importData(event: any) {
      // based on https://stackoverflow.com/a/36198572/1140589
      const files = event.target.files;

      if (files.length <= 0) {
        return false;
      }

      const fr = new FileReader();
      // eslint-disable-next-line
      fr.onload = (e: any) => {
        const readData = e.target.result;
        // TODO format checks & error messages
        // if (savedNWK.alteri && savedNWK.alteri instanceof Array) {
        // if (savedNWK.ego && isEgo(savedNWK.ego)) {
        store.commit("data/loadZeitbalken", readData);
        //@ts-ignore
        this.loadEvents();
        //@ts-ignore
        this.$router.go(0);
      };
      fr.readAsText(files.item(0));
    },
  },
};
</script>

<style scoped lang="scss">


table {
  border-spacing: 0;
  width: 100vw;
  height: 90vh;
  display: table;
  margin-top: 7vh;
  margin-left: -2.2vh;
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

.eventWrap {
  position: relative;
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

.subcontent {
  color: darkgrey;
}

.event_dialogue {
  // TODO: unused
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

// .bar {
//   background-color: #181818;
//   width: 100vw;
//   height: 5.25vh;
//   left: -3vw;
//   top: -0.5vh;
// }

.navbar-brand > div {
  font-weight: bold;
}

.buttons > .file {
  // ensure that File>Open Button is vertically aligned with the other buttons
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
}

.client {
  margin-right: 0.5rem;
}
</style>
