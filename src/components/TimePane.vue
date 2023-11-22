<template>
  <div class="pane">
    <PersonInfo />
    <TimeAxis :scale="timeScale" style="z-index: 2" />
    <div
        v-for="(dim, index) in layout"
        :key="dim.id"
        :class="{ 'dim': true, 'white-background': index % 2 !== 0, 'grey-background': index % 2 === 0 }"
    >
      <div class="dlabel">
        {{ dim.label }}
      </div>
      <div class="substrate"
           :class="{ 'white-background': index % 2 !== 0, 'grey-background': index % 2 === 0 }"
           ref="substrateRef"
           @mousedown="($event) => handleMousePress($event, dim)"
           @mouseup="handleMouseRelease"
           @contextmenu.prevent="($event) => handleRightClick($event, dim)"
      >
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
import { computed } from "vue";
import { useStore } from "@/store";
import type { ZBEvent } from "@/data/ZBEvent";
import * as d3 from "d3";
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

const calculateDateFromClick = (clickX: number, axisWidth: number): Date | null => {
  const percentClicked = (clickX / axisWidth) * 100; // Calculate percentage clicked on the TimeAxis

  const leftDate = new Date(store.state.data.person.birthDate);
  const rightDate = new Date(store.state.data.person.endDate);

  const timeScale = d3.scaleUtc().domain([leftDate, rightDate]).range([0, 100]);

  const clickedDate = timeScale.invert(percentClicked);
  return clickedDate;
};

let isMouseDown = false;

const handleMousePress = (event: MouseEvent, dimension: DimensionLayout) => {
  isMouseDown = true;
  handleRightClick(event, dimension);
};

const handleMouseRelease = () => {
  isMouseDown = false;
};

const handleRightClick = (event: MouseEvent, dimension: DimensionLayout) => {
  event.preventDefault();

  const timePane = document.querySelector('.pane');
  const rect = timePane?.getBoundingClientRect();

  if (rect) {
    const clickX = event.clientX - rect.left;
    const timeAxisWidth = rect.width;

    const clickedDate = calculateDateFromClick(clickX, timeAxisWidth);
    if (isMouseDown) {
      console.log('Pressed date:', clickedDate);
    } else {
      console.log('Released date:', clickedDate);
      console.log('Clicked dimension:', dimension.label);
    }
  }
};

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

.grey-background {
  background-color: #f2f2f2;
}

.white-background {
  background-color: #fcfcfc;
}

div.events {
  position: absolute;
  cursor: pointer !important;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -100vh;
    bottom: 1vh;
    width: 2px;
    background-color: transparent;
    transition: background-color 0.3s ease; /* Transition effect for color change */
    z-index: 1;
  }

  /* Left line */
  &::before {
    left: -1px;
  }

  /* Right line */
  &::after {
    right: -0.5px;
  }

  &:hover::before,
  &:hover::after {
    background-color: forestgreen;
  }
}


div.pane {
  // margin-top: 3.25rem; /* TODO handle top panels better */
  flex-grow: 1;
  background: #edf6f9;
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
}

div.events {
  position: absolute;

  // from TimeTable
  cursor: pointer !important;
}
</style>
