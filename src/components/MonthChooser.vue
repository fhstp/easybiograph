<!-- wrapper for MonthYear input with model-value is a string formatted YYYY-MM -->
<script setup lang="ts">
import { computed, ref, watch } from "vue";


const props = defineProps<{
  modelValue?: string;
  requireDay?: boolean;
  min?: string;
  max?: string;
  disableCheck: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const AVAIL_MONTHS = [
  "Jänner",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const UNSET_DAY = "--";

const AVAIL_DAYS = Array.from({ length: 31 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);
if (!props.requireDay) {
  AVAIL_DAYS.unshift(UNSET_DAY);
}

const minYear = computed(() => {
  return props.min ? parseInt(props.min.slice(0, 4)) : undefined;
});

/** birth month (zero-based) */
const minMonth = computed(() => {
  return props.min ? parseInt(props.min.slice(5, 7)) - 1 : undefined;
});

/* AR: currently not use the minimum data as default for the chooser because it will likely be set on day in the middle of the month but most events will be set to 01 or empty day
const minDay = computed(() => {
  return props.min ? parseInt(props.min.slice(8, 10)) : undefined;
});
 */

const age = computed(() => {
  if (minYear.value && minMonth.value) {
    const ageMon =
      (year.value - minYear.value) * 12 + (month.value - minMonth.value);

    return `${Math.floor(ageMon / 12)} Jahre, ${ageMon % 12} Monate`;
  } else {
    return undefined;
  }
});

const avail_years = computed(() => {
  if (minYear.value && props.max) {
    // console.log(`min: ${props.min}, max: ${props.max}`);
    const maxYear = parseInt(props.max.slice(0, 4));
    // console.log(`min: ${minYear}, max: ${maxYear}`);
    const minY2 = minYear.value;
    return Array.from(Array(maxYear - minY2 + 1), (_, i) => i + minY2);
    // console.log(`avail: ${avail_years}`);
  } else {
    return null;
  }
});

// TODO warn if 2020-04-31

/** current month (zero-based) as reactive data variable */
const month = ref(minMonth.value || 0); // month internally zero-based
const year = ref(minYear.value || 2020);
/** current day (one-based string) as reactive data variable */
const day = ref(props.requireDay ? "01" : UNSET_DAY);

/** helper to split YYYY-MM string into two integers month and year or YYYY-MM-DD into 3 */
const setFromProperties = (newModelValue: string | undefined) => {
  //console.log(`parent set monthyear to ${newModelValue}`);

  const re =
    /^(\d{4})-((?:[0][1-9])|(?:[1][0-2]))(?:-((?:[0][1-9])|(?:[1-2][0-9])|(?:[3][0-1])))?/;

  if (newModelValue) {
    const match = newModelValue.match(re);
    if (match) {
      year.value = parseInt(match[1]);
      month.value = parseInt(match[2]) - 1;
      if (match[3]) {
        day.value = match[3];
      }
      // TODO insert error handling
      //console.log(`parsed as ${match[1]} - ${AVAIL_MONTHS[month.value]}`);
    } else {
      console.warn("not a date: " + newModelValue);
    }
  }
};

setFromProperties(props.modelValue);
watch(() => props.modelValue, setFromProperties);

/** notify parent component of changes */
watch([day, month, year], ([newDay, newMonth, newYear]) => {
  const dayStr = newDay === UNSET_DAY ? "" : "-" + newDay;
  const modelStr =
    newYear.toString().padStart(4, "0") +
    "-" +
    (newMonth + 1).toString().padStart(2, "0") +
    dayStr;
  console.log(newDay, newMonth, newYear, modelStr);
  emit("update:modelValue", modelStr);
});

</script>

<template>
  <div class="control has-icons-left">
    <div class="select">
      <select v-model="day" :disabled="disableCheck">
        <option v-for="label in AVAIL_DAYS" :key="label" :value="label">
          {{ label }}
        </option>
      </select>
    </div>
    <span class="icon is-small is-left">
      <font-awesome-icon icon="fa-calendar" />
    </span>
  </div>
  &nbsp;
  <div class="control">
    <div class="select">
      <select v-model="month" :disabled="disableCheck">
        <option v-for="(label, i) in AVAIL_MONTHS" :key="i" :value="i">
          {{ label }}
        </option>
      </select>
    </div>
  </div>
  &nbsp;
  <div class="control">
    <div v-if="avail_years" class="select">
      <select v-model="year" :disabled="disableCheck">
        <option v-for="label in avail_years" :key="label" :value="label">
          {{ label }}
        </option>
      </select>
    </div>
    <input v-else v-model="year" class="input" type="number" />
  </div>
  &nbsp;
  <div class="age field-label is-normal">
    {{ age }}
  </div>
</template>

<style scoped lang="scss">
.age {
  color: hsl(0, 0%, 71%);
}
</style>
