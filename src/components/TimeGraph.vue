<template>
  <!-- <TimeTable v-if="!showCreateBiograph && !showIntro" /> -->
  <TimePane v-if="!showCreateBiograph && !showIntro" />

  <EventDialogue v-show="showDialogue" @close="showDialogue = false" :event="newEventDetails" title="Eintrag erstellen" />

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

  <nav
    class="navbar is-fixed-top is-black"
    style="background-color: #488193"
    v-show="!showCreateBiograph"
  >
    <div class="navbar-brand">
      <div class="navbar-item" title="easyBiograph version 2.0.2 beta">
        easyBiograph
      </div>
    </div>
    <div id="navbarBasicExample" class="navbar-menu bar">
      <div class="navbar-start">
        <div class="navbar-item">
          <div class="buttons">
            <a
              class="button is-dark"
              style="background-color: #36626f"
              @click="openPopUp"
              v-if="!showIntro"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="file" />
              </span>
              <span>Neu</span>
            </a>

            <a
              class="button is-dark"
              style="background-color: #36626f"
              @click="newData"
              v-if="showIntro"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="file" />
              </span>
              <span>Neu</span>
            </a>

            <a class="file is-dark">
              <label class="file-label">
                <input class="file-input" type="file" @change="importData" />
                <span class="file-cta" style="background-color: #36626f">
                  <span class="file-icon icon is-small">
                    <font-awesome-icon icon="folder-open" />
                  </span>
                  <span class="file-label">Öffnen</span>
                </span>
              </label>
            </a>

            <a
              class="button is-dark"
              @click="downloadData"
              v-show="!showIntro"
              style="background-color: #36626f"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="save" />
              </span>
              <span>Speichern</span>
            </a>

            <a
              class="button is-dark"
              @click="showDiv()"
              v-show="!showIntro"
              style="background-color: #36626f"
            >
              <span class="icon">
                <font-awesome-icon icon="plus" />
              </span>
              <span>Event erstellen</span>
            </a>

            <a
              class="button is-dark"
              @click="
                showCreateBiograph = true;
                newPerson = false;
              "
              v-show="!showIntro"
              style="background-color: #36626f"
            >
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

  <!-- Intro for easybiograph -->
  <div class="welcome" v-if="showIntro">
    <embed src="easybiographWelcome.svg" alt="Welcome to easybiograph" />
    <h2 class="title is-2">Willkommen bei easyBiograph!</h2>
    <p class="block">
      Erstellen Sie einen neuen Zeitbalken oder öffnen Sie einen bestehenden
      Zeitbalken, um fortzufahren.
    </p>
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
</template>

<script lang="ts">
import { Dimension } from "@/data/Dimension";
import { store } from "@/store";
import PersonDialogue from "@/components/PersonDialogue.vue";
import PopUpNew from "@/components/PopUpNew.vue";
import EventDialogue from "@/components/EventDialogue.vue";
// import TimeTable from "@/components/TimeTable.vue";
import TimePane from "@/components/TimePane.vue";

export default {
  name: "TimeGraph",
  components: {
    TimePane, // TimeTable,
    EventDialogue,
    PopUpNew,
    PersonDialogue,
  },

  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      temporaryPerson: Object.assign({}, store.state.data.person), // shallow clone (ok for ZBPerson)
      newPerson: true,
      showDialogue: false,
      personYears: store.getters.getTimeline,
      showEventDisplay: false,
      deleteDia: false,
      showCreateBiograph: !store.getters.getPersonCreated,
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
    showIntro(): boolean {
      //@ts-ignore
      return this.personYears < 1;
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
    showDiv() {
      // TODO: use self-explaining function name, which <div>? add event dialog
      //@ts-ignore
      this.showDialogue = true;
      //@ts-ignore
      this.deleteDia = true;
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
    closeModal() {
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
        this.$router.go(0);
      };
      fr.readAsText(files.item(0));
    },
  },
};
</script>

<style scoped lang="scss">
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
