<template>
  <div class="ttParent">
    <span class="tooltiptext">{{ event.description }}
      <br />
      {{ temporalExtentLabel }}
    </span>
    <div class="ebox" :class="[
      event.isInterval && event.isOpenEnd
        ? 'openEnd'
        : event.isInterval
          ? 'period'
          : 'event',
    ]" @click="showDetails">
      <div class="eventText" :class="{ int: event.isInterval }" :style="`max-width: ${maxWidth}`">
        {{ event.emoji }}
        {{ event.description }}
        <p class="subcontent" v-if="event.notes.length > 0">{{ event.notes }}</p>
      </div>
    </div>
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
    },
    maxWidth() {
      if (this.event.isOpenEnd) {
        return 'calc(85% - 6px)';
      }
      else if (this.labelSpace > 150) {
        return 'calc(' + this.labelSpace + '% + ' + 0.03 * this.labelSpace + 'px)';
      } else {
        return 'calc(100% - 6px)';
      }
    },
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
  position: relative;
  display: block;
  line-height: 1;
  height: 100%;
  margin-right: 1px;
  border-radius: 3px;
}

.openEnd {
  border: 2px solid var(--main-color);
  background: linear-gradient(90deg, white 90%, var(--main-color) 100%);
  box-shadow: #2c3e50;
  border-right: none;
  border-top-right-radius: 100px;
}

.event {
  border-left: 3px solid var(--moment-color);
}

.period{
  background-color: white;
  border: 2px solid var(--main-color);
  box-shadow: #2c3e50;
}

.eventText {
  position: absolute;
  top: 2px;
  left: 0px;
  font-size: smaller;
  line-height: 1.4;
  max-height: calc(100% - 4px);
  // white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0 0 4px;
  background-color: white;
}

.event .eventText {
  padding: 0 2px 0 4px;
}

.subcontent {
  color: #6f6f6f;
  font-size: smaller;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ttParent {
  display: inline-block;
  padding: 2px 0;
  z-index: 2;
}

.ttParent:hover {
  z-index: 10;
}

.ttParent .tooltiptext {
  bottom: calc(100% + 5px);
  visibility: hidden;
  width: 140px;
  background-color: var(--main-color);
  color: var(--text-color);
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
