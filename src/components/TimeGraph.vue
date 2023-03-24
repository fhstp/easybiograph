<template>
  <PersonDialogue
    v-show="showCreateBiograph"
    :newPersonDetails="temporaryPerson"
    :showButton="false"
    title="Neuen Zeitbalken erstellen"
    @close="closePerson"
    @abort="showCreateBiograph = false"
    v-if="newPerson"
  />

  <PersonDialogue
      v-show="showCreateBiograph"
      :newPersonDetails="temporaryPerson"
      :showButton="true"
      title="Zeitbalken bearbeiten"
      @close="closePerson"
      @abort="showCreateBiograph = false"
      v-if="!newPerson"
  />

  <DeleteEditDialogue
      v-show="showEditDialogue"
      @close="closeEditDiv"
      :selectedEvent="clickedEvent"
      @reload="loadEvents"
  />
  <nav class="navbar is-fixed-top is-black" style="background-color: #488193" v-show="!showCreateBiograph">
  <div class="navbar-brand">
      <div class="navbar-item" title="easyBiograph version 2.0 beta">
        easyBiograph
      </div>
    </div>
    <div id="navbarBasicExample" class="navbar-menu bar">
      <div class="navbar-start">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-dark" style="background-color: #36626F" @click="openPopUp" v-if="!showIntro">
              <span class="icon is-small">
                <font-awesome-icon icon="file" />
              </span>
              <span>Neu</span>
            </a>

            <a class="button is-dark" style="background-color: #36626F" @click="newData" v-if="showIntro">
              <span class="icon is-small">
                <font-awesome-icon icon="file" />
              </span>
              <span>Neu</span>
            </a>

            <a class="file is-dark" >
              <label class="file-label">
                <input class="file-input" type="file" @change="importData" />
                <span class="file-cta" style="background-color: #36626F">
                  <span class="file-icon icon is-small">
                    <font-awesome-icon icon="folder-open" />
                  </span>
                  <span class="file-label">Öffnen</span>
                </span>
              </label>
            </a>

            <a class="button is-dark" @click="downloadData" v-show="!showIntro" style="background-color: #36626F">
              <span class="icon is-small">
                <font-awesome-icon icon="save" />
              </span>
              <span>Speichern</span>
            </a>

            <a class="button is-dark" @click="showDiv()" v-show="!showIntro" style="background-color: #36626F">
              <span class="icon">
                <font-awesome-icon icon="plus" />
              </span>
              <span>Event erstellen</span>
            </a>

            <a class="button is-dark"  @click="showCreateBiograph = true; newPerson = false" v-show="!showIntro" style="background-color: #36626F">
              <!-- TODO edit instead of new -->
              <span class="icon">
              <font-awesome-icon icon="pencil-alt" />
            </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <br />

  <div class="welcome" v-if="showIntro">
    <embed src = "easybiographWelcome.svg"
         alt="Welcome to easybiograph"
    >
    <h2 class="title is-2">Willkommen bei easyBiograph!</h2>
    <p class="block">Erstelle einen neuen Zeitbalken oder öffne einen bestehenden Zeitbalken, um fortzufahren.</p>
  </div>


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

  <!-- Modal for Pop-Up message-->
  <div id="modal-popUp" class="modal">
    <div class="modal-background" @click="closeModal"></div>

    <div class="modal-content">
      <div class="box">
        <PopUpNew @open-edit="newData" @abort-new="closeModal" @save-data="downloadData" />
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
    style="position: absolute; top: 3vh; height: 93vh; left: 10vw; width: 40vw; z-index: 5"
    v-show="showDialogue"
  >

    <br>
    <h1 class="title block">Eintrag erstellen</h1>
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
                v-model="newEventDetails.isInterval"
                v-bind:value="true"
              />
              Zeitraum
            </label>
            <label class="radio">
              <input
                type="radio"
                v-model="newEventDetails.isInterval"
                v-bind:value="false"
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
        <MonthChooser
          v-model="newEventDetails.startDate"
          :min="birthDate"
          :max="endDate"
        />
      </div>
    </div>
    <div class="field is-horizontal" v-show="newEventDetails.isInterval">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">bis</label>
      </div>
      <div class="field-body">
        <MonthChooser
          v-model="newEventDetails.endDate"
          :min="birthDate"
          :max="endDate"
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
      style="margin-right: 1vw; right: -20vw; margin-top: -20px"
      v-on:click="showDialogue = false"
    >
      Abbrechen
    </button>
    <button
      class="button is-link"
      style="right: -20vw; margin-top: -20px"
      v-on:click="addEvent"
      v-on:mouseup="showDialogue = false"
    >
      Fertig
    </button>
  </div>
  <!-- end of add event dialog -->

  <div v-show="!showCreateBiograph && !showIntro" class="personInfo">
    <p class="same interviewee">
      {{$store.state.data.person.name}},
      geboren am {{$store.state.data.person.birthDate.substring(8,10)}}.{{$store.state.data.person.birthDate.substring(5,7)}}.{{$store.state.data.person.birthDate.substring(0,4)}}
      <span v-if="$store.state.data.person.birthplace">in {{$store.state.data.person.birthplace}}</span>
    </p>
    <p class="same interviewer" style="float: right; text-align: right;  margin-right: 1%">
      erstellt <span v-if="$store.state.data.person.interviewers">von: {{$store.state.data.person.interviewers}},</span>
      {{$store.state.data.person.creationDate.substring(8,10)}}.{{$store.state.data.person.creationDate.substring(5,7)}}.{{$store.state.data.person.creationDate.substring(0,4)}}
      &nbsp;
    </p>
    <!-- TODO fill from stored ZBPerson -->
    <!-- <span class="client">{{ $store.state.data.person.name }}</span> -->
  </div>

  <div v-show="!showCreateBiograph && !showIntro">
    <div class="year_age">
      <div class="content">
        <p>Jahr</p>
        <p class="subcontent">Alter</p>
      </div>
      <div class="year-wrap" id="year-wrap" ref="yearwrapper">
        <div v-for="(year, index) in displayYears" :key="index" class="year" :style="calcYearStart(index)">
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


  <table v-show="!showCreateBiograph && !showIntro" id="table">
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
import { initEvent } from "@/data/ZBEvent";
import { Dimension } from "@/data/Dimension";
import { store } from "@/store";
import TimeEvent from "@/components/TimeEvent.vue";
import DeleteEditDialogue from "@/components/DeleteEditDialogue.vue";
import PersonDialogue from "@/components/PersonDialogue.vue";
import EventDisplay from "@/components/EventDisplay.vue";
import MonthChooser from "./MonthChooser.vue";
import {loadSettingsFromStore} from "@/store/localStoragePlugin";
import PopUpNew from "@/components/PopUpNew.vue";

export default {
  name: "TimeGraph",
  components: {PopUpNew, TimeEvent, DeleteEditDialogue, PersonDialogue, EventDisplay, MonthChooser },

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
      newPerson: true,
      personYears: store.getters.getTimeline,
      displayYears: {},
      eventPos: [],
      filteredEvents: [],
      categoryHeight: [0,0,0,0,0,0,0],
      showDialogue: false,
      showEditDialogue: false,
      showEventDisplay: false,
      showCreateBiograph: !store.getters.getPersonCreated,
      clickedEvent: {},
      // TODO: without refresh it will be necessary to reset newEventDetails
      newEventDetails: {
        isInterval: true,
        description: "",
        note: "",
        dimension: Dimension[Dimension.Familie], // XXX: might solve bug with uninitialized dimension
        startDate: "2020-01",
        endDate: "2020-12",
      },
      events: store.getters.getEvents,
    };
  },
  computed: {
    birthDate() {
      return store.state.data.person.birthDate;
    },
    interviewDate() {
      return store.state.data.person.endDate;
    },
    showIntro(): boolean{
      //@ts-ignore
      //this.displayYears.length > 0
      return this.personYears < 1
    }
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
      //@ts-ignore
      if(newHeight > row.style.height){
        //@ts-ignore
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
    openPopUp(){
      this.newPerson = true;
      const modal = document.querySelector("#modal-popUp"); // TODO: https://vuejs.org/guide/essentials/class-and-style.html#binding-html-classes
      if (modal) modal.classList.add("is-active");
    },
    closeEditDiv() {
      //@ts-ignore
      this.showEditDialogue = false;
    },
    closeModal() {
      const modal = document.querySelector("#modal-event");
      if (modal) modal.classList.remove("is-active");

      const modalPopUp = document.querySelector("#modal-popUp");
      if (modalPopUp) modalPopUp.classList.remove("is-active");
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
      // TODO: should be safe to pass newEventDetails as payload because it is cloned in mutation
      const newEvent = initEvent();
      //@ts-ignore
      // XXX: replace by array? (this should convert enum to int, but sometimes it does not work)
      newEvent.dimensionId = Dimension[this.newEventDetails.dimension];
      //@ts-ignore
      console.log(`dimension: |${this.newEventDetails.dimension}| -> |${newEvent.dimensionId}|`)
      //@ts-ignore
      newEvent.description = this.newEventDetails.description;
      //@ts-ignore
      newEvent.notes = this.newEventDetails.note;
      //@ts-ignore
      newEvent.isInterval = this.newEventDetails.isInterval;
      //@ts-ignore
      newEvent.startDate = this.newEventDetails.startDate;
      //@ts-ignore
      newEvent.endDate = this.newEventDetails.endDate;
      store.commit("data/addEvent", newEvent);
      //@ts-ignore
      this.$router.go(0);
      //@ts-ignore
      this.newEventDetails = {};
    },
    filterEvents(dimension: String): any {

      //@ts-ignore
      return this.events.filter(function (el) {
        //@ts-ignore
        return el.dimensionId == Dimension[dimension];
      });
    },
    setCategoryHeight(){

      var x = window.matchMedia("(max-height: 900px)")

      if(x.matches){
      //@ts-ignore
      for(let i = 0; i < this.categoryHeight.length; i++){
        let element = document.getElementById(Dimension[i])
        //@ts-ignore
        element.style.height = `${this.categoryHeight[i] * 5.5}%`
      }
      }else{
        //@ts-ignore
        for(let i = 0; i < this.categoryHeight.length; i++){
          let element = document.getElementById(Dimension[i])
          //@ts-ignore
          element.style.height = `${this.categoryHeight[i] * 2.5}%`
        }
      }
    },
    calcYearStart(index: any){
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
      let spaceFromLeft =  87 / months * (index * 12)
      let yearStyle = {
        marginLeft: spaceFromLeft + "%",
      };
      return yearStyle;

    },
    calcYPos(po: any): number {

      var x = window.matchMedia("(max-height: 900px)")

      //@ts-ignore
      if(this.eventPos.length < 1) return 0
      let counter = 0
      //@ts-ignore
      this.eventPos.forEach((e) => {
        if(po.event.dimensionId == e.event.dimensionId){
          if(po.margin >= e.margin && po.margin <= e.margin + e.width - 1 || po.margin + po.width - 1 >= e.margin && po.margin + po.width - 1 <= e.margin + e.width - 1){
            counter++
          }
        }
      })
      //@ts-ignore
      if(counter > this.categoryHeight[po.event.dimensionId]){
        //@ts-ignore
        this.categoryHeight[po.event.dimensionId] = counter
        this.setCategoryHeight()
      }
      if(x.matches) {
        //@ts-ignore
        let smallHeight = 73 + this.events.length

        let tableHeight = document.getElementById("table")
        //@ts-ignore
        tableHeight.style.height = smallHeight  + "vh"
        return counter
      }else{
        let tableHeight = document.getElementById("table")
        //@ts-ignore
        tableHeight.style.height = 83 + "vh"
        return counter
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
      this.closeModal();
      store.commit("data/newZeitbalken");
      //@ts-ignore
      this.temporaryPerson = Object.assign({}, store.state.data.person); // shallow clone (ok for ZBPerson)
      //@ts-ignore
      this.showCreateBiograph = true;
    },
    downloadData() {
      // TODO move to utils.ts (consistent with easynwk)
      const filename = "easybiograph_" + store.state.data.person.name + ".json";
      const dataObject = store.getters.getDownloadData;
      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(dataObject));
      var dlAnchorElem = document.createElement("a");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", filename);
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
  margin-top: 132px;
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
  background-color: #F3F2F2; //#f2efea
}

.eventWrap {
  position: relative;
}

.personInfo{
  position: fixed;
  padding-left: 1vw;
  padding-top: 0.5vh;
  margin-top: 32px;
  background-color: #D2DEE2;
  color: #3E505B;
  font-weight: normal;
  width: 100vw;
  height: 45px;
  z-index: 3;
  white-space: nowrap;
}

.interviewee {
  font-size: medium;
  font-weight: bold;
}

.interviewer {
  margin-left: 2vw;
  font-size: smaller;
}

thead > tr {
  background-color: white !important;
}

tbody {
  overflow-y: scroll;
}

.year {
  padding: 0 10px;
  position: absolute;
}

.year:nth-child(1) {
  padding-left: 0px;
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

.same {
  display:inline-block;
}

.content {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}

.subcontent {
  color: dimgrey;
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
  font-size: 120%;
}

.buttons > .file {
  // ensure that File>Open Button is vertically aligned with the other buttons
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
}

.client {
  margin-right: 0.5rem;
}

.welcome {
  text-align: center;
}
</style>
