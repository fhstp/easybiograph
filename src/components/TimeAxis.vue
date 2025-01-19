<template>
  <div class="axis">
    <div class="head year">{{ t("year") }}</div>
    <div class="headAge age">{{ t("age") }}</div>
    <div class="brush" ref="brushRef">
    <div class="substrate" ref="substrateRef">
      <div
        class="tick year"
        v-for="(year, i) in yearTicks"
        :key="i"
        :style="year.style"
      >
        {{ year.label }}
      </div>
      <div
          v-for="(age) in ageTicks"
          :key="age.label"
          :class="[ gridState ? (age.tick ? (age.label == ' ' ? 'tick-when-no-age' : 'tick age') : 'no-tick') : ((age.tick) && age.label == ' ' ? 'no-tick-when-no-age' : 'no-tick')]"
          :style="age.style"
        >
        {{ age.label }}
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted, onBeforeUnmount, watch} from "vue";
import * as d3 from "d3";
import {debounce, englishTimeFormat, germanTimeFormat} from "@/assets/util";
import { useStore } from "@/store";
import de from "@/de";
import en from "@/en";

const brushRef = ref<InstanceType<typeof HTMLDivElement> | null>(null);
let brush: any = null;

onMounted(() => {
  // Create the brush
  const svg = d3.select('.axis')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('pointer-events', 'none');

  brush = d3.brushX()
      .extent([[0, 0], [5000, 300]])
      .on('start brush end', (event) => {
        let eventSource = event.sourceEvent;

        if (eventSource.type === 'mousedown' || eventSource.type === 'touchstart') {
          // Mouse & touch start
          const timePane = document.querySelector('.pane');
          const rect = timePane?.getBoundingClientRect();

          if (rect) {
            let clickX = 0;
            if (eventSource.type === 'mousedown') {
              clickX = eventSource.clientX - rect.left;
            } else if (eventSource.type === 'touchstart') {
              clickX = eventSource.touches[0].clientX - rect.left;
            }

            const timeAxisWidth = rect.width;
            pressedDateZoom = calculateDateFromClick(clickX, timeAxisWidth);
          }
        } else if (eventSource.type === 'mouseup' || eventSource.type === 'touchend') {
          // Mouse & touch end
          const timePane = document.querySelector('.pane');
          const rect = timePane?.getBoundingClientRect();

          if (rect) {
            let clickX = 0;
            if (eventSource.type === 'mouseup') {
              clickX = eventSource.clientX - rect.left;
            } else if (eventSource.type === 'touchend') {
              clickX = eventSource.changedTouches[0].clientX - rect.left;
            }

            const timeAxisWidth = rect.width;
            releasedDateZoom = calculateDateFromClick(clickX, timeAxisWidth);

            if (pressedDateZoom && releasedDateZoom) {
              const pressedDate = new Date(pressedDateZoom);
              const releasedDate = new Date(releasedDateZoom);

              // Calculate the difference in months
              const monthDifference = (releasedDate.getFullYear() - pressedDate.getFullYear()) * 12 +
                  releasedDate.getMonth() - pressedDate.getMonth();

              if (monthDifference >= 3) {
                const temporaryZoom = {
                  birthDate: pressedDateZoom,
                  endDate: releasedDateZoom,
                };

                store.commit("data/addZoom", temporaryZoom);
                console.log("Zoom committed - temporary");

                pressedDateZoom = null;
                releasedDateZoom = null;

                updateAfterZoom();
              } else {
                // Automatically zoom to the 3 closest months
                const midDate = new Date(
                    pressedDate.getFullYear(),
                    pressedDate.getMonth() + Math.floor(monthDifference / 2),
                    1
                );

                const startDate = new Date(midDate.getFullYear(), midDate.getMonth() - 1, 1);
                const endDate = new Date(midDate.getFullYear(), midDate.getMonth() + 2, 0);

                const temporaryZoom = {
                  birthDate: startDate.toISOString().split("T")[0],
                  endDate: endDate.toISOString().split("T")[0],
                };

                store.commit("data/addZoom", temporaryZoom);
                console.log("Automatically zoomed to 3 closest months");

                pressedDateZoom = null;
                releasedDateZoom = null;

                updateAfterZoom();
              }
            }
          }
        }
      });

  svg.append('g')
      .attr('class', 'brush')
      .call(brush);

  d3.select('.brush')
      .attr('pointer-events', 'all')
      .selectAll('rect')
      .attr('height', '100%');
});


let pressedDateZoom: string | null = null;
let releasedDateZoom: string | null = null;

const props = defineProps<{
  scale: d3.ScaleTime<number, number, never>;
  zoomMode: boolean;
}>();

const zoomModeUse = ref(props.zoomMode);
const gridState = computed(() => store.state.settings.showGrid);

watch(() => props.zoomMode, (newVal) => {
  zoomModeUse.value = newVal;
  if (zoomModeUse.value) {
    const timePane = document.querySelector('.pane');
    const rect = timePane?.getBoundingClientRect();
    if (rect) {
      const centerClickX = rect.left + rect.width / 2;
      const timeAxisWidth = rect.width;

      const centerDateZoom = calculateDateFromClick(centerClickX, timeAxisWidth);
      console.log("HERE" + store.state.data.zoom.birthDate)

      if (centerDateZoom != null) {
        const centerDate = new Date(centerDateZoom);

      const currentStartDate = store.state.data.zoom.birthDate.length <= 0 ? new Date(store.state.data.person.birthDate) : new Date(store.state.data.zoom.birthDate);
      const currentEndDate = store.state.data.zoom.endDate.length <= 0 ? new Date(store.state.data.person.endDate) : new Date(store.state.data.zoom.endDate);

      const currentRange = currentEndDate.getTime() - currentStartDate.getTime();
      const newRange = currentRange * 0.25; // 25% für beide Seiten um 50% Zoom zu haben

      const newStartDate = new Date(centerDate.getTime() - newRange);
      const newEndDate = new Date(centerDate.getTime() + newRange);

      const temporaryZoom = {
        birthDate: newStartDate.toISOString().split("T")[0],
        endDate: newEndDate.toISOString().split("T")[0],
      };

      store.commit("data/addZoom", temporaryZoom);

      console.log("Zoom committed with new range ±25%");
      updateAfterZoom();

      }
    }
  }
});

const store = useStore();
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
};

function updateAfterZoom() {
  // @ts-ignore
  window.location.reload()
};

const calculateDateFromClick = (clickX: number, axisWidth: number): string | null => {

  clickX = clickX - 130
  axisWidth = axisWidth - 130

  const percentClicked = (clickX / axisWidth) * 100;

  const clickedDate = timeScale.value.invert(percentClicked);

  if (clickedDate instanceof Date) {
    const formattedDate = `${clickedDate.getFullYear()}-${String(clickedDate.getMonth() + 1).padStart(2, '0')}-${String(clickedDate.getDate()).padStart(2, '0')}`;

    return formattedDate;
  }

  return null;
};

onBeforeUnmount(() => {
  if (brush) brush.on('brush', null);
});

/*const props = defineProps<{
  scale: d3.ScaleTime<number, number, never>;
}>();*/


// make time axis reactive to window width
const axisWidth = ref(800);
const substrateRef = ref<InstanceType<typeof HTMLDivElement> | null>(null);
const handleResize = debounce(() => {
  axisWidth.value = substrateRef.value ? substrateRef.value.clientWidth : 800;
}, 500);
onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// ... and font size
const size = computed(() => {
  if (substrateRef.value) {
    const size = parseFloat(
      getComputedStyle(substrateRef.value).getPropertyValue("font-size")
    );
    // make it more robust
    if (!isNaN(size) && size > 0)
      return size;
  }
  return 10.0;
});

const yearTicks = computed(() => {
  const idealtickCount = Math.round(axisWidth.value / size.value / 7);
  const ticks = props.scale.ticks(idealtickCount);
  // console.log(ticks);

  if (store.state.settings.language == "de") {
    d3.timeFormatDefaultLocale(germanTimeFormat);
  } else {
    d3.timeFormatDefaultLocale(englishTimeFormat);
  }

  function format(date: Date) {
    return (
      d3.utcMonth(date) < date
        ? d3.timeFormat("%-d %b")
        : d3.utcYear(date) < date
        ? d3.timeFormat("%b")
        : d3.timeFormat("%Y")
    )(date);
  }

  return ticks.map((d) => {
    return {
      label: format(d), //   d.getFullYear().toString(),
      style: { left: props.scale(d).toString() + "%" },
    };
  });
});

const updateScaleDomain = () => {
  if (pressedDateZoom && releasedDateZoom) {
    let brushStart = new Date(pressedDateZoom);
    let brushEnd = new Date(releasedDateZoom);

    console.log("HERE1", props.scale.domain())

    props.scale.domain([brushStart, brushEnd]);
    console.log("HEREEEEE", props.scale.domain())
    ageTicks.value;
  }
};

let birthUTC = ref(new Date(store.state.data.person.birthDate));

// alternatively a birthScale would be possible by building a custom time interval
// based on <https://github.com/d3/d3-time/blob/main/src/year.js>
const ageTicks = computed(() => {
  updateScaleDomain();
  let timeDomain = props.scale.domain();
  console.log("here check", timeDomain)
  const birthdays = [];
  let i = 0;
  let day = birthUTC.value;
  while (day <= timeDomain[0]) {
    i++;
    day = d3.utcYear.offset(day);
  }
  while (day < timeDomain[1]) {
    birthdays.push({ age: i, date: day });
    i++;
    day = d3.utcYear.offset(day);
  }

  if (birthdays.length > 0) {
    // reduce tick count
    const spacePerTick = axisWidth.value > 0 ? axisWidth.value / size.value / birthdays.length : 2;
    // 2.0 is a tested guess
    const steps = Math.ceil(2.0 / spacePerTick);
    // add steps extra birthdays, so that there is border line right of last label
    for (let j = 0; j < steps; j++) {
      birthdays.push({ age: i, date: day });
      i++;
      day = d3.utcYear.offset(day);
    }
    // since we added steps elements, there will be enough to calculate width
    const width =
      props.scale(birthdays[steps].date) - props.scale(birthdays[0].date);

    // console.log(`space ${spacePerTick}px - steps ${steps} - width ${width}%`);

    return birthdays
      .map((d, i) => {
        // 5-year lines shifted by steps because line on left border vs label right-aligned
        const tick = d.age % 5 === steps;
        const axisTick = i % steps === steps - 1;
        return {
          label: axisTick ? d.age.toString() : " ",
          tick: tick,
          axisTick: axisTick,
          style: {
            left: `${props.scale(d.date) - width}%`,
            width: `calc(${width}% - 2px)`,
            "border-left": d.age > steps ? "1px solid black" : "",
          },
        };
      })
      .filter((d) => d.tick || d.axisTick);
  } else {
    // edge case: no birthday -> 1 tick at 100% -- maybe needs testing(?)
    return [
      {
        label: i.toString(),
        tick: (i - 1) % 5 === 0,
        axisTick: true,
        style: { left: "0%", width: "calc(100% - 2px)" },
      },
    ];
  }
});

function t(prop: string) {
  const lang = store.state.settings.language;
      const trans: any = lang === "de" ? de :  en;
      return trans[prop];
}
</script>

<style scoped lang="scss">
div.axis {
  // margin-top: 3.25rem;
  background: #fcfcfc; /* TODO JB beautify & borders */
  width: 100%;
  height: 5.5em;
  position: relative;
  padding-top: 2.5em;
}

div.substrate {
  left: $dimensionWidth;
  right: 0;
  height: 60%;
  position: absolute;
  border-left: 1px solid black;
}

.brush {
  position: absolute;
  top: 46%;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* TODO JB vertically style scale, check font-size (e.g. with Michaela's mockups) */
.year {
  top: 0px;
}

.age {
  top: 1.5em;
}

.head {
  position: absolute;
  left: 0;
  width: $dimensionWidth;
  text-align: center;
  top: 40px;
}
.headAge {
  position: absolute;
  left: 0;
  width: $dimensionWidth;
  text-align: center;
  top: 65px;
}

.tick {
  position: absolute;
  height: 1.5em;
}

.tick.year {
  border-left: 1px solid black;
  padding-left: 2px;
  overflow: hidden;
}

.tick.age {
  text-align: right;
  position: absolute;
  height: 100vh;
}

.tick-when-no-age {
  position: absolute;
  height: 100vh;
  text-align: right;
  top: 3em;
}

.no-tick {
  position: absolute;
  height: 1.5em;
  text-align: right;
  top: 1.5em;
}

.no-tick-when-no-age {
  position: absolute;
  height: 0em;
  text-align: right;
  top: 1.5em;
}

</style>
