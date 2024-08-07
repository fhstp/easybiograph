<template>
  <div class="pane">
    <PersonInfo :contrastMode="contrastMode" />
    <TimeAxis :scale="timeScale" :zoomMode="zoomMode" style="z-index: 2" />
    <div class="pane2">
      <div
        v-for="(dim, index) in layout"
        :value="contrastMode ? true : false"
        :key="dim.id"
        :class="{ 'dim': true, 'white-background': index % 2 !== 0, 'grey-background': index % 2 === 0 }"
        :style="`height: ${100 / layout.length}%`"
      >
        <!-- , {'border-style': contrastMode ? 'groove hidden groove hidden' : 'hidden'} -->
        <div
          value="false"
          class="dimensionlabel"
          :class="{
            dim: true,
            'white-background': index % 2 !== 0,
            'grey-background': index % 2 === 0,
          }"
        ></div>
        <div class="dlabel">
          {{ translateDim(dim.label, index) }}
        </div>

        <div
          class="substrate"
          :class="{
            'white-background': index % 2 !== 0,
            'grey-background': index % 2 === 0,
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
            :style="`left: ${mark.x}%; width: ${mark.w}%; top: ${mark.row * 1.8}rem; height: 1.8rem`"
            @click="$emit('display-event', mark.datum)"
            :contrastMode="contrastMode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { scaleLinear } from "d3-scale";
import {computed, getCurrentInstance, onMounted} from "vue";
import { useStore } from "@/store";
import type { ZBEvent } from "@/data/ZBEvent";
import * as d3 from "d3";
import TimeAxis from "./TimeAxis.vue";
import { germanTimeFormat } from "../assets/util";
import PersonInfo from "@/components/PersonInfo.vue";
import TimeEvent from "@/components/TimeEvent.vue";
import {brushX, zoom} from "d3";
import de from "@/de";
import en from "@/en";

interface EventMark {
  datum: ZBEvent;
  x: number;
  /** width of the time interval */
  w: number;
  /** available width to the next event */
  spx: number;
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
const props = defineProps(['contrastMode', 'zoomMode']);

onMounted(() => {
  initializeBrushing();
});

const contrastMode = computed(() => props.contrastMode);
const zoomMode = computed(() => props.zoomMode)

const initializeBrushing = () => {
  const dimensions = store.state.data.dimensions;

  dimensions.forEach((dim) => {
    const brushingElement = d3.select(`#dataviz_brushing1D_${dim.id}`);

    if (!brushingElement.empty()) {

      const brush = d3
          .brushX<SVGSVGElement>()
          .extent([[0, 0], [5000, 300]])
          .on('start brush end', (event) => {
            if (event.sourceEvent && event.sourceEvent.type === 'mousedown') {
              const timePane = document.querySelector('.pane');
              const rect = timePane?.getBoundingClientRect();
              if (rect) {
                const clickX = event.sourceEvent.clientX - rect.left;
                const timeAxisWidth = rect.width;
                pressedDate = calculateDateFromClick(clickX, timeAxisWidth);
              }
            } else if (event.sourceEvent && event.sourceEvent.type === 'mouseup') {
              const timePane = document.querySelector('.pane');
              const rect = timePane?.getBoundingClientRect();
              if (rect) {
                const clickX = event.sourceEvent.clientX - rect.left;
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
              /*
              const element = d3.select<SVGSVGElement, unknown>(brushingElement).call(brush as any);
              brush.move(element as any, null);
               */
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

  const buffer = sortedDimensions.map((dim, i) => {
    return { id: dim.id, label: dim.title, marks: [] as EventMark[], rows: 0, fullRows: 0 };
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
        // collapsed: false,
      };
      rightEventbyRow[eventRow] = newMark;
      dim.marks.push(newMark);
    });
  });


  return buffer;
});
function translateDim(title:string, index:number) {
  const translationKeys = ["family", "living", "education", "work", "health", "treatment"];
  if (index < 6) {
    const lang = store.state.settings.language;
    const trans: any = lang === "de" ? de :  en;
    return trans[translationKeys[index]];
  }
  return title;
};
</script>

<style scoped lang="scss">

.grey-background[value="false"] {
  background-color: #f2f2f2;
}
.grey-background[value="true"] {
  background-color: #f2f2f2;
  border-style: groove hidden groove hidden;
  border-width: 2px;
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
