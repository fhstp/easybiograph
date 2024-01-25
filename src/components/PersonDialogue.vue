<template>
  <div class="box position" style="height: 96vh; width: 40vw">
    <div class="tabs">
      <button class="button is-primary is-light" @click="openTab($event, 'Allgemein')">
        <span class="icon">
          <font-awesome-icon icon="sliders" />
        </span>
        <span>Allgemein</span>
      </button>
      <button class="button is-primary is-light" @click="openTab($event, 'Dimensionen')">
        <span class="icon">
          <font-awesome-icon icon="table-list" />
        </span>
        <span>Dimensionen</span>
      </button>
      <button class="button is-primary is-light" @click="openTab($event, 'Farben')" disabled>
        <span class="icon">
          <font-awesome-icon icon="palette" />
        </span>
        <span>Farben</span>
      </button>
    </div>
    <div id="Allgemein" class="tabcontent">
      <br>
    <h1 id="edit" class="title block">{{ title }}</h1>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Name</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Name"
              v-model="newPersonDetails.name"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Geburtsdatum</label>
      </div>
      <div class="field-body">
        <MonthChooser v-model="newPersonDetails.birthDate" require-day :disabled="false" />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Zeitbalken bis</label>
      </div>
      <div class="field-body">
        <MonthChooser v-model="newPersonDetails.endDate" require-day :disabled="false" />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Erstellt am</label>
      </div>
      <div class="field-body">
        <MonthChooser v-model="newPersonDetails.creationDate" require-day :disabled="false" />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Geburtsort</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="newPersonDetails.birthplace"
              placeholder="Geburtsort der Person"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Ersteller*in</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Name der Erstellerin/des Erstellers"
              v-model="newPersonDetails.interviewers"
            />
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Notizen</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
                class="textarea"
                v-model="newPersonDetails.notes"
                placeholder="Notizen zur Person"
                id="noteId"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div id="Dimensionen" class="tabcontent" style="display: none">
      <DimensionDialogue />
    </div>
    <div id="Farben" class="tabcontent" style="display: none">
      <ColourDialogue />
    </div>
    <br/>
    <br/>
    <br/>
    <div class="buttons">
      <button

          class="button is-white"
          style="margin-right: 1vw; right: -20vw; top: -9vh"
          @click="abort"
      >
        Abbrechen
      </button>
      <button class="button is-link" style="right: -20vw; top: -9vh" @click="savePerson">
        Fertig
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import MonthChooser from "./MonthChooser.vue";
import DimensionDialogue from "@/components/DimensionDialogue.vue";
import ColourDialogue from "@/components/ColourDialogue.vue";

export default {
  name: "PersonDialogue",
  components: {ColourDialogue, DimensionDialogue, MonthChooser },
  props: {
    //showButton: Boolean,
    title: String,
    newPersonDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    const dimensions = store.state.data.dimensions;
    return {
      Dimension: [...dimensions].reverse(),
      startYear: "",
      endYear: "",
      creationYear: "",
      personYears: [] as number[],
      showBiograph: false,
      // newPersonDetails: {},
    };
  },
  // beforeUpdate() {
  //   console.log(`the component is now beforeUpdate.`);
  //   this.newPersonDetails = Object.assign({}, store.state.data.person); // shallow clone (ok for ZBPerson)
  // },
  methods: {
    savePerson() {
      // TODO: for backwards compatibility
      //@ts-ignore
      this.startYear = this.newPersonDetails.birthDate;
      //@ts-ignore
      this.endYear = this.newPersonDetails.endDate;
      //@ts-ignore
      this.creationYear = this.newPersonDetails.creationDate;

      //@ts-ignore
      store.commit("data/addPerson", this.newPersonDetails);

      const temporaryZoom = {
        birthDate: "",
        endDate: "",
      };

      store.commit("data/addZoom", temporaryZoom);

      //@ts-ignore
      this.$router.go(0);
      this.close();
    },
    updateDimensionList() {
      const dimensions = store.state.data.dimensions;
      this.Dimension = [...dimensions].reverse();
    },
    openTab(event: any, tabName: any) {
      var i, tabcontent;

      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        //@ts-ignore
        tabcontent[i].style.display = "none";
      }

      //@ts-ignore
      event.currentTarget.className += " active";
      //@ts-ignore
      document.getElementById(tabName).style.display = "block";
    },

    chooseYear() {
      //@ts-ignore
      let startValue = +this.startYear.substring(0, 4);
      //@ts-ignore
      let endValue = +this.endYear.substring(0, 4);

      for (let i = startValue; i <= endValue; i++) {
        //@ts-ignore
        this.personYears.push(i);
      }
    },
    close() {
      this.chooseYear();
      //@ts-ignore
      store.commit("data/addTimeline", this.personYears);
      //store.commit("data/addDimensions");
      //@ts-ignore
      this.$router.go(0);
      //@ts-ignore
      this.$emit("close");
    },
    abort() {
      //@ts-ignore
      this.$emit("abort");
    },

    displayPersonYears(): Array<number> {
      let displayedArray: number[] = [];
      //@ts-ignore
      let years: number[] = this.personYears;
      console.log(years);

      const displayMaximum: number = 20;

      if (years.length <= displayMaximum) return years;

      let gap = years.length / displayMaximum;
      const firstYear: number = years.shift() || 0;
      const lastYear: number = years.pop() || 0;

      console.log(gap);
      displayedArray.push(firstYear);
      for (let i = gap; i < years.length; i += gap + 1) {
        displayedArray.push(years[i]);
      }
      displayedArray.push(lastYear);

      console.log(displayedArray);
      return displayedArray;
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 769px), print {
  .field-body {
    flex-grow: 3;
  }
}
</style>
