<template>
  <div class="pane">
    <PersonInfo/>
    <TimeAxis :scale="timeScale" :zoomMode="zoomMode" style="z-index: 2"/>
    <div class="pane2">
      <div
        v-for="(dim, index) in layout"
        :value="isBlackMode ? true : false"
        :key="dim.id"
        :class="{ 'dim': true, 'white-background': store.state.settings.colorMode == 'black-mode' ? true : index % 2 !== 0, 'grey-background': store.state.settings.colorMode == 'black-mode' ? false : index % 2 === 0 }"
        :style="`height: ${100 / layout.length}%;`"
      >
        <!-- , {'border-style': contrastMode ? 'groove hidden groove hidden' : 'hidden'} -->
        <div
          value="false"
          class="dimensionlabel"
          :class="{
            dim: true,
            'white-background': store.state.settings.colorMode == 'black-mode' ? true : index % 2 !== 0,
            'grey-background': store.state.settings.colorMode == 'black-mode' ? false : index % 2 === 0,
            'border-enabled': store.state.settings.colorMode == 'black-mode',
          }"
        ></div>
        <div class="dlabel">
          {{ translateDim(dim.label, index) }}
        </div>

        <div
          class="substrate"
          :class="{
            'white-background': store.state.settings.colorMode == 'black-mode' ? true : index % 2 !== 0,
            'grey-background': store.state.settings.colorMode == 'black-mode' ? false : index % 2 === 0,
            'border-enabled': store.state.settings.colorMode == 'black-mode',
        }"
          ref="substrateRef"
        >
          <!-- SVG container for brushing -->
          <svg :id="'dataviz_brushing1D_' + dim.id" class="brush-container"></svg>

          <TimeEvent
            v-for="mark in dim.marks"
            :key="mark.datum.eventId"
            :event="mark.datum"
            :labelSpace="(100 * mark.spx) / mark.w"
            class="events"
            :style="`left: ${mark.x}%; width: ${mark.w}%; top: ${mark.row * mark.height}%; height: ${mark.height}%`"
            @click="$emit('display-event', mark.datum)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { scaleLinear } from "d3-scale";
import {computed, onMounted} from "vue";
import { useStore } from "@/store";
import type { ZBEvent } from "@/data/ZBEvent";
import { translateDim } from "@/data/Dimension";
import * as d3 from "d3";
import TimeAxis from "./TimeAxis.vue";
import { germanTimeFormat } from "../assets/util";
import PersonInfo from "@/components/PersonInfo.vue";
import TimeEvent from "@/components/TimeEvent.vue";
// import {brushX, zoom} from "d3";

interface EventMark {
  datum: ZBEvent;
  x: number;
  /** width of the time interval */
  w: number;
  /** available width to the next event */
  spx: number;
  row: number;
  height: number;
  // collapsed: boolean;
}

interface DimensionLayout {
  id: number;
  label: string;
  marks: EventMark[];
  rows: number;
  // fullRows: number;
}

// interface Layout {
//   marks: Map<string, EventMark[]>;
//   rows
// }

const store = useStore();
const props = defineProps(['isBlackMode', 'zoomMode']);

onMounted(() => {
  initializeBrushing();
});

const isBlackMode = computed(() => props.isBlackMode);
const zoomMode = computed(() => props.zoomMode);


const initializeBrushing = () => {
  const dimensions = store.state.data.dimensions;

  dimensions.forEach((dim) => {
    const brushingElement = d3.select(`#dataviz_brushing1D_${dim.id}`);

    if (!brushingElement.empty()) {

      const brush = d3
          .brushX<SVGSVGElement>()
          .extent([[0, 0], [5000, 300]])
          .on('start brush end', (event) => {
            const sourceEvent = event.sourceEvent;

            if (sourceEvent && (sourceEvent.type === 'mousedown' || sourceEvent.type === 'touchstart')) {
              const timePane = document.querySelector('.pane');
              const rect = timePane?.getBoundingClientRect();

              // Handle touch events
              const clientX = sourceEvent.type === 'touchstart'
                  ? sourceEvent.touches[0].clientX
                  : sourceEvent.clientX;

              if (rect) {
                const clickX = clientX - rect.left;
                const timeAxisWidth = rect.width;
                pressedDate = calculateDateFromClick(clickX, timeAxisWidth);
              }

            } else if (sourceEvent && (sourceEvent.type === 'mouseup' || sourceEvent.type === 'touchend')) {
              const timePane = document.querySelector('.pane');
              const rect = timePane?.getBoundingClientRect();

              const clientX = sourceEvent.type === 'touchend'
                  ? sourceEvent.changedTouches[0].clientX
                  : sourceEvent.clientX;

              if (rect) {
                const clickX = clientX - rect.left;
                const timeAxisWidth = rect.width;
                releasedDate = calculateDateFromClick(clickX, timeAxisWidth);

                if (pressedDate && releasedDate) {
                  console.log('startDate:', pressedDate);
                  console.log('endDate:', releasedDate);

                  emits("open-edit", {
                    startDate: pressedDate,
                    endDate: releasedDate,
                    dimensionId: dim.id,
                  });
                  brushingElement.call(brush.clear as any);

                  pressedDate = null;
                  releasedDate = null;
                }
              }
            }
          });

      brushingElement.call(brush as any);
    }
  });
};


/*const initializeZoom = () => {
  const dimensions = store.state.data.dimensions;

  dimensions.forEach((dim) => {

    d3.select(`#dataviz_brushing1D_${dim.id}`)
        .transition()
        .call(zoom.scaleBy, 0.5);
  });
};*/

// @ts-ignore
d3.timeFormatDefaultLocale(germanTimeFormat);

let timeScale: any = null;

if(store.state.data.zoom.birthDate.length >= 1){
  timeScale = computed(() => {
    const leftDate = new Date(store.state.data.zoom.birthDate);
    const rightDate = new Date(store.state.data.zoom.endDate);
    return d3.scaleUtc().domain([leftDate, rightDate]).range([0, 100]);
  });
} else {
  timeScale = computed(() => {
    const leftDate = new Date(store.state.data.person.birthDate);
    const rightDate = new Date(store.state.data.person.endDate);
    return d3.scaleUtc().domain([leftDate, rightDate]).range([0, 100]);
  });
}

const calculateDateFromClick = (clickX: number, axisWidth: number): string | null => {

  clickX = clickX - 130
  axisWidth = axisWidth - 130

  const percentClicked = (clickX / axisWidth) * 100;

  console.log("clickX " + clickX);
  console.log("axisWidth " + axisWidth)

  const clickedDate = timeScale.value.invert(percentClicked);

  if (clickedDate instanceof Date) {
    const formattedDate = `${clickedDate.getFullYear()}-${String(clickedDate.getMonth() + 1).padStart(2, '0')}-${String(clickedDate.getDate()).padStart(2, '0')}`;
    return formattedDate;
  }

  return null;
};

let isMouseDown = false;


window.addEventListener('mouseup', () => {
  if (isMouseDown) {
    isMouseDown = false;
    //lineLength = 0;

    handleMouseRelease();
  }
});

const handleMouseRelease = () => {
  isMouseDown = false;
};

const emits = defineEmits(["open-edit", "display-event"]);

let pressedDate: string | null = null;
let releasedDate: string | null = null;


// n.b. d3.axisTop() does not work because it renders in SVG

// TODO update the general layout manually (by resizing dimensions) or on demand

const layout = computed((): Array<DimensionLayout> => {
  const dimensions = store.state.data.dimensions;

  // Filter dimensions with visible set to true
  const filteredDimensions = dimensions.filter(dim => dim.visible);

  // Create a sorted copy of the filtered dimensions array
  const sortedDimensions = [...filteredDimensions].reverse();

  const buffer = sortedDimensions.map((dim) => {
    return { id: dim.id, label: dim.title, marks: [] as EventMark[], rows: 0 };
  });


  // console.log(buffer);

  // sort & group
  // TODO filter visible events (possibly as a vuex getter)
  // TODO use interval tree for filter and sort <https://www.npmjs.com/package/@flatten-js/interval-tree> or <https://github.com/ieg-vienna/TimeBench/blob/master/src/timeBench/data/util/IntervalTree.java>
  const visibleEvents = d3.group(
    store.state.data.events,
    (d) => d.dimensionId
  );
  // console.log(visibleEvents);

  buffer.forEach((dim) => {
    const eventsInDim = visibleEvents.get(dim.id) || [];
    eventsInDim.sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    );
    // keep track how far to the right rows inside a dimension are occupied
    const rowOccup: number[] = [];
    const rightEventbyRow: (EventMark | null)[] = [];

    // buffer events that are overlapping to postpone their vertical layout
    let cluster = [] as EventMark[];
    let maxRow = 0;

    eventsInDim.forEach((datum) => {
      const leftDate = new Date(datum.startDate);
      const nextDate = new Date(datum.endDate);
      // reset hours to midnight avoids strange summer time bugs
      nextDate.setHours(0);
      if (datum.endDate.length < 8) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setDate(nextDate.getDate() + 1);
      }

      const leftX = timeScale.value(leftDate);
      const rightX = timeScale.value(nextDate);
      // in case of short events --> make space at least for 2% of substrate width (guessed minimum)
      const rightCorrX = leftX + Math.max(rightX - leftX, 2);

      // check if a new cluster starts
      if (rowOccup.every(v => v <= leftX)) {
        // distribute vertical space for this cluster
        for (const cEvent of cluster) {
          cEvent.height = Math.floor(100 / (maxRow + 1));
        }
        // limit labels to start of next cluster
        for (const rEvent of rightEventbyRow) {
          if (rEvent !== null) {
            rEvent.spx = leftX - rEvent.x;
          }
        }
        rightEventbyRow.fill(null);
        // console.log("end block");
        // console.log(cluster);
        cluster = [];
        maxRow = 0;
      }

      let eventRow = 0;
      for (;;) {
        if (rowOccup.length == eventRow) {
          // row occupation array full --> start new row & occupy
          rowOccup.push(rightCorrX);
          rightEventbyRow.push(null);
          break;
        } else if (rowOccup[eventRow] <= leftX) {
          // current row is free --> take & occupy
          rowOccup[eventRow] = rightCorrX;
          break;
        } else {
          // try next row
          eventRow++;
        }
      }

      // remember the maximum row
      dim.rows = Math.max(dim.rows, eventRow);

      // vertical layout
      maxRow = Math.max(maxRow, eventRow);

      // update space for label for previous event in this row
      const prevMarkInRow = rightEventbyRow[eventRow];
      if (prevMarkInRow !== null) {
        prevMarkInRow.spx = leftX - prevMarkInRow.x;
      }

      const newMark = {
        datum,
        x: leftX,
        w: Math.max(rightX - leftX, 0.5),
        spx: 100 - leftX, // default space is rest to 100%
        row: eventRow,
        height: 50,
        // collapsed: false,
      };
      rightEventbyRow[eventRow] = newMark;
      dim.marks.push(newMark);
      cluster.push(newMark);
    });

    for (const cEvent of cluster) {
      cEvent.height = Math.floor(100 / (maxRow + 1));
    }
    // console.log("absolute end block");
    // console.log(cluster);
  });


  return buffer;
});
</script>

<style scoped lang="scss">

.grey-background {
  background-color: #e6e6e6;
}

.white-background {
  background-color: #fcfcfc;
  &.border-enabled {
    border-style: groove groove groove hidden;
    border-width: 1px;
  }
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
    background-color: var(--main-color);
  }
}


div.pane {
  // margin-top: 3.25rem; /* TODO handle top panels better */
  flex-grow: 1;
  background: #edf6f9;
  // bottom: 0px;
  display: flex;
  flex-direction: column;
}

div.pane2 {
  flex-grow: 1;
}

div.dim {
  width: 100%;
  position: relative;
  display: inline-block;
}

div.dlabel {
  // flex: auto 0 0 ;
  position: relative;
  top: calc(50% - 0.5rem);
  width: $dimensionWidth;
  text-align: center;
  z-index: 6;
}

div.dimensionlabel {
  top: 0;
  width: $dimensionWidth;
  left: 1px;
  height: 100%;
  position: absolute;
  border-right: 1px solid black;
  z-index: 5;
}

div.substrate {
  // flex: auto 1 1;
  top: 0;
  left: $dimensionWidth;
  right: 0;
  height: 100%;
  position: absolute;

}

div.events {
  position: absolute;

  // from TimeTable
  cursor: pointer !important;
}

div.line {
  position: absolute;
  border-left: 2px solid red;
  pointer-events: none;
  z-index: 10;
}

svg.brush-container {
  width: 100%;
  height: 100%;
}
</style>
