<template>
  <div
    class="box position"
    id="box"
    style="
      position: absolute;
      top: 3vh;
      height: 93vh;
      left: 10vw;
      width: 40vw;
      z-index: 5;
    "
  >
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
      <div class="field-body" >
        <MonthChooser
          v-model="newEventDetails.endDate"
          :min="birthDate"
          :max="endDate"
        />
      </div>
    </div>

    <label class="checkbox is-small" v-show="newEventDetails.isInterval" style="float: right; text-align: right; margin-right: 1%; font-size: smaller">
      <input type="checkbox">
      Offenes Ende
    </label>
    <br>

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
      v-on:click="close"
    >
      Abbrechen
    </button>
    <button
      class="button is-link"
      style="right: -20vw; margin-top: -20px"
      v-on:click="addEvent"
    >
      Fertig
    </button>
  </div>
</template>

<script>
import MonthChooser from "./MonthChooser.vue";
import { store } from "../store";
import { Dimension } from "../data/Dimension";
import { initEvent } from "../data/ZBEvent";

export default {
  name: "EventDialogue",
  components: { MonthChooser },
  setup() {
    const dimensionOptions = Object.keys(Dimension).filter((v) =>
      isNaN(Number(v))
    );
    return {
      dimensionOptions,
    };
  },
  computed: {
    birthDate() {
      return store.state.data.person.birthDate;
    },
    endDate() {
      return store.state.data.person.endDate;
    },
  },
  data() {
    return {
      newEventDetails: {
        isInterval: true,
        description: "",
        note: "",
        dimension: Dimension[Dimension.Familie], // XXX: might solve bug with uninitialized dimension
        startDate: "2020-01",
        endDate: "2020-12",
      },
      selectedDimension: Dimension.Familie,
    };
  },
  methods: {
    addEvent() {
      // TODO: should be safe to pass newEventDetails as payload because it is cloned in mutation
      const newEvent = initEvent();
      //@ts-ignore
      // XXX: replace by array? (this should convert enum to int, but sometimes it does not work)
      newEvent.dimensionId = Dimension[this.newEventDetails.dimension];
      //@ts-ignore
      console.log(
        `dimension: |${this.newEventDetails.dimension}| -> |${newEvent.dimensionId}|`
      );
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
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.position {
  position: fixed;
  margin-left: 10vw;
  margin-top: 4vh;
  z-index: 10;
}

@media screen and (min-width: 769px), print {
  .field-body {
    flex-grow: 3;
  }
}
</style>
