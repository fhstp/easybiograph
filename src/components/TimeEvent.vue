<template>
  <div class="ttParent">
    <span class="tooltiptext" style="z-index: 7"
      >{{ event.description }}
      <br />
      {{ temporalExtentLabel }}
    </span>
    <div
      :value="contrastMode ? true : false"
      class="ebox"
      :class="[
        event.isInterval && event.isOpenEnd
          ? 'openEnd'
          : event.isInterval
          ? 'period'
          : 'event',
      ]"
      @click="showDetails"
    >
      &nbsp;
    </div>
    <p
      class="eventText"
      :class="{ int: event.isInterval }"
      :style="`max-width: ${labelSpace}%`"
    >
      {{ event.description }}
    </p>
    <p class="subcontent" v-show="showNotes">
      {{ event.notes ? event.notes : temporalExtentLabel }}
    </p>
  </div>
</template>

<script>
import { format } from "../assets/util";
import { store } from "@/store";
import de from "@/de";
import en from "@/en";

export default {
  name: "TimeEvent",
  props: {
    event: Object,
    labelSpace: Number,
    showNotes: Boolean,
    contrastMode: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    temporalExtentLabel() {
      // `this` points to the component instance
      const start = format(this.event.startDate);

      return this.event.isOpenEnd
        ? start + " - " + this.t("toopen")
        : this.event.isInterval
        ? start + " - " + format(this.event.endDate)
        : this.event.startDate.substring(8, 10) > 0
        ? this.event.startDate.substring(8, 10) + ". " + start
        : start;
    }
  },
  mounted() {
    // this.setHeight();
  },
  methods: {
    /* handleTimeEventClick() {
      this.$emit('timeEventClick', this.event); // Emit a custom event with the event data
    },

    */
    /*
    setHeight() {
      const notesEvent = document.querySelector(".ebox");

      if (this.showNotes) {
        notesEvent.style.height = "2.5em";
      } else {
        notesEvent.style.height = "1.25em";
      }
    },
    */
    t(prop) {
      const lang = store.state.settings.language;
      const trans = lang === "de" ? de :  en;
      return trans[prop];
    }
  },
};
</script>

<style scoped lang="scss">
.ebox {
  display: block;
  line-height: 1;
  height: 100%;
  margin-right: 1px;
  border-radius: 3px;
}

.openEnd[value="false"] {
  border: 2px solid $periodborderblue;
  background: linear-gradient(90deg, rgba(230,242,248,1) 0%, rgba(175,211,227,1) 90%, rgba(137,182,203,1) 100%);
  box-shadow: #2c3e50;
  border-right: none;
  border-top-right-radius: 100px;
}

.event[value="false"] {
  border-left: 3px solid $eventgreen;
}

.period[value="false"] {
  background-color: $periodblue;
  border: 2px solid $periodborderblue;
  box-shadow: #2c3e50;
}

.openEnd[value="true"] {
  border: 1.5px solid #488193;
  background: linear-gradient(90deg, rgba(230,242,248,1) 0%, rgba(175,211,227,1) 90%, rgba(137,182,203,1) 100%);
  box-shadow: #2c3e50;
  border-right: none;
  border-top-right-radius: 100px;
}

.event[value="true"] {
  background-color: $eventgrey;
  border-left: 3px solid #FFA500;
  width: 50px;
}

.period[value="true"] {
  background-color: $periodblue;
  border: 1.5px solid #488193;
  box-shadow: #2c3e50;
}

/*
.content[value="false"] {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}

.content[value="true"] {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}
*/

.eventText {
  position: absolute;
  top: 5px;
  left: 3px;
  font-size: smaller;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 2px 0 2px;
}

.eventText.int {
  background: $periodblue;
  padding: 0 2px 0 1px;
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
  padding: 2px 0;
}

.ttParent .tooltiptext {
  bottom: calc(100% + 5px);
  visibility: hidden;
  width: 140px;
  background-color: darkgrey;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  font-size: smaller;
  position: absolute;
}

.ttParent:hover .tooltiptext {
  visibility: visible;
}
.ttParent .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 100%;
  left: 15%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: darkgrey transparent transparent transparent;
}
</style>
