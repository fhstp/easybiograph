<template>
  <DeleteEditDialogue
    v-show="showEditDialogue"
    @close="showEditDialogue = false"
    :selectedEvent="clickedEvent"
    @reload="loadEvents"
  />

  <!-- Modal to edit Events-->
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

  <div class="personInfo">
    <!-- TODO JB extract into separate component -->
    <p class="same interviewee">
      {{ $store.state.data.person.name }}, geboren am
      {{ $store.state.data.person.birthDate.substring(8, 10) }}.{{
        $store.state.data.person.birthDate.substring(5, 7)
      }}.{{ $store.state.data.person.birthDate.substring(0, 4) }}
      <span v-if="$store.state.data.person.birthplace"
        >in {{ $store.state.data.person.birthplace }}</span
      >
    </p>
    <p
      class="same interviewer"
      style="float: right; text-align: right; margin-right: 1%"
    >
      erstellt
      <span v-if="$store.state.data.person.interviewers"
        >von: {{ $store.state.data.person.interviewers }},</span
      >
      {{ $store.state.data.person.creationDate.substring(8, 10) }}.{{
        $store.state.data.person.creationDate.substring(5, 7)
      }}.{{ $store.state.data.person.creationDate.substring(0, 4) }}
      &nbsp;
    </p>
    <!-- TODO fill from stored ZBPerson -->
    <!-- <span class="client">{{ $store.state.data.person.name }}</span> -->
  </div>

  <div>
    <div class="year_age">
      <div class="content">
        <p>Jahr</p>
        <p class="subcontent">Alter</p>
      </div>
      <div class="year-wrap" id="year-wrap" ref="yearwrapper">
        <div
          v-for="(year, index) in displayYears"
          :key="index"
          class="year"
          :style="calcYearStart(index)"
        >
          <p>
            {{ year }}
          </p>
          <p class="subcontent">
            {{ index }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <table id="table">
    <tbody>
      <tr v-for="(value, index) in dimensionOptions" :key="value" :id="value">
        <td class="content">
          <div>
            {{ value }}
          </div>
        </td>
        <td class="eventWrap" style="height: 0.5vh">
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
import { store } from "@/store";
import { Dimension } from "@/data/Dimension";
import TimeEvent from "@/components/TimeEvent.vue";
import EventDisplay from "@/components/EventDisplay.vue";
import DeleteEditDialogue from "@/components/DeleteEditDialogue.vue";

export default {
  name: "TimeTable",
  components: {
    TimeEvent,
    EventDisplay,
    DeleteEditDialogue,
  },
  data() {
    return {
      displayYears: {},
      filteredEvents: [],
      events: store.getters.getEvents,
      personYears: store.getters.getTimeline,
      eventPos: [],
      categoryHeight: [0, 0, 0, 0, 0, 0, 0],
      clickedEvent: {},
      showEditDialogue: false,
    };
  },
  setup() {
    const dimensionOptions = Object.keys(Dimension).filter((v) =>
      isNaN(Number(v))
    );
    return {
      dimensionOptions,
    };
  },
  mounted() {
    //@ts-ignore
    this.loadEvents();
  },
  created() {
    if (store.getters.getPersonCreated) {
      //@ts-ignore
      this.personYears = store.getters.getTimeline;
      //@ts-ignore
      this.displayYears = this.displayPersonYears();
    }
  },
  methods: {
    loadEvents() {
      //@ts-ignore
      this.personYears = store.getters.getTimeline;
      this.displayPersonYears();
      //@ts-ignore
      this.events = store.getters.getEvents;
      const dims = Object.keys(Dimension).filter((item) => {
        return isNaN(Number(item));
      });
      for (let i = 0; i < dims.length; i++) {
        //@ts-ignore
        this.filteredEvents.push(this.filterEvents(dims[i]));
      }
    },
    editDiv() {
      this.closeModal();
      //@ts-ignore
      this.showEditDialogue = true;
    },
    filterEvents(dimension: String): any {
      //@ts-ignore
      return this.events.filter(function (el) {
        //@ts-ignore
        return el.dimensionId == Dimension[dimension];
      });
    },
    calcYearStart(index: any): any {
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
      let spaceFromLeft = (87 / months) * (index * 12);
      let yearStyle = {
        marginLeft: spaceFromLeft + "%",
      };
      return yearStyle;
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
    setCategoryHeight() {
      var x = window.matchMedia("(max-height: 900px)");

      if (x.matches) {
        //@ts-ignore
        for (let i = 0; i < this.categoryHeight.length; i++) {
          let element = document.getElementById(Dimension[i]);
          //@ts-ignore
          element.style.height = `${this.categoryHeight[i] * 5.5}%`;
        }
      } else {
        //@ts-ignore
        for (let i = 0; i < this.categoryHeight.length; i++) {
          let element = document.getElementById(Dimension[i]);
          //@ts-ignore
          element.style.height = `${this.categoryHeight[i] * 2.5}%`;
        }
      }
    },
    checkHeight(dimension: string, stack: number) {
      let selector = "#" + dimension;
      const row = document.querySelector(selector);
      const itemHeight = 80;
      const newHeight = itemHeight * stack;

      if (!row) {
        return;
      }
      //@ts-ignore
      if (newHeight > row.style.height) {
        //@ts-ignore
        row.style.height = newHeight + "px";
        console.log(dimension, newHeight);
      }
    },
    calcYPos(po: any): number {
      var x = window.matchMedia("(max-height: 900px)");

      //@ts-ignore
      if (this.eventPos.length < 1) return 0;
      let counter = 0;
      //@ts-ignore
      this.eventPos.forEach((e) => {
        if (po.event.dimensionId == e.event.dimensionId) {
          if (
            (po.margin >= e.margin && po.margin <= e.margin + e.width - 1) ||
            (po.margin + po.width - 1 >= e.margin &&
              po.margin + po.width - 1 <= e.margin + e.width - 1)
          ) {
            counter++;
          }
        }
      });
      //@ts-ignore
      if (counter > this.categoryHeight[po.event.dimensionId]) {
        //@ts-ignore
        this.categoryHeight[po.event.dimensionId] = counter;
        this.setCategoryHeight();
      }
      if (x.matches) {
        //@ts-ignore
        let smallHeight = 73 + this.events.length;

        let tableHeight = document.getElementById("table");
        //@ts-ignore
        tableHeight.style.height = smallHeight + "vh";
        return counter;
      } else {
        let tableHeight = document.getElementById("table");
        //@ts-ignore
        tableHeight.style.height = 83 + "vh";
        return counter;
      }
    },

    calcPos(event: any) {
      let totalYearWidth = 97.5;
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

      let leftCord: number = (totalYearWidth / months) * monthsTilBegin;

      let widthPoint: number = totalYearWidth / dYears.length;

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
          positionObject.margin = leftCord;
          //@ts-ignore
          positionObject.width = width;
        } else {
          //@ts-ignore
          positionObject.margin = leftCord;
          //@ts-ignore
          positionObject.width = widthPoint;
        }

        positionObject.yPos = this.calcYPos(positionObject);

        //@ts-ignore
        this.eventPos.push(positionObject);
        //@ts-ignore
        this.eventPos.sort((a, b) => {
          let dateA = new Date(a.event.startDate);
          let dateB = new Date(b.event.startDate);
          //@ts-ignore
          return dateA - dateB;
        });
      }

      let topGap = 25 * positionObject.yPos;

      this.checkHeight(Dimension[event.dimensionId], positionObject.yPos);

      let styleObject = {
        left: leftCord + "%",
        width: width + "%",
        top: topGap + "px",
      };
      let eventObject = {
        left: leftCord + "%",
        width: widthPoint + "%",
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

      const gapYear = displayedArray[2] - displayedArray[1];
      displayedArray.push(gapYear + displayedArray[displayedArray.length - 1]);
      const born = years[0];

      var displayObj = {};
      displayedArray.forEach((year) => {
        //@ts-ignore
        displayObj[year - born] = year;
      });

      return displayObj;
    },
    openEventDisplay(event: any) {
      //@ts-ignore
      this.clickedEvent = store.getters.getEventById(event.eventId);
      const modal = document.querySelector("#modal-event"); // TODO: https://vuejs.org/guide/essentials/class-and-style.html#binding-html-classes
      if (modal) modal.classList.add("is-active");
    },
    closeModal() {
      const modal = document.querySelector("#modal-event");
      if (modal) modal.classList.remove("is-active");
    },
  },
};
</script>

<style scoped lang="scss">
.personInfo {
  position: fixed;
  padding-left: 1vw;
  padding-top: 0.5vh;
  margin-top: -100px;
  background-color: #d2dee2;
  color: #3e505b;
  font-weight: normal;
  width: 100vw;
  height: 45px;
  z-index: 5;
  white-space: nowrap;
}

.same {
  display: inline-block;
}

.interviewee {
  font-size: medium;
  font-weight: bold;
}

.interviewer {
  margin-left: 2vw;
  font-size: smaller;
}

.year_age {
  margin-top: 100px;
  margin-left: -1vw;
  border-bottom: 0.5px solid lightgrey;
  position: fixed;
  width: 100vw;
  height: 55px;
  top: 0px;
  background-color: white;
  z-index: 3;
}

.content {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}

.subcontent {
  color: dimgrey;
}

.year-wrap {
  display: flex;
  flex-direction: row;
  margin-top: -45px;
  margin-bottom: 1.5vh;
  margin-left: 3.5%;
  padding-left: 6.6%;
  text-align: left;
  font-size: small;
}

.year {
  padding: 0 10px;
  position: absolute;
}

.year:nth-child(1) {
  padding-left: 0px;
}

@media (min-height: 900px) {
  #table {
    height: 83vh;
  }
}

@media (max-height: 900px) {
  #table {
    height: 73vh;
  }
}

table {
  border-spacing: 0;
  width: 100vw;
  display: table;
  margin-left: -2.2vh;
  margin-top: 155px;
  table-layout: fixed;
  overflow: auto;
}

td {
  text-align: center;
}

td:not(.eventWrap, .year-wrap) {
  padding: 8px;
}

tr:nth-child(odd) {
  background-color: #f3f2f2;
}

.eventWrap {
  position: relative;
}

thead > tr {
  background-color: white !important;
}

tbody {
  overflow-y: scroll;
}
</style>
