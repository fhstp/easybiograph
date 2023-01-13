<template>
  <PersonDialogue
    v-show="showCreateBiograph"
    @close="closePerson"
    @abort="showCreateBiograph = false"
  />
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
              <strong>Event erstellen</strong>
            </a>
            <a
              class="button is-dark is-small"
              @click="showCreateBiograph = true"
              style="left: 11vw"
            >
              <strong>
                <span class="icon is-small">
                  <font-awesome-icon icon="pencil-alt" />
                </span>
              </strong>
            </a>

            <a
              class="button is-dark is-small"
              @click="downloadData"
              style="left: 12vw"
            >
              <strong
                ><span class="icon is-small">
                  <font-awesome-icon icon="save" /> </span
              ></strong>
            </a>
            <a class="button is-dark is-small" style="left: 13vw">
              <input class="file-input" type="file" @change="importData" />
              <span class="icon is-small">
                <font-awesome-icon icon="folder-open" />
              </span>
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

  <DeleteEditDialogue
    v-show="showEditDialogue"
    @close="closeEditDiv"
    :selectedEvent="clickedEvent"
    @reload="loadEvents"
  />
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
            :key="event.eventId"
            id="tdContent"
          >
            <TimeEvent
              :event="event"
              :show-notes="isOnlyEventAtPos(event)"
              :style="calcPos(event)"
              @click="openEventDisplay(event)"
              style="cursor: pointer !important"
            />
          </div>
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
      personYears: store.getters.getTimeline,
      displayYears: {},
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
  methods: {
    loadEvents() {
      //@ts-ignore
      this.personYears = store.getters.getTimeline;
      this.displayPersonYears();
      //@ts-ignore
      this.events = store.getters.getEvents;
    },
    showDiv() {
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
      const modal = document.querySelector("#modal-event");
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
    calcPos(event: any) {
      let totalYearWidth = 100;
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

      let margin: number = (totalYearWidth / months) * monthsTilBegin;

      let marginPoint: number = totalYearWidth / dYears.length;

      //@ts-ignore
      let width: number = event.isInterval
        ? (totalYearWidth / months) * eventMonths
        : 5;

      let styleObject = {
        left: margin + "%",
        width: width + "%",
      };
      let eventObject = {
        left: margin + "%",
        width: marginPoint + "%",
      };

      return event.isInterval ? styleObject : eventObject;
    },
    calcEventMonths(sy: number, ey: number, sm: number, em: number) {
      return em - sm + 12 * (ey - sy);
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
  height: 93vh;
  display: table;
  margin-top: 1vh;
  margin-left: -5.2vh;
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
}

#tdContent {
  display: block;
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
