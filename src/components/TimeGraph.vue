<template>
  <!-- <TimeTable v-if="!showCreateBiograph && !showIntro" /> -->

  <EventDialogue
    v-show="showEventDialogue"
    @close="showEventDialogue = false"
    :event="selectedEvent"
  />

  <PersonDialogue
    v-show="showCreateBiograph"
    :newPersonDetails="temporaryPerson"
    title="Neuen Zeitbalken erstellen"
    @close="closePerson"
    @abort="showIntroNew"
    v-if="newPerson"
  />
  <!--:showButton="false"-->

  <PersonDialogue
    v-show="showCreateBiograph"
    :newPersonDetails="temporaryPerson"
    title="Zeitbalken bearbeiten"
    @close="closePerson"
    @abort="showCreateBiograph = false"
    v-if="!newPerson"
  />
  <!--:showButton="true"-->

  <div :class="['ebcontainer', { contrast: contrastMode }]">
    <nav
        class="navbar is-black"
        :style="{ 'background-color': contrastMode ? '#0074CC' : '#488193' }"
        v-show="!showCreateBiograph"
        role="navigation"
        aria-label="main navigation"
    >
      <div class="navbar-brand">

        <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            @click="toggleBurgerMenu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        <div class="navbar-item" :title="`easyBiograph version ${appVersion}`">
          easyBiograph
        </div>

        <div class="buttons">
        <a
            class="button is-dark navbar-item"
            @click="showAddEventDialogue()"
            v-show="!showIntro"
        >
              <span class="icon">
                <font-awesome-icon icon="plus" />
              </span>
          <span>Event erstellen</span>
        </a>

        <a
            class="button is-dark navbar-item"
            @click="toggleZoomMode"
        >
              <span class="icon">
                <font-awesome-icon icon="magnifying-glass-plus" />
              </span>
          <span>Zoom</span>
        </a>
        <a
            class="button is-dark navbar-item"
            @click="zoomUndo"
            v-show="!showIntro && $store.state.data.zoom.birthDate.length > 0"
            title="Zoom zurücksetzen"
            style="margin-right: 2vw"
        >
              <span class="icon">
                <font-awesome-icon icon="magnifying-glass-minus" />
              </span>
        </a>
        </div>
      </div>

      <div
          :class="{ 'is-active': burgerMenuActive }"
          id="navbarBasicExample"
          class="navbar-menu bar"
          :style="{ 'background-color': contrastMode ? '#0074CC' : '#488193' }"
      >
        <div class="navbar-start" style="flex-grow: 1">
          <div class="buttons" style="flex-grow: 1">
            <a
              class="button is-dark navbar-item"
              @click="openPopUp"
              v-if="!showIntro"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="file" />
              </span>
              <span>Neu</span>
            </a>

            <a
              class="button is-dark navbar-item"
              @click="newData"
              v-if="showIntro"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="file" />
              </span>
              <span>Neu</span>
            </a>

            <a class="file is-dark navbar-item" :value="contrastMode ? true : false" style="margin-right: 0vw; margin-left: 0vw">
              <label class="file-label">
                <input class="file-input" type="file" @change="importData" />
                <span class="file-cta" :style="{ 'background-color': contrastMode ? '#001F3F' : '#36626f' }" >
                  <span class="file-icon icon is-small">
                    <font-awesome-icon icon="folder-open" />
                  </span>
                  <span class="file-label">Öffnen</span>
                </span>
              </label>
            </a>

            <a
              class="button is-dark navbar-item"
              @click="downloadData"
              v-show="!showIntro"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="save" />
              </span>
              <span>Speichern</span>
            </a>



            <a
              class="button is-dark navbar-item"
              @click="
                showCreateBiograph = true;
                newPerson = false;
              "
              v-show="!showIntro"
            >
              <!-- TODO edit instead of new -->
              <span class="icon">
                <font-awesome-icon icon="pencil-alt" />
              </span>
              <span>Zeitbalken bearbeiten</span>
            </a>
            <a
                class="button is-dark navbar-item"
                @click="toggleContrastMode"
            >
              <span class="icon">
                <font-awesome-icon icon="paint-roller" />
              </span>
              <span>Kontrast</span>
            </a>

            <span style="flex-grow: 1"></span>
            <a
              class="button is-dark navbar-item"
              @click="openHelpPopUp()"
          >
              <span class="icon">
                <font-awesome-icon icon="question" />
              </span>
            <span>Info</span>
          </a>
          </div>
        </div>
      </div>
      <div class="years-text"
           v-show="!showIntro && $store.state.data.zoom.birthDate.length > 0">
        Zoom: {{ zoomedYears }} von {{ totalYears }} Jahren
      <div class="horizontal-bar-container">
        <div class="white-bar">
          <div class="grey-bar" :style="{ width: greyBarWidth, left: greyBarLeft }"></div>
        </div>
      </div>
      </div>
  </nav>

    <TimePane
      v-if="!showCreateBiograph && !showIntro"
      :contrastMode="contrastMode"
      :zoomMode="zoomMode"
      @display-event="openEventDisplay"
      @open-edit="setSelectedEvent"
    />

  <!-- Intro for easybiograph -->
  <div class="welcome" v-if="showIntro">
    <embed src="easybiographWelcome.svg" alt="Welcome to easybiograph" />
    <h2 class="title is-2">Willkommen bei easyBiograph!</h2>
    <p class="block">
      Erstellen Sie einen neuen Zeitbalken oder öffnen Sie einen bestehenden
      Zeitbalken, um fortzufahren.
    </p>
  </div>
  </div>

  <!-- Modal for Pop-Up message-->
  <div id="modal-popUp" class="modal">
    <div class="modal-background" @click="closeModal"></div>

    <div class="modal-content">
      <div class="box">
        <PopUpNew
          @open-edit="newData"
          @abort-new="closeModal"
          @save-data="downloadData"
        />
      </div>
    </div>

    <button
      class="modal-close is-large"
      aria-label="close"
      @click="closeModal"
    ></button>
  </div>

  <div id="modal-event" class="modal">
    <div class="modal-background" @click="closeModalEvent"></div>

    <div class="modal-content">
      <div class="box">
        <EventDisplay
          :selectedEvent="selectedEvent"
          @open-edit="showEditEventDialogue"
          @abort-new="closeModalEvent"
        />
      </div>
    </div>

    <button
      class="modal-close is-large"
      aria-label="close"
      @click="closeModalEvent"
    ></button>
  </div>
  <div id="modal-help" :class="['modal', { 'is-active': showHelpDialogue }]">
    <div class="modal-background" @click="closeModalHelp"></div>

    <div class="modal-content">
      <div class="box">
        <HelpDialogue @abort="closeModalHelp" />
      </div>
    </div>

    <button
      class="modal-close is-large"
      aria-label="close"
      @click="closeModalHelp"
    ></button>
  </div>
</template>

<script lang="ts">
import {Dimension, initDimension} from "@/data/Dimension";
import { store } from "@/store";
import PersonDialogue from "@/components/PersonDialogue.vue";
import PopUpNew from "@/components/PopUpNew.vue";
import EventDialogue from "@/components/EventDialogue.vue";
import EventPopUp from "@/components/EventPopUp.vue";
import EventDisplay from "@/components/EventDisplay.vue";
// import TimeTable from "@/components/TimeTable.vue";
import TimePane from "@/components/TimePane.vue";
import { initEvent, type ZBEvent } from "@/data/ZBEvent";
import router from "@/router";
import HelpDialogue from "@/components/HelpDialogue.vue";

export default {
  name: "TimeGraph",
  components: {
    HelpDialogue,
    TimePane, // TimeTable,
    EventDialogue,
    PopUpNew,
    PersonDialogue,
    EventPopUp,
    EventDisplay,
  },

  props: {},
  data() {
    const dimensions = store.state.data.dimensions;
    return {
      Dimension: [...dimensions].reverse(),
      temporaryPerson: Object.assign({}, store.state.data.person), // shallow clone (ok for ZBPerson)
      newPerson: true,
      contrastMode: false,
      zoomMode: false,
      selectedEvent: null as ZBEvent | null,
      showEventPopUp: false,
      showEventDialogue: false,
      showHelpDialogue: false,
      personYears: store.getters.getTimeline,
      showEventDisplay: false,
      burgerMenuActive: false,
      showCreateBiograph: !store.getters.getPersonCreated,
      newDimDetails: {
        title: "",
      },
    };
  },
  computed: {
    greyBarWidth(): any {
      const zoomStartDate = store.state.data.zoom.birthDate;
      const zoomEndDate = store.state.data.zoom.endDate;
      const personStartDate = store.state.data.person.birthDate;
      const personEndDate = store.state.data.person.endDate;
      //@ts-ignore
      const totalPersonDuration = new Date(personEndDate) - new Date(personStartDate);
      //@ts-ignore
      const zoomDuration = new Date(zoomEndDate) - new Date(zoomStartDate);
      return (zoomDuration / totalPersonDuration) * 100 + '%';
    },
    greyBarLeft(): any {
      const zoomStartDate = store.state.data.zoom.birthDate;
      const personStartDate = store.state.data.person.birthDate;
      const personEndDate = store.state.data.person.endDate;

      //@ts-ignore
      const totalPersonDuration = new Date(personEndDate) - new Date(personStartDate);
      //@ts-ignore
      const zoomDurationFromStart = new Date(zoomStartDate) - new Date(personStartDate);
      return (zoomDurationFromStart / totalPersonDuration) * 100 + '%';
    },

    zoomedYears() {
      const zoomStartDate = new Date(store.state.data.zoom.birthDate);
      const zoomEndDate = new Date(store.state.data.zoom.endDate);
      return zoomEndDate.getFullYear() - zoomStartDate.getFullYear() + 1;
    },
    totalYears() {
      const personStartDate = new Date(store.state.data.person.birthDate);
      const personEndDate = new Date(store.state.data.person.endDate);
      return personEndDate.getFullYear() - personStartDate.getFullYear() + 1;
    },
    birthDate() {
      return store.state.data.person.birthDate;
    },
    showIntro(): boolean {
      //@ts-ignore
      return this.personYears < 1;
    },
    appVersion(): string {
      // eslint-disable-next-line no-undef
      return __APP_VERSION__;
    },
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
    toggleContrastMode() {
      this.contrastMode = !this.contrastMode;

      console.log("Kontrast clicked")

    },
    toggleZoomMode() {
      this.zoomMode = !this.zoomMode;
    },
    toggleBurgerMenu() {
      this.burgerMenuActive = !this.burgerMenuActive;
    },
    showIntroNew(){
      this.showCreateBiograph = false;
      this.$router.go(0);
    },
    setSelectedEvent({ startDate, endDate, dimensionId }: any) {
      if(startDate == endDate) {
        const tempEvent = initEvent();

        tempEvent.isInterval = false;
        tempEvent.dimensionId = dimensionId;
        tempEvent.startDate = startDate;
        tempEvent.endDate = endDate;

        console.table(tempEvent);

        this.selectedEvent = tempEvent;

        this.showEventDialogue = true;
      }else {
          const tempEvent = initEvent();

          tempEvent.isInterval = true;
          tempEvent.dimensionId = dimensionId;
        if (startDate < endDate){
          tempEvent.startDate = startDate;
          tempEvent.endDate = endDate;
        }else{
          tempEvent.startDate = endDate;
          tempEvent.endDate = startDate;
        }

          console.table(tempEvent);

          this.selectedEvent = tempEvent;

          this.showEventDialogue = true;
      }
    },

    zoomUndo(){
      const originalZoom = {
        birthDate: "",
        endDate: "",
      };

      store.commit("data/addZoom", originalZoom);

      console.log("Zoom commited - original");

      // @ts-ignore
      this.$router.go(0);
    },

    showAddEventDialogue() {
      const tempEvent = initEvent();

      // plausible defaults for dimension top-most visible
      const dimIds = store.state.data.dimensions
        .filter((d) => d.visible)
        .map((d) => d.id);
      tempEvent.dimensionId = dimIds[dimIds.length - 1];

      // plausible defaults for time: the year before the end of Zeitbalken
      const endYear = store.state.data.person.endDate.substring(0, 4);
      const defaultYear = (Number(endYear) - 1).toString();
      tempEvent.startDate = defaultYear + "-01";
      tempEvent.endDate = defaultYear + "-12";

      console.table(tempEvent);

      this.selectedEvent = tempEvent;
      // event.id = -1 therefore dialogue is informed that a new event is created

      this.showEventDialogue = true;
    },
    removeEvent() {
      store.commit("data/removeEvent", 0);
    },
    openPopUp() {
      //@ts-ignore
      this.newPerson = true;
      const modal = document.querySelector("#modal-popUp"); // TODO: https://vuejs.org/guide/essentials/class-and-style.html#binding-html-classes
      if (modal) modal.classList.add("is-active");
    },
    openHelpPopUp() {
      this.showHelpDialogue = true;
    },
    closeModal() {
      const modalPopUp = document.querySelector("#modal-popUp");
      if (modalPopUp) modalPopUp.classList.remove("is-active");
    },
    closeModalEvent() {
      const modalPopUp = document.querySelector("#modal-event");
      if (modalPopUp) modalPopUp.classList.remove("is-active");
    },
    closeModalHelp() {
      this.showHelpDialogue = false;
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

      // Refresh the page after zooming
      window.location.reload();
    },

    openEventDisplay(event: any) {
      //@ts-ignore
      this.selectedEvent = event;

      console.log(event);
      // Show the event display modal
      const modal = document.querySelector("#modal-event");
      if (modal) modal.classList.add("is-active");
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
    newData() {
      this.closeModal();
      console.log("jetzt")
      store.commit("data/newZeitbalken");
      //@ts-ignore
      this.temporaryPerson = Object.assign({}, store.state.data.person); // shallow clone (ok for ZBPerson)
      let defaultDims = ["Familie", "Wohnen", "Bildung", "Arbeit", "Gesundheit" , "Behandlung" , "Sonstiges"] ;
      let count = 0
      //@ts-ignore
      for (var i=0; i < defaultDims.length ; i++) {
        const newDim = initDimension();
        newDim.title = defaultDims[i];
        //@ts-ignore
        store.commit("data/addDimension", newDim);
        count = count + 1
        console.log(count)
      }
      if (count = 5){
        console.log("jetzt")
        //@ts-ignore
        this.showCreateBiograph = true;
      }

    },
    showEditEventDialogue() {
      // this.selectedEvent has already been set before opening the modal event display
      this.showEventDialogue = true;
      this.closeModalEvent();
    },
    showHelpModal() {
      // this.selectedEvent has already been set before opening the modal event display
      this.showHelpDialogue = true;
      this.closeModalEvent();
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
      const temporaryZoom = {
        birthDate: "",
        endDate: "",
      };
      store.commit("data/addZoom", temporaryZoom);

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
        this.$router.go(0);
      };
      fr.readAsText(files.item(0));
    },
  },
};
</script>

<style scoped lang="scss">
.file.is-dark[value="true"] {

  &:hover {
    background-color: #0074CC;
  }

  .file-label {
    color: white;
  }

  .file-icon {
    color: white;
  }
}

.file.is-dark[value="false"] {

  &:hover {
    background-color: #488193;
  }

  .file-label {
    color: white;
  }

  .file-icon {
    color: white;
  }
}

.button.navbar-item {
  background-color: #36626f;
}

.contrast .button.navbar-item {
  background-color: #001f3f;
}

.navbar-start .buttons:last-child {
  margin-right: 0.5em;
}

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

.ebcontainer {
  height: 100svh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--contrast-background);
  color: var(--contrast-text);
}

.horizontal-bar-container {
  margin-top: 10px; /* Adjust this value to position the bar correctly */
  display: flex;
  align-items: center;
  height: 20px; /* Adjust the height of the bar as needed */
}

.white-bar {
  background-color: white;
  width: 10vw;
  height: 100%;
  border: 1px solid #ccc;
  position: relative;
}

.grey-bar {
  background-color: grey;
  height: 100%;
  position: absolute;
  top: 0;
}

.years-text {
  text-align: center;
  margin-bottom: 5px; /* Adjust the margin as needed */
}

@media screen {
  .navbar-menu {
    display: none !important;
  }
  .navbar-burger {
    display: block !important;
  }
  .navbar-menu.is-active {
    display: flex !important;
  }
}
</style>
