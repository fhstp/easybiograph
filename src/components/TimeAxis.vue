<template>
  <div class="axis">
    <div class="head year">Jahr</div>
    <div class="headAge age">Alter</div>
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
        class="tick age"
        v-for="age in ageTicks"
        :key="age.label"
        :style="age.style"
      >
        {{ age.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import * as d3 from "d3";
import { debounce } from "@/assets/util";
import { useStore } from "@/store";

const props = defineProps<{
  scale: d3.ScaleTime<number, number, never>;
}>();

const store = useStore();

// make time axis reactive to screen width
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
const size = computed(() =>
  substrateRef.value
    ? parseFloat(
        getComputedStyle(substrateRef.value).getPropertyValue("font-size")
      )
    : 10.0
);

const yearTicks = computed(() => {
  const idealtickCount = Math.round(axisWidth.value / size.value / 4);
  const ticks = props.scale.ticks(idealtickCount);
  // console.log(ticks);

  function format(date: Date) {
    return (
      d3.utcMonth(date) < date
        ? d3.timeFormat("%-d. %b.")
        : d3.utcYear(date) < date
        ? d3.timeFormat("%b.")
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

const birthUTC = computed(() => new Date(store.state.data.person.birthDate));

// alternatively a birthScale would be possible by building a custom time interval
// based on <https://github.com/d3/d3-time/blob/main/src/year.js>
const ageTicks = computed(() => {
  const timeDomain = props.scale.domain();
  const birthdays = [];
  let i = 0;
  let day = birthUTC.value;
  while (day <= timeDomain[0]) {
    i++;
    day = d3.utcYear.offset(day);
  }
  while (day <= timeDomain[1]) {
    birthdays.push({ age: i, date: day });
    i++;
    day = d3.utcYear.offset(day);
  }
  // console.log(birthdays);

  // reduce tick count
  const spacePerTick = axisWidth.value / size.value / birthdays.length;
  // 2.0 is a tested guess
  const steps = Math.ceil(2.0 / spacePerTick);
  console.log(`space: ${spacePerTick} - steps: ${steps}`);

  // XXX LATER edge case: no tick -> 1 tick at 100% (?)

  return birthdays
    .filter((_, index) => index % steps === steps - 1)
    .map((d) => {
      return {
        label: d.age.toString(),
        style: {
          // the 1px width of the border is substracted here
          right: `calc(${100 - props.scale(d.date)}% - 1px)`,
        },
      };
    });
});
</script>

<style scoped lang="scss">
div.axis {
  // margin-top: 3.25rem;
  background: #edf6f9; /* TODO JB beautify */
  height: 5.5em;
  position: relative;
  padding-top: 2.5em;
}

div.substrate {
  left: $dimensionWidth;
  right: 0;
  position: absolute;
}

/* TODO JB vertically style scale */
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
}

.tick.year {
  border-left: 1px solid black;
  padding-left: 2px;
}

.tick.age {
  border-right: 1px solid black;
  padding-right: 2px;
}
</style>
