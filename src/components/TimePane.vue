<template>
  <div class="pane">
    <TimeAxis :scale="timeScale" />
    <div>hallo welt</div>
    <div v-for="dim in layout" :key="dim.id">
      <div>
        {{ dim.label }}
      </div>
      <div v-for="mark in dim.marks" :key="mark.datum.eventId">
        &nbsp; {{ mark.datum.description }} - {{ mark.x1 }}
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
import { germanTimeFormat } from "@/assets/util";

interface EventMark {
  datum: ZBEvent;
  x1: number;
  x2: number;
  row: number;
  collapsed: boolean;
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

const layout = computed((): Array<DimensionLayout> => {
  // prepare data structure based on given dimensions
  const buffer = DimensionA.map((d, i): DimensionLayout => {
    return { id: i, label: d, marks: [], rows: 0, fullRows: 0 };
  });
  console.log(buffer);

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
  console.log(visibleEvents);

  buffer.forEach((dim) => {
    const eventsInDim = visibleEvents.get(dim.id) || [];
    eventsInDim.forEach((datum) => {
      const leftDate = new Date(datum.startDate);
      const nextDate = new Date(datum.endDate);
      if (datum.endDate.length < 8) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setDate(nextDate.getDate() + 1);
      }

      dim.marks.push({
        datum,
        x1: timeScale.value(leftDate),
        x2: timeScale.value(nextDate),
        row: 0,
        collapsed: false,
      });
    });
  });

  return buffer;
});
</script>

<style scoped lang="scss">
div.pane {
  margin-top: 3.25rem; /* TODO handle top panels better */
  background: antiquewhite;
}
</style>
