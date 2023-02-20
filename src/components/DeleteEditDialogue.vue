<template>
  <div class="box position" style="height: 92vh; width: 40vw">
    <button
      class="button is-light is-small"
      style="right: -33vw"
      @click="close"
    >
      X
    </button>

    <h1 class="title block">Eintrag bearbeiten</h1>
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
                v-model="currentEvent.isInterval"
                v-bind:value="true"
              />
              Zeitraum
            </label>
            <label class="radio">
              <input
                type="radio"
                v-model="currentEvent.isInterval"
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
          v-model="currentEvent.startDate"
          :min="birthMonth"
          :max="interviewMonth"
        />
      </div>
    </div>
    <div class="field is-horizontal" v-show="currentEvent.isInterval">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">bis</label>
      </div>
      <div class="field-body">
        <MonthChooser
          v-model="currentEvent.endDate"
          :min="birthMonth"
          :max="interviewMonth"
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
              v-model="currentEvent.description"
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
              placeholder="Dieses Event hat noch keine Notiz"
              v-model="currentEvent.notes"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <br />
    <button
      class="button is-danger is-light"
      @click="removeEvent"
      style="margin-right: 1vw; right: 0vw"
    >
      Löschen
    </button>
    <button
      class="button is-white"
      style="margin-right: 1vw; right: -11vw"
      @click="close"
    >
      Abbrechen
    </button>
    <button
      class="button is-link is-light"
      style="right: -11vw"
      @click="editEvent"
    >
      Speichern
    </button>
  </div>
</template>

<script>
import { store } from "@/store";
import { Dimension } from "@/data/Dimension";
import MonthChooser from "./MonthChooser.vue";

export default {
  name: "DeleteEditDialogue",
  components: { MonthChooser },
  setup() {
    const dimensionOptions = Object.keys(Dimension).filter((v) =>
      isNaN(Number(v))
    );
    return {
      dimensionOptions,
    };
  },
  props: {
    selectedEvent: {},
  },
  data() {
    return {
      currentEvent: {},
      selectedDimension: Dimension.Familie,
    };
  },
  computed: {
    birthMonth() {
      return store.state.data.person.birthMonth;
    },
    interviewMonth() {
      return store.state.data.person.interviewMonth;
    },
  },
  methods: {
    // TODO: init is never called
    // TODO: updateEvent() replaced by v-model
    removeEvent() {
      store.commit("data/removeEvent", this.selectedEvent.eventId);
      this.$router.go(0);
      this.$emit("close");
    },
    editEvent() {
      // safe to send currentEvent because it is a clone
      const payload = this.currentEvent;
      payload.dimensionId = Dimension[this.selectedDimension];
      console.table(payload);
      store.commit("data/editEvents", payload);
      this.$emit("reload");
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
  },
  watch: {
    selectedEvent: function () {
      // shallow clone event data when opening the dialog
      this.currentEvent = Object.assign({}, this.selectedEvent);
      this.selectedDimension = Dimension[this.selectedEvent.dimensionId];
    },
  },
};
</script>

<style scoped>

.position{
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
