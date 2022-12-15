<template>
  <div class="box position" style="height: 96vh; width: 40vw">
    <button class="button is-light is-small" style="right: -33vw" @click="close">X</button>

    <h1 class="title block">Neuen Zeitbalken erstellen</h1>
    <br />
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Name</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input class="input"
                   type="text"
                   placeholder="Name"
                   style="right: -2.5vw; width: 27vw"
                   v-model="newPersonDetails.name"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left" >Geburtsdatum</label>
      </div>
      <div class="field-body">
        <input type="month" v-model="startYear" />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left" >Bis</label>
      </div>
      <div class="field-body">
        <input type="month" v-model="endYear" style="right: -2.6vw" />
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
              style="right: -2vw; width: 27vw"
              v-model="newPersonDetails.birthplace"
              placeholder="Geburtsort der Person"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Ersteller</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Name des Erstellers"
              style="right: -2.5vw; width: 27.1vw"
              v-model="newPersonDetails.interviewers"
            />
          </div>
        </div>
      </div>
    </div>
    <br />
    <button class="button is-white" style="margin-right: 1vw; right: -20vw" @click="close">
      Abbrechen
    </button>
    <button class="button is-link is-light" style="right: -20vw" @click="addPerson">
      Fertig
    </button>
  </div>
</template>

<script lang="ts">
import { initPerson } from "../data/ZBPerson";
import { store } from "@/store";

export default {
  name: "PersonDialogue",
  data() {
    return {
      startYear: "",
      endYear: "",
      personYears: [],
      showBiograph: false,
      newPersonDetails: {
        name: "",
        birthplace: "",
        interviewers: "",
        notes: "",
      }
    }
  },
  methods: {
    addPerson(){
      this.chooseYear()
      const newPerson = initPerson();
      //@ts-ignore
      newPerson.name = this.newPersonDetails.name;
      //@ts-ignore
      newPerson.birthplace = this.newPersonDetails.birthplace;
      //@ts-ignore
      newPerson.interviewers = this.newPersonDetails.interviewers;
      //@ts-ignore
      newPerson.notes = this.newPersonDetails.notes;

      console.log(newPerson.name)
      //@ts-ignore
      console.log(this.personYears)

    },
    chooseYear(){
      //@ts-ignore
      let startValue = +this.startYear.substring(0, 4)
      //@ts-ignore
      let endValue = +this.endYear.substring(0, 4)

      //let list = [];
      for (let i = startValue; i <= endValue; i++) {
        //@ts-ignore
        this.personYears.push(i);
      }
    },
    close() {
      this.chooseYear()
      //@ts-ignore
      console.log(this.personYears)
      //@ts-ignore
      this.$emit("close")
    },
  },
};
</script>

<style scoped></style>
