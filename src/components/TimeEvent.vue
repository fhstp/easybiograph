<template>
  <div class="tooltip">
    <span class="tooltiptext">{{ event.description }}
        <br>
          {{ event.isInterval ?
              event.startDate.substring(0, 4) +
              " - " +
              event.endDate.substring(0, 4)
              : event.startDate }}
      </span>
    <div :class="[event.isInterval ? 'period' : 'event']" id="contentEvent" >

      <p class="eventText">
        {{ event.description }}
      </p>
      <p class="subcontent">
        {{
          event.notes
            ? event.notes.substring(0, 15) + "..."
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
  },
  data(){
    return {
      showEditDialogue: false,
    }
  },
  methods:{
    editDiv(event) {
      this.showEditDialogue = true;
    },
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
}

.period {
  display: block;
  background-color: $periodblue;
  border: 2px solid $periodborderblue;
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
}

.eventText {
  font-size: smaller;
}

.subcontent {
  color: darkgrey;
  font-size: smaller;
}



.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  top: -9vh;
  visibility: hidden;
  width: 120px;
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
