<template>
  <div class="box position" style="height: 96vh; width: 40vw">
    <h1 id="edit" class="title block">{{ title }}</h1>
    <br />
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
        <MonthChooser v-model="newPersonDetails.birthDate" require-day />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Zeitbalken bis</label>
      </div>
      <div class="field-body">
        <MonthChooser v-model="newPersonDetails.endDate" require-day />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Erstellt am</label>
      </div>
      <div class="field-body">
        <MonthChooser v-model="newPersonDetails.creationDate" require-day />
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
    <div class="buttons">
      <button
        v-show="showButtons"
        class="button is-white"
        style="margin-right: 1vw; right: -20vw"
        @click="abort"
      >
        Abbrechen
      </button>
      <button class="button is-link" style="right: -20vw" @click="savePerson">
        Fertig
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import MonthChooser from "./MonthChooser.vue";

export default {
  name: "PersonDialogue",
  components: { MonthChooser },
  props: {
    showButton: Boolean,
    title: String,
    newPersonDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      startYear: "",
      endYear: "",
      creationYear: "",
      personYears: [] as number[],
      showBiograph: false,
      // //@ts-ignore
      showButtons: this.showButton,
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
      //@ts-ignore
      this.$router.go(0);
      this.close();
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
