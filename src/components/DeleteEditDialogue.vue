<template>
  <div class="box position" style="height: 96vh; width: 40vw">
    <button
      class="button is-light is-small"
      style="right: -33vw"
      @click="close"
    >
      X
    </button>

    <h1 class="title block">Eintrag bearbeiten</h1>
    <br />
    <button class="button is-danger is-light" @click="removeEvent">
      Eintrag löschen
    </button>
    <br />
    <br />
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
                  v-model="currentEvent.isInterval"
                  value="period"
                  :checked="currentEvent.isInterval"
              />
              Zeitraum
            </label>
            <label class="radio">
              <input
                  type="radio"
                  name="member"
                  v-model="currentEvent.isInterval"
                  value="point"
                  :checked="currentEvent.isInterval == false"
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
        <input type="month" v-model="currentEvent.startDate" />
        <input
            type="month"
            v-show="currentEvent.isInterval == true"
            v-model="currentEvent.endDate"
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
              <select v-model="selectedDimension">
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
              type="text"
              :value="currentEvent.description"
              v-on:change="updateEvent($event.target.value)"
            />
            <!-- class: is danger -->
          </div>
          <!--
          <p class="help is-danger">
            Bitte beschreibe das Event
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
              placeholder="Dieses Event hat noch keine Notiz"
              v-model="currentEvent.notes"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <br />
    <button class="button is-white" style="margin-right: 1vw; right: -15vw">
      Abbrechen
    </button>
    <button
      class="button is-link is-light"
      style="right: -15vw"
      @click="editEvent"
    >
      Änderungen speichern
    </button>
  </div>
</template>

<script>
import { store } from "@/store";
import {Dimension} from "@/data/Dimension";
import { initEvent } from "@/data/ZBEvent";
import {mapMutations} from "vuex";

export default {
  name: "DeleteEditDialogue",
  setup() {
    const dimensionOptions = Object.keys(Dimension).filter((v) =>
        isNaN(Number(v))
    );
    return {
      dimensionOptions,
    };
  },
  props:{
    selectedEvent: {},
  },
  data() {
    return {
      currentEvent: {},
      selectedDimension: Dimension.Familie
    }
  },
  methods: {
    init(){
      this.currentEvent = this.selectedEvent
      this.selectedDimension = Dimension[this.selectedEvent.dimensionId]

      console.table(this.currentEvent)
    },
    updateEvent(event){
      this.currentEvent.description = event
    },
    removeEvent() {
      store.commit("data/removeEvent", this.selectedEvent.eventId);
      this.$emit("close")
    },
    editEvent() {
      const payload = initEvent()
      payload.eventId = this.selectedEvent.eventId
      payload.dimensionId = Dimension[this.selectedDimension];
      //@ts-ignore
      payload.description = this.currentEvent.description;
      //@ts-ignore
      payload.notes = this.currentEvent.notes;
      payload.isInterval =
          //@ts-ignore
          this.currentEvent.isInterval ? true : false;
      payload.startDate = this.currentEvent.startDate;
      payload.endDate = this.currentEvent.endDate;
      console.table(payload)
      store.commit("data/editEvents", payload);
      this.$emit("reload")
      this.$emit("close")
    },
    close() {
      this.$emit("close")
    },
  },
  watch:{
    selectedEvent: function(new_value) {
      this.currentEvent = this.selectedEvent
      this.selectedDimension = Dimension[this.selectedEvent.dimensionId]
    }
  }
};
</script>

<style scoped></style>
