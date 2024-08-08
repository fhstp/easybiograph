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
        <!-- <EventDisplay :selectedEvent="selectedEvent" @open-edit="editDiv" /> -->
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
import {store} from "../store";
import {DimensionA} from "../data/Dimension";
import {ref} from "vue";
import EventDialogue from "@/components/EventDialogue.vue";
import EventDisplay from "@/components/EventDisplay.vue";

export default {
  name: "EventPopUp",
  components: {
    EventDialogue,
    EventDisplay,
  },
  props: {
    selectedEvent: Object,
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
      // //@ts-ignore
      // this.personYears = store.getters.getTimeline;
      // this.displayPersonYears();
      //@ts-ignore
      this.events = store.getters.getEvents;
      // TODO AR 8 Aug 2024 why filter events? still needed
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
