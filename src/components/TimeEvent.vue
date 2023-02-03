<template>
  <div class="tooltip">
    <span class="tooltiptext"
      >{{ event.description }}
      <br />
      {{
        event.isInterval
          ? event.startDate.substring(0, 4) +
            " - " +
            event.endDate.substring(0, 4)
          : event.startDate
      }}
    </span>
    <div :class="[event.isInterval ? 'period sel' : 'event sel']">
      <p class="eventText">
        {{ event.description }}
      </p>
      <p class="subcontent" v-show="showNotes">
        {{
          event.notes
            ? event.notes.substring(0, 15)
            : event.isInterval
            ? event.startDate.substring(0, 4) +
              " - " +
              event.endDate.substring(0, 4)
            : event.startDate
        }}
      </p>
    </div>
  </div>
</template>

<script>
//import {ZBEvent} from "@/data/ZBEvent.ts";

export default {
  name: "TimeEvent",
  props: {
    event: Object,
    showNotes: Boolean,
  },
  data() {
    return {
      showEditDialogue: false,  // TODO: unused
    };
  },
  mounted() {
    this.setHeight()
  },
  methods: {
    editDiv() {
      this.showEditDialogue = true; // TODO: unused
    },
    setHeight(){
      const notesEvent = document.querySelector(".sel")

      console.log(this.showNotes)
      if(this.showNotes){
        notesEvent.style.height = "41px"
      }else{
        notesEvent.style.height = "25px"
      }
    }
  },
};
</script>

<style scoped lang="scss">
.content {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}

.event {
  display: block;
  background-color: $eventgrey;
  border-left: 3px solid $eventgreen;
  margin: 5px 0;
  border-radius: 3px;
  z-index: 1;
}

.period {
  display: block;
  background-color: $periodblue;
  border: 2px solid $periodborderblue;
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
  z-index: 1;
  margin-right: 1px;
}

.eventText {
  font-size: smaller;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subcontent {
  color: darkgrey;
  font-size: smaller;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tooltip {
  position: absolute;
  display: inline-block;
}

.tooltip .tooltiptext {
  top: -9vh;
  visibility: hidden;
  width: 140px;
  background-color: darkgrey;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  font-size: smaller;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 15%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: darkgrey transparent transparent transparent;
}
</style>
