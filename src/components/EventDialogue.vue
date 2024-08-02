<template>
  <div
    class="box position"
    id="box"
    style="
      position: absolute;
      top: 3vh;
      height: 90vh;
      left: auto;
      right: auto;
      width: 50em;
      z-index: 10;
    "
  >
    <h1 class="title block">{{ title }}</h1>
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
                v-model="tempEvent.isInterval"
                v-bind:value="true"
              />
              Zeitraum
            </label>
            <label class="radio">
              <input
                type="radio"
                v-model="tempEvent.isInterval"
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
          v-model="tempEvent.startDate"
          :min="birthDate"
          :max="endDate"
          :disabled="false"
        />
      </div>
    </div>
    <div class="field is-horizontal" v-show="tempEvent.isInterval">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">bis</label>
      </div>
      <div class="field-body">
        <MonthChooser
          v-model="tempEvent.endDate"
          :min="birthDate"
          :max="endDate"
          :disabled="tempEvent.isOpenEnd"
        />
      </div>
    </div>
    <p
      class="help is-danger"
      v-if="invalidEnd"
      style="
        float: right;
        text-align: right;
        margin-right: 1%;
        font-size: smaller;
      ">Ende darf nicht vor dem Start liegen!</p>
    <br />
    <br v-if="invalidEnd" />
    <label
      class="checkbox is-small"
      v-show="tempEvent.isInterval"
      style="
        float: right;
        text-align: right;
        margin-right: 1%;
        font-size: smaller;
      "
    >
      <input type="checkbox" v-model="tempEvent.isOpenEnd" />
      Offenes Ende
    </label>
    <br />

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Dimension</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="tempEvent.dimensionId">
                <option
                  v-for="dim in dimensionOptions"
                  :key="dim.id"
                  :value="dim.id"
                >
                  {{ dim.title }}
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
            <form @submit.prevent="isNewEvent ? addEvent() : editEvent()">
            <input
              class="input"
              :class="{'is-danger': tempEvent.description.length < 1}"
              v-model="tempEvent.description"
              type="text"
              placeholder="Anzeigename des Events"
              id="eventNameId"
              required
            />
            </form>
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
              v-model="tempEvent.notes"
              placeholder="Notizen zum Event"
              id="noteId"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="buttons is-right">
      <button
        v-if="!isNewEvent"
        class="button is-danger is-light"
        @click="removeEvent"
      >
        Löschen
      </button>
      <button
        class="button is-white"
        v-on:click="close"
      >
        Abbrechen
      </button>
      <button
        v-if="isNewEvent"
        class="button is-link"
        v-on:click="addEvent"
        :disabled="invalidEnd || tempEvent.description.length < 1"
      >
        Fertig
      </button>
      <button
        v-if="!isNewEvent"
        class="button is-link"
        v-on:click="editEvent"
        :disabled="invalidEnd || tempEvent.description.length < 1"
      >
        Fertig
      </button>
   </div>
  </div>
</template>

<script lang="ts">
import MonthChooser from "./MonthChooser.vue";
import { store } from "../store";
import { initEvent } from "../data/ZBEvent";
import type { ZBEvent } from "../data/ZBEvent";
import { ref, computed } from "vue";
import type { PropType } from "vue";

export default {
  name: "EventDialogue",
  components: { MonthChooser },
  props: {
    event: { type: Object as PropType<ZBEvent | null> },
  },
  setup() {
    const dimensionOptions = computed(() =>
      [...store.state.data.dimensions].reverse().filter((dim) => dim.visible)
    );
    const tempEvent = ref(initEvent());

    return {
      tempEvent,
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
    title(): string {
      return this.isNewEvent ? "Eintrag erstellen" : "Eintrag bearbeiten";
    },
    invalidEnd(): boolean {
      return (
        this.tempEvent.startDate > this.tempEvent.endDate &&
        this.tempEvent.isInterval &&
        !this.tempEvent.isOpenEnd
      );
    },
  },
  data() {
    return {
      isNewEvent: true,
    };
  },
  methods: {
    addEvent() {
      if (!this.tempEvent.isInterval) {
        this.tempEvent.endDate = this.tempEvent.startDate; // Set the same as start date for non-interval events
      }
      if (this.tempEvent.isOpenEnd) {
        this.tempEvent.endDate = store.state.data.person.endDate;
      }

      store.commit("data/addEvent", this.tempEvent);
      this.$emit("close");
    },
    removeEvent() {
      if (this.event) {
        store.commit("data/removeEvent", this.event.eventId);
      } else {
        console.warn("try to remove newly added event");
      }
      this.$emit("close");
    },
    editEvent() {
      if (!this.tempEvent.isInterval) {
        this.tempEvent.endDate = this.tempEvent.startDate; // Set the same as start date for non-interval events
      }
      if (this.tempEvent.isOpenEnd) {
        this.tempEvent.endDate = store.state.data.person.endDate;
      }

      console.table(this.tempEvent);
      // safe to send currentEvent because it is a clone
      store.commit("data/editEvents", this.tempEvent);
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
  },
  watch: {
    event: function () {
      if (this.event) {
        console.log("prepare EventDialogue for ..." + this.event);
        // shallow clone event data when opening the dialog
        this.tempEvent = Object.assign({}, this.event);
        this.isNewEvent = this.event.eventId === -1;
      }
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
