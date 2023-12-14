<template>
  <div class="pane">
    <PersonInfo />
    <TimeAxis :scale="timeScale" style="z-index: 2" />
    <div class="dimpane" ref="verticalRef">
    <div
        v-for="(dim, index) in packedLayout"
        :key="dim.id"
        :class="{ 'dim': true, 'white-background': index % 2 !== 0, 'grey-background': index % 2 === 0 }"
    >
      <div class="dlabel">
        {{ dim.label }}
      </div>

      <div
          class="substrate"
          :class="{
          'white-background': index % 2 !== 0,
          'grey-background': index % 2 === 0
        }"
          ref="substrateRef"
      >
        <!-- SVG container for brushing -->
        <svg :id="'dataviz_brushing1D_' + dim.id" class="brush-container" style="width: 100%"></svg>


        <TimeEvent
            v-for="mark in dim.marks"
            :key="mark.datum.eventId"
            :event="mark.datum"
            class="events"
            :style="`left: ${mark.x1}%; width: ${mark.x2}%; top: ${mark.row * ROW_HEIGHT}px`"
            @click="$emit('displayEvent', mark.datum)"
        />
      </div>
    </div>
    </div>{{layout.length}}
  </div>
</template>

<script setup lang="ts">
// import { scaleLinear } from "d3-scale";
import {computed, ref, getCurrentInstance, onMounted, onBeforeUnmount} from "vue";
import { useStore } from "@/store";
import type { ZBEvent } from "@/data/ZBEvent";
import * as d3 from "d3";
import TimeAxis from "./TimeAxis.vue";
import { debounce, germanTimeFormat } from "../assets/util";
import PersonInfo from "@/components/PersonInfo.vue";
import TimeEvent from "@/components/TimeEvent.vue";
import {brushX} from "d3";

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
  /** events with position, sorted by their start */
  marks: EventMark[];
  /** how many rows are needed to show all events without overlapping  */
  minRows: number;
  fullRows: number;
  height: number;
}

// interface Layout {
//   marks: Map<string, EventMark[]>;
//   rows
// }

const ROW_HEIGHT = 24;

const store = useStore();

onMounted(() => {
  initializeBrushing();
});

const initializeBrushing = () => {
  const dimensions = store.state.data.dimensions;

  dimensions.forEach((dim) => {
    const brushingElement = document.getElementById(
        `dataviz_brushing1D_${dim.id}`
    ) as SVGSVGElement | null;

    if (brushingElement) {

      const brush = d3
          .brushX<SVGSVGElement>()
          .extent([[0, 0], [2000, 300]])
          .on('start brush end', (event) => {
            if (event.sourceEvent.type === 'mousedown') {
              const timePane = document.querySelector('.pane');
              const rect = timePane?.getBoundingClientRect();
              if (rect) {
                const clickX = event.sourceEvent.clientX - rect.left;
                const timeAxisWidth = rect.width;
                pressedDate = calculateDateFromClick(clickX, timeAxisWidth);
              }
            } else if (event.sourceEvent.type === 'mouseup') {
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

                  pressedDate = null;
                  releasedDate = null;
                }
              }
            }
          });


      d3.select<SVGSVGElement, unknown>(brushingElement).call(brush as any);
    }
  });
};

// @ts-ignore
d3.timeFormatDefaultLocale(germanTimeFormat);

const timeScale = computed(() => {
  const leftDate = new Date(store.state.data.person.birthDate);
  const rightDate = new Date(store.state.data.person.endDate);
  return d3.scaleUtc().domain([leftDate, rightDate]).range([0, 100]);
});

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

// TODO move into onMounted ; remove in onBeforeUnmount ?
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

const emits = defineEmits(["open-edit"]);

let pressedDate: string | null = null;
let releasedDate: string | null = null;


// n.b. d3.axisTop() does not work because it renders in SVG

// TODO update the general layout manually (by resizing dimensions) or on demand

const packedLayout = computed((): Array<DimensionLayout> => {
  const dimensions = store.state.data.dimensions;

  // Filter dimensions with visible set to true
  const filteredDimensions = dimensions.filter(dim => dim.visible);

  // Create a sorted copy of the filtered dimensions array
  const sortedDimensions = [...filteredDimensions].reverse();

  const buffer = sortedDimensions.map((dim, i) => {
    return { id: dim.id, label: dim.title, marks: [] as EventMark[], minRows: 0, fullRows: 0, height: 0 };
  });


  // console.log(buffer);

  // sort & group
  // TODO filter visible events (possibly as a vuex getter)? not filter, in order to keep layout more stable
  // TODO use interval tree for filter and sort <https://www.npmjs.com/package/@flatten-js/interval-tree> or <https://github.com/ieg-vienna/TimeBench/blob/master/src/timeBench/data/util/IntervalTree.java>
  const eventsByDim = d3.group(store.state.data.events, (d) => d.dimensionId);
  // console.log(visibleEvents);

  buffer.forEach((dim) => {
    const eventsInDim = eventsByDim.get(dim.id) || [];
    // TODO assume sorted array?
    eventsInDim.sort((a, b) => a.startDate.localeCompare(b.startDate));

    // keep track how far to the right rows inside a dimension are occupied
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
      // in case of short events --> make space at least for 1% of substrate width (guessed minimum)
      const rightCorrX = leftX + Math.max(rightX - leftX, 1);
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

      // remember the maximum row
      dim.minRows = Math.max(dim.minRows, eventRow + 1);

      dim.marks.push({
        datum,
        x1: leftX,
        x2: rightX - leftX,
        row: eventRow,
        // collapsed: false,
      });
    });
  });

  console.log("packed layout: complete");
  return buffer;
});

// make row layout reactive to window height
const axisHeight = ref(400);
const verticalRef = ref<InstanceType<typeof HTMLDivElement> | null>(null);
const handleResize = debounce(() => {
  axisHeight.value = verticalRef.value ? verticalRef.value.clientHeight : 800;
}, 500);
onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const layout = computed((): Array<DimensionLayout> => {
  let buffer = [] as DimensionLayout[];

  const rowSupply = Math.floor(axisHeight.value / 24);
  const rowMin = packedLayout.value.length * 2;
  const rowReal = d3.sum(packedLayout.value.map((d) => d.minRows));
  const rowDefault = d3.sum(
    packedLayout.value.map((d) => Math.max(d.minRows, 2))
  );

  console.log(`supply: ${rowSupply} -- min: ${rowMin} -- data: ${rowReal} -- default: ${rowDefault}`);

  // buffer = structuredClone(packedLayout.value);

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
  display: flex;
  flex-direction: column;
}

div.dimpane {
  flex-grow: 1;
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

div.line {
  position: absolute;
  border-left: 2px solid red;
  pointer-events: none;
  z-index: 10;
}


</style>
