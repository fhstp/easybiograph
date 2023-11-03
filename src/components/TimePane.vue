<template>
  <div class="pane">
    <PersonInfo />
    <TimeAxis :scale="timeScale" />
    <div class="dim" v-for="dim in layout" :key="dim.id">
      <div class="dlabel">
        {{ dim.label }}
      </div>
      <div class="substrate" ref="substrateRef">
        <TimeEvent
          v-for="mark in dim.marks"
          :key="mark.datum.eventId"
          :event="mark.datum"
          class="events"
          :style="`left: ${mark.x1}%; width: ${mark.x2}%; top: ${mark.row * 1.5}rem`"
          @click="$emit('displayEvent', mark.datum)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { scaleLinear } from "d3-scale";
import { computed, ref, watch, onMounted } from "vue";
import { useStore } from "@/store";
import type { ZBEvent } from "@/data/ZBEvent";
import * as d3 from "d3";
import { DimensionA } from "@/data/Dimension";
import TimeAxis from "./TimeAxis.vue";
import { germanTimeFormat } from "../assets/util";
import PersonInfo from "@/components/PersonInfo.vue";
import TimeEvent from "@/components/TimeEvent.vue";

interface EventMark {
  datum: ZBEvent;
  x1: number;
  x2: number;
  row: number;
  // collapsed: boolean;
}

interface DimensionLayout {
  id: number;
  label: string;
  marks: EventMark[];
  rows: number;
  fullRows: number;
}

// interface Layout {
//   marks: Map<string, EventMark[]>;
//   rows
// }

const store = useStore();

// tell d3 to use German months in the time axis
// @ts-ignore
d3.timeFormatDefaultLocale(germanTimeFormat);

const timeScale = computed(() => {
  const leftDate = new Date(store.state.data.person.birthDate);
  const rightDate = new Date(store.state.data.person.endDate);
  return d3.scaleUtc().domain([leftDate, rightDate]).range([0, 100]);
});

// n.b. d3.axisTop() does not work because it renders in SVG

// TODO update the general layout manually (by resizing dimensions) or on demand

const layout = computed((): Array<DimensionLayout> => {
  const dimensions = store.state.data.dimensions;

  // Filter dimensions with visible set to true
  const filteredDimensions = dimensions.filter(dim => dim.visible);

  // Create a sorted copy of the filtered dimensions array
  const sortedDimensions = [...filteredDimensions].reverse();

  const buffer = sortedDimensions.map((dim, i) => {
    return { id: dim.id, label: dim.title, marks: [] as EventMark[], rows: 0, fullRows: 0 };
  });


  // console.log(buffer);

  // sort & group
  // TODO filter visible events (possibly as a vuex getter)
  // TODO use interval tree for filter and sort <https://www.npmjs.com/package/@flatten-js/interval-tree> or <https://github.com/ieg-vienna/TimeBench/blob/master/src/timeBench/data/util/IntervalTree.java>
  const visibleEvents = d3.group(
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    store.state.data.events.sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    ),
    // store.state.data.events,
    (d) => d.dimensionId
  );
  // console.log(visibleEvents);

  buffer.forEach((dim) => {
    const eventsInDim = visibleEvents.get(dim.id) || [];
    // keep track how far rows inside a dimension are occupied
    const rowOccup: number[] = [];
    eventsInDim.forEach((datum) => {
      const leftDate = new Date(datum.startDate);
      const nextDate = new Date(datum.endDate);
      if (datum.endDate.length < 8) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setDate(nextDate.getDate() + 1);
      }

      const leftX = timeScale.value(leftDate);
      const rightX = timeScale.value(nextDate);
      // in case of short events --> make space at least for 2% of substrate width (guessed minimum)
      const rightCorrX = leftX + Math.max(rightX - leftX, 2);
      let eventRow = 0;

      for (;;) {
        if (rowOccup.length == eventRow) {
          rowOccup.push(rightCorrX);
          break;
        } else if (rowOccup[eventRow] <= leftX) {
          rowOccup[eventRow] = rightCorrX;
          break;
        } else {
          eventRow++;
        }
      }

      dim.marks.push({
        datum,
        x1: leftX,
        x2: rightX - leftX,
        row: eventRow,
        // collapsed: false,
      });
    });
  });

  return buffer;
});
</script>

<style scoped lang="scss">
div.pane {
  // margin-top: 3.25rem; /* TODO handle top panels better */
  flex-grow: 1;
  background: lightpink;
  // bottom: 0px;
}

div.dim {
  width: 100%;
  height: 14.2%;
  position: relative;
  display: inline-block;
}

div.dlabel {
  // flex: auto 0 0 ;
  position: relative;
  top: calc(50% - 0.5rem);
  width: $dimensionWidth;
  text-align: center;
}

div.substrate {
  // flex: auto 1 1;
  top: 0;
  left: $dimensionWidth;
  right: 0;
  height: 100%;
  position: absolute;
  border-left: 1px solid black;
  background: lightcyan;
}

div.events {
  position: absolute;

  // from TimeTable
  cursor: pointer !important;
}
</style>
