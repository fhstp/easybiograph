<template>
  <!-- <TimeTable v-if="!showCreateBiograph && !showIntro" /> -->

  <EventDialogue
    v-show="showEventDialogue"
    @close="showEventDialogue = false"
    :event="selectedEvent"
    style="z-index: 100;"
  />

  <PersonDialogue
    v-show="showCreateBiograph"
    :newPersonDetails="temporaryPerson"
    :title= "t('createtimebar')"
    @close="closePerson"
    @abort="showIntroNew"
    v-if="newPerson"
  />
  <!--:showButton="false"-->

  <PersonDialogue
    v-show="showCreateBiograph"
    :newPersonDetails="temporaryPerson"
    :title= "t('edittimebar')"
    @close="closePerson"
    @abort="showCreateBiograph = false"
    v-if="!newPerson"
  />
  <!--:showButton="true"-->

  <div class="ebcontainer">
    <nav
        :class="['navbar', 'colorMode']"
        v-show="!showCreateBiograph"
        role="navigation"
        aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
            role="button"
            :class="['navbar-burger', 'colorMode']"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            @click="toggleBurgerMenu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        <div :class="['navbar-item', 'colorMode']" :title="`easyBiograph version ${appVersion}`">
          easyBiograph
        </div>

        <div class="navbar-item">
          <div class="buttons">
            <a
            class="button is-dark navbar-item in-nav"
            @click="showAddEventDialogue()"
            v-show="!showIntro"
            >
            <span class="icon">
              <font-awesome-icon icon="plus" />
            </span>
            <span>{{ t("createevent") }}</span>
          </a>
        </div>
      </div>
    </div>

      <div class="navbar-item">
        <div class="buttons">
          <a
            class="button is-dark navbar-item in-nav"
            @click="toggleZoomMode"
            v-show="!showIntro"
            :title= "t('zoomButton')"
            >
            <span class="icon">
              <font-awesome-icon icon="magnifying-glass-plus" />
            </span>
            <span>Zoom</span>
          </a>
          <a
            class="button is-dark navbar-item in-nav"
            @click="zoomUndo"
            v-show="!showIntro && isZoomed"
            :title="t('resetzoom')"
            >
            <span class="icon">
              <font-awesome-icon icon="magnifying-glass-minus" />
            </span>
          </a>
          <a
              class="button is-dark navbar-item in-nav"
              @click="moveZoomLeft"
              v-show="!showIntro && isZoomed"
              :title="t('totheleft')"
              style="margin-right: 1vw"
          >
            &lt;
          </a>
          <div class="years-text" style="color: var(--text-color);" v-show="!showIntro && isZoomed">
            Zoom: {{ zoomedYears }} {{t("outof")}} {{ totalYears }} {{ t("years") }}
            <div class="horizontal-bar-container">
              <div class="white-bar">
                <div class="grey-bar" :style="{ width: greyBarWidth, left: greyBarLeft }"></div>
              </div>
            </div>
          </div>
          <a
            class="button is-dark navbar-item in-nav"
            @click="moveZoomRight"
            v-show="!showIntro && isZoomed"
            :title="t('totheright')"
            style="margin-left: 1vw"
          >
          >
          </a>
        </div>
      </div>

      <!--<div
          :class="{ 'is-active': burgerMenuActive }"
          id="navbarBasicExample"
          class="navbar-menu bar"
          :style="{ 'background-color': contrastMode ? '#0074CC' : '#488193' }"
      > -->
      <div class="sidebar" :class="{ 'is-active': burgerMenuActive }">
        <div class="sidebar-header">
          easyBiograph
          <button class="button navbar-item out-nav" @click="toggleBurgerMenu" style="position: absolute; top: 1em; right: 1em; margin-left: 50px;">
        <span class="icon">
          <font-awesome-icon icon="times" size="2x" />
        </span>
          </button>
        </div>
        <div class="sidebar-menu">
          <div class="buttons sidebar-buttons">
            <a class="button navbar-item out-nav" @click="openPopUp" v-if="!showIntro" :title="t('newButton')">
          <span class="icon is-small">
            <font-awesome-icon icon="file" />
          </span>
              <span>{{ t("new") }}</span>
            </a>
            <a class="button navbar-item out-nav" @click="newData" v-if="showIntro" :title="t('newButton')">
          <span class="icon is-small">
            <font-awesome-icon icon="file" />
          </span>
              <span>{{ t("new") }}</span>
            </a>
            <a class="file">
              <label class="file-label">
                <input class="file-input" type="file" @change="importData" :title="t('openButton')" />
                <span class="file-cta">
              <span class="file-icon icon is-small">
                <font-awesome-icon icon="folder-open" />
              </span>
              <span class="file-label">{{ t("open") }}</span>
            </span>
              </label>
            </a>
            <a class="button navbar-item out-nav" @click="downloadData" v-show="!showIntro" :title="t('saveButton')">
          <span class="icon is-small">
            <font-awesome-icon icon="save" />
          </span>
              <span>{{ t("save") }}</span>
            </a>

            <a class="button navbar-item out-nav" @click="showCreateBiograph = true; newPerson = false;" v-show="!showIntro" :title="t('editButton')">
          <span class="icon">
            <font-awesome-icon icon="pencil-alt" />
          </span>
              <span>{{ t("edittimebar") }}</span>
            </a>

            <a class="button navbar-item out-nav" @click="openPrintView" v-show="!showIntro" :title="t('printButton')">
              <span class="icon">
                <font-awesome-icon icon="print" />
              </span>
              <span>{{ t("print") }}</span>
            </a>

            <a class="button navbar-item out-nav" @click="openHelpPopUp()" :title="t('infoButton')">
          <span class="icon">
            <font-awesome-icon icon="question" />
          </span>
              <span>{{ t("help") }}</span>
            </a>
          </div>
        </div>
      </div>


      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
        <a @click="changeGridState(!showGrid)" class="button is-dark navbar-item in-nav" v-show="!showIntro" :title= "t('gridTitle')">
            <span class="icon">
              <font-awesome-icon icon="table-columns" />
            </span>
            <span>{{ showGrid ? t("enabled") : t("disabled") }}</span>
          </a>
            <span class="icon" :style="{ color: selectedMode !== 'yellow-mode' ? 'white' : 'inherit' }">
              <font-awesome-icon icon="paint-roller" />
            </span>
            <select id="colorselect" name="selectedMode" v-model="selectedMode" style="height: 2em;">
              <option value="green-mode">{{ t("greenmode") }}</option>
              <option value="yellow-mode">{{ t("yellowmode") }}</option>
              <option value="black-mode">{{ t("blackmode") }}</option>
            </select>

          <select
              style="margin-right: 1vw; height: 2em"
              id="langselect"
              name="lang"
              v-model="lang">
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
          </div>
        </div>
  </nav>

    <TimePane
      v-if="!showCreateBiograph && !showIntro"
      :isBlackMode="selectedMode === 'black-mode'"
      :zoomMode="zoomMode"
      @display-event="openEventDisplay"
      @open-edit="setSelectedEvent"
    />

  <!-- Intro for easybiograph -->
  <div class="welcome" v-if="showIntro">
    <embed src="easybiographWelcome.svg" alt="Welcome to easybiograph" />
    <h2 class="title is-2">{{ t("welcome") }}</h2>
    <p class="block">{{ t("textunderwelcome") }}</p>
    <div class="buttons is-centered">
      <a class="button is-primary" @click="newData">
        <span class="icon is-small">
          <font-awesome-icon icon="file" />
        </span>
        <span>{{ t("new") }}</span>
      </a>
      &nbsp;
      <a class="file is-primary"  style="margin-top: -8px; margin-bottom: 1px; margin-left: -4px">
        <label class="file-label is-primary">
          <input class="file-input" type="file" @change="importData" />
          <span class="file-cta">
            <span class="file-icon icon is-small">
              <font-awesome-icon icon="folder-open" />
            </span>
            <span class="file-label">{{ t("open") }}</span>
          </span>
        </label>
      </a>
    </div>
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
import { store } from "@/store";
import PersonDialogue from "@/components/PersonDialogue.vue";
import PopUpNew from "@/components/PopUpNew.vue";
import EventDialogue from "@/components/EventDialogue.vue";
import EventDisplay from "@/components/EventDisplay.vue";
import TimePane from "@/components/TimePane.vue";
import { initEvent, type ZBEvent } from "@/data/ZBEvent";
import HelpDialogue from "@/components/HelpDialogue.vue";
import de from "@/de";
import en from "@/en";
import { changeColorMode } from "@/assets/ColorMode"


export default {
  name: "TimeGraph",
  components: {
    HelpDialogue,
    TimePane, // TimeTable,
    EventDialogue,
    PopUpNew,
    PersonDialogue,
    EventDisplay,
  },

  props: {},
  data() {
    const dimensions = store.state.data.dimensions;
    return {
      Dimension: [...dimensions].reverse(),
      temporaryPerson: Object.assign({}, store.state.data.person), // shallow clone (ok for ZBPerson)
      newPerson: true,
      zoomMode: false,
      selectedEvent: null as ZBEvent | null,
      showEventPopUp: false,
      showEventDialogue: false,
      showHelpDialogue: false,
      // personYears: store.getters.getTimeline,
      showEventDisplay: false,
      burgerMenuActive: false,
      showCreateBiograph: !store.getters.getPersonCreated,
      newDimDetails: {
        title: "",
      },
    };
  },
  computed: {
    isZoomed(): boolean {
      return store.state.data.zoom.birthDate.length > 0;
    },
    greyBarWidth(): string {
      const zoomStartDate = store.state.data.zoom.birthDate;
      const zoomEndDate = store.state.data.zoom.endDate;
      const personStartDate = store.state.data.person.birthDate;
      const personEndDate = store.state.data.person.endDate;
      //@ts-ignore
      const totalPersonDuration = new Date(personEndDate) - new Date(personStartDate);
      //@ts-ignore
      const zoomDuration = new Date(zoomEndDate) - new Date(zoomStartDate);
      return (zoomDuration / totalPersonDuration) * 100 + "%";
    },
    greyBarLeft(): string {
      const zoomStartDate = store.state.data.zoom.birthDate;
      const personStartDate = store.state.data.person.birthDate;
      const personEndDate = store.state.data.person.endDate;

      //@ts-ignore
      const totalPersonDuration = new Date(personEndDate) - new Date(personStartDate);
      //@ts-ignore
      const zoomDurationFromStart = new Date(zoomStartDate) - new Date(personStartDate);
      return (zoomDurationFromStart / totalPersonDuration) * 100 + "%";
    },

    zoomedYears(): number {
      const zoomStartDate = new Date(store.state.data.zoom.birthDate);
      const zoomEndDate = new Date(store.state.data.zoom.endDate);
      return zoomEndDate.getFullYear() - zoomStartDate.getFullYear() + 1;
    },
    totalYears(): number {
      const personStartDate = new Date(store.state.data.person.birthDate);
      const personEndDate = new Date(store.state.data.person.endDate);
      return personEndDate.getFullYear() - personStartDate.getFullYear() + 1;
    },
    birthDate() {
      return store.state.data.person.birthDate;
    },
    showIntro(): boolean {
      //@ts-ignore
      return !(
        store.state.data.person &&
        store.state.data.person.name &&
        store.state.data.person.name.length > 0
      );
    },
    appVersion(): string {
      // eslint-disable-next-line no-undef
      return __APP_VERSION__;
    },
    lang: {
      get() {
        return store.state.settings.language;
      },
      set(newValue: string) {
        store.commit("settings/changeLanguage", newValue);
      }
    },
    selectedMode: {
      get() {
        return store.state.settings.colorMode;
      },
      set(newValue: string) {
        store.commit("settings/changeColorMode", newValue);
      }
    },
    showGrid(): boolean {
      return store.state.settings.showGrid;
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
    closeOnEsc(event) {
      if (event.key === 'Escape') {
        this.showEventDialogue = false;
      }
      if (this.showCreateBiograph) {
        this.showCreateBiograph = false;
      }
      if (this.showHelpDialogue) {
        this.showHelpDialogue = false;
      }
      if (this.burgerMenuActive) {
        this.burgerMenuActive = false;
      }
      this.closeModal();
      this.closeModalEvent();
    },

    openPrintView() {
      const printViewUrl = `${window.location.origin}/#/print-view`;
      window.open(printViewUrl, '_blank');
      this.toggleBurgerMenu();
    },

    moveZoomLeft() {
      const zoomStartDate = new Date(store.state.data.zoom.birthDate);
      const zoomEndDate = new Date(store.state.data.zoom.endDate);
      const personStartDate = new Date(store.state.data.person.birthDate);

      //@ts-ignore
      const zoomDuration = zoomEndDate - zoomStartDate;
      const shiftDuration = zoomDuration * 0.10;

      let newZoomStartDate = new Date(zoomStartDate.getTime() - shiftDuration);
      let newZoomEndDate = new Date(zoomEndDate.getTime() - shiftDuration);

      if (newZoomStartDate < personStartDate) {
        newZoomStartDate = personStartDate;
        newZoomEndDate = new Date(personStartDate.getTime() + zoomDuration);
      }

      const newZoom = {
        birthDate: newZoomStartDate.toISOString().split("T")[0],
        endDate: newZoomEndDate.toISOString().split("T")[0],
      };

      store.commit("data/addZoom", newZoom);
      console.log("Zoom moved 10% to the left");
    },
    moveZoomRight() {
      const zoomStartDate = new Date(store.state.data.zoom.birthDate);
      const zoomEndDate = new Date(store.state.data.zoom.endDate);
      const personEndDate = new Date(store.state.data.person.endDate);

      //@ts-ignore
      const zoomDuration = zoomEndDate - zoomStartDate;
      const shiftDuration = zoomDuration * 0.10;

      let newZoomStartDate = new Date(zoomStartDate.getTime() + shiftDuration);
      let newZoomEndDate = new Date(zoomEndDate.getTime() + shiftDuration);

      if (newZoomEndDate > personEndDate) {
        newZoomEndDate = personEndDate;
        newZoomStartDate = new Date(personEndDate.getTime() - zoomDuration);
      }

      const newZoom = {
        birthDate: newZoomStartDate.toISOString().split("T")[0],
        endDate: newZoomEndDate.toISOString().split("T")[0],
      };

      store.commit("data/addZoom", newZoom);
      console.log("Zoom moved 10% to the right");
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
      this.toggleBurgerMenu()
      //@ts-ignore
      this.newPerson = true;
      const modal = document.querySelector("#modal-popUp"); // TODO: https://vuejs.org/guide/essentials/class-and-style.html#binding-html-classes
      if (modal) modal.classList.add("is-active");
    },
    openHelpPopUp() {
      this.toggleBurgerMenu()
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
      // //@ts-ignore
      // this.personYears = store.getters.getTimeline;
      //@ts-ignore
      this.showCreateBiograph = false;
      // //@ts-ignore
      // this.displayYears = this.displayPersonYears();
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
    // XXX AR:not needed anymore?
    // displayPersonYears(): object {
    //   let displayedArray: number[] = [];
    //   //@ts-ignore
    //   let years: number[] = Object.values(this.personYears);
    //   const displayMaximum: number = 15;

    //   //@ts-ignore
    //   if (years.length <= displayMaximum) return this.personYears;

    //   displayedArray = [years[0]];
    //   let gap = Math.round(years.length / displayMaximum);

    //   for (let i = 1; i < years.length - 1; i++) {
    //     if (i % gap === 0) {
    //       displayedArray.push(years[i]);
    //     }
    //   }
    //   const gapYear = displayedArray[2] - displayedArray[1];
    //   displayedArray.push(gapYear + displayedArray[displayedArray.length - 1]);
    //   const born = years[0];

    //   var displayObj = {};
    //   displayedArray.forEach((year) => {
    //     //@ts-ignore
    //     displayObj[year - born] = year;
    //   });

    //   return displayObj;
    // },
    newData() {
      this.toggleBurgerMenu()
      this.closeModal();
      console.log("jetzt")
      store.commit("data/newZeitbalken");
      //@ts-ignore
      this.temporaryPerson = Object.assign({}, store.state.data.person); // shallow clone (ok for ZBPerson)
      this.showCreateBiograph = true;
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
      this.toggleBurgerMenu()
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
      this.toggleBurgerMenu()
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
    t(prop: string) {
      const trans: any = this.lang === "de" ? de :  en;
      return trans[prop];
    },
    changeGridState(newValue: boolean) {
        store.commit("settings/changeGridState", newValue);
      }
  },
  mounted() {
    changeColorMode(this.selectedMode);
    document.addEventListener('keydown', this.closeOnEsc);
  },
};
</script>

<style scoped lang="scss">
.file[value="true"] {

  &:hover {
    background-color: #0074CC;
  }
}

.file[value="false"] {

  &:hover {
    background-color: #333;
  }
}

.button.navbar-item.in-nav {
  background-color: var(--button-color);
  font-weight: normal;
  color: var(--button-text-color);
}

.button.navbar-item.out-nav {
  background-color: white;
  color: #333;
}

.sidebar-menu > .buttons {
  flex-direction: column;
  align-items: flex-start;
}

.sidebar-menu .file {
  margin-left: 8px;
  margin-bottom: 10px;
}

span.file-cta {
  color: #333;
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
  display: flex;
  align-items: center;
  height: 19px;
}

.white-bar {
  background-color: white;
  width: 12em;
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
  margin-bottom: 5px;
}

.sidebar {
  width: 250px;
  position: fixed;
  top: 0;
  left: -250px;
  height: 100%;
  background-color: #333;
  transition: left 0.3s ease;
}

.sidebar.is-active {
  left: 0;
}

.sidebar-header {
  color: white;
  padding: 20px;
  font-size: 20px;
  font-weight: bolder;
  background-color: #222;
}

.sidebar-menu {
  padding: 20px;
  color: white;
}

.sidebar-buttons .button.navbar-item {
  display: block;
  text-align: left;
  margin-bottom: 10px;
  margin-left: 8px;
}

.sidebar-buttons .file.navbar-item {
  display: block;
  width: 100%;
  text-align: left;
  margin-bottom: 8px;
  background-color: #333;
}

.navbar-brand {
  .navbar-burger {
    margin-left: 1rem;
  }
}

#langselect {
  height: 2.25em;
  margin-left: 0.5em;
}

.colorMode {
  background-color: var(--main-color);
  color: var(--text-color);
}

.navbar {
  flex-wrap: wrap;
}

/* .button.is-primary {
  background-color: #3693A9;
}

.button.is-primary:hover {
  background-color: #3693A9;
}
 */


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
