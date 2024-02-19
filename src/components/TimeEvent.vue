<template>
  <div class="ttParent">
    <span class="tooltiptext" style="z-index: 7"
      >{{ event.description }}
      <br />
      {{

      event.isOpenEnd ?
          event.startDate.substring(0, 4) +
          " - " + "Offenes Ende"
          : event.isInterval
            ? event.startDate.substring(0, 4) +
              " - " +
              event.endDate.substring(0, 4)
              : event.startDate.substring(8, 10) > 0
                  ? event.startDate.substring(8, 10) +
                  "." +
                  event.startDate.substring(5, 7) +
                  "." +
                  event.startDate.substring(0, 4)
                  : event.startDate.substring(5, 7) +
                  "." +
                  event.startDate.substring(0, 4)
      }}
    </span>
    <div :value="contrastMode ? true : false" :class="[event.isInterval && event.isOpenEnd ? 'openEnd sel' : event.isInterval ? 'period sel' : 'event sel']" @click="showDetails">
      <p class="eventText">
        {{ event.description }}
      </p>
      <p class="subcontent" v-show="showNotes">
        {{
          event.notes
            ? event.notes
            : event.isOpenEnd
                  ? event.startDate.substring(0, 4) + " - " + "Offenes Ende"
              : event.isInterval
              ? event.startDate.substring(0, 4) +
                " - " +
                event.endDate.substring(0, 4)
              : event.startDate.substring(8, 10) > 0
                ? event.startDate.substring(8, 10) +
                  "." +
                  event.startDate.substring(5, 7) +
                  "." +
                  event.startDate.substring(0, 4)
                : event.startDate.substring(5, 7) +
                  "." +
                  event.startDate.substring(0, 4)
        }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeEvent",
  props: {
    event: Object,
    showNotes: Boolean,
    contrastMode: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    this.setHeight();
  },
  methods: {
   /* handleTimeEventClick() {
      this.$emit('timeEventClick', this.event); // Emit a custom event with the event data
    },

    */
    setHeight() {
      const notesEvent = document.querySelector(".sel");

      if (this.showNotes) {
        notesEvent.style.height = "2.5em";
      } else {
        notesEvent.style.height = "1.25em";
      }
    },
  },
};
</script>

<style scoped lang="scss">

.openEnd[value="false"] {
  display: block;
  border: 2px solid $periodborderblue;
  background: linear-gradient(90deg, rgba(230,242,248,1) 0%, rgba(175,211,227,1) 90%, rgba(137,182,203,1) 100%);
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
  z-index: 1;
  margin-right: 1px;
  border-right: none;
  border-top-right-radius: 100px;


}

.content[value="false"] {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}

.event[value="false"] {
  display: block;
  background-color: $eventgrey;
  border-left: 3px solid $eventgreen;
  margin: 5px 0;
  border-radius: 3px;
  z-index: 1;
  width: 50px;
}

.period[value="false"] {
  display: block;
  background-color: $periodblue;
  border: 2px solid $periodborderblue;
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
  z-index: 1;
  margin-right: 1px;
}

.openEnd[value="true"] {
  display: block;
  border: 1.5px solid #488193;
  background: linear-gradient(90deg, rgba(230,242,248,1) 0%, rgba(175,211,227,1) 90%, rgba(137,182,203,1) 100%);
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
  z-index: 1;
  margin-right: 1px;
  border-right: none;
  border-top-right-radius: 100px;


}

.content[value="true"] {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}

.event[value="true"] {
  display: block;
  background-color: $eventgrey;
  border-left: 3px solid #FFA500;
  margin: 5px 0;
  border-radius: 3px;
  z-index: 1;
  width: 50px;
}

.period[value="true"] {
  display: block;
  background-color: $periodblue;
  border: 1.5px solid #488193;
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

.ttParent {
  display: inline-block;
}

.ttParent .tooltiptext {
  top: -3.7em;
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

.ttParent:hover .tooltiptext {
  visibility: visible;
}
.ttParent .tooltiptext::after {
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
