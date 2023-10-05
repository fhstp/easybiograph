<template>
  <EventDialogue
      v-show="showEditDialogue"
      @close="showEditDialogue = false"
      :selectedEvent="clickedEvent"
      :new-dia="false"
      :event="currentEvent"
      title="Eintrag bearbeiten"
      @reload="loadEvents"/>


  <!-- Modal to edit Events-->
  <div id="modal-event" class="modal">
    <div class="modal-background" @click="closeModal"></div>

    <div class="modal-content">
      <div class="box">
        <EventDisplay :event="clickedEvent" @open-edit="editDiv" />
      </div>
    </div>

    <button
        class="modal-close is-large"
        aria-label="close"
        @click="closeModal"
    ></button>
  </div>
</template>

<script>
import TimeEvent from "./TimeEvent";
import EventDisplay from "./EventDisplay";
import EventDialogue from "./EventDialogue";
import {store} from "../store";
import {DimensionA} from "../data/Dimension";
import {ref} from "vue";

export default {
  name: "EventPopUp",
  components: {
    TimeEvent,
    EventDisplay,
    EventDialogue,
  },
  data() {
    return {
      displayYears: {},
      filteredEvents: [],
      clickedEvent: {},
      showEditDialogue: false,
      currentEvent: {},
    };
  },
  methods: {
    loadEvents() {
      //@ts-ignore
      this.personYears = store.getters.getTimeline;
      this.displayPersonYears();
      //@ts-ignore
      this.events = store.getters.getEvents;
      const dims = ref(DimensionA);
      for (let i = 0; i < DimensionA.length; i++) {
        //@ts-ignore
        this.filteredEvents.push(this.filterEvents(dims[i]));
      }
    },
    closeModal() {
      const modal = document.querySelector("#modal-event");
      if (modal) modal.classList.remove("is-active");
    },
    editDiv() {
      this.closeModal();
      //@ts-ignore
      this.showEditDialogue = true;
    },
  },
}
</script>

<style scoped>

</style>