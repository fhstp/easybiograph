<!-- wrapper for MonthYear input with model-value is a string formatted YYYY-MM -->
<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue?: string;
  min?: string;
  max?: string;
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

let avail_years = null;
if (props.min && props.max) {
  // console.log(`min: ${props.min}, max: ${props.max}`);
  const minYear = parseInt(props.min.slice(0, 4));
  const maxYear = parseInt(props.max.slice(0, 4));
  // console.log(`min: ${minYear}, max: ${maxYear}`);
  avail_years = Array.from(Array(maxYear - minYear + 1), (_, i) => i + minYear);
  // console.log(`avail: ${avail_years}`);
}

const month = ref(2);
// const month = ref(MONTHS[0]);
const year = ref(2020);

const setFromProperties = (newModelValue: string) => {
  console.log(`parent set monthyear to ${newModelValue}`);

  // ^\d{4}\-[0-1][0-9]$
  const re = /^(\d{4})-(([0][1-9])|([1][0-2]))$/;
  if (newModelValue) {
    const match = newModelValue.match(re);
    if (match) {
      year.value = parseInt(match[1]);
      month.value = parseInt(match[2]) - 1;
      // TODO insert error handling
      console.log(`parsed as ${match[1]} - ${AVAIL_MONTHS[month.value]}`);
    }
  }
};

setFromProperties(props.modelValue);
watch(() => props.modelValue, setFromProperties);
//   (newModelValue) => {
//     console.log(`parent set monthyear to ${newModelValue}`);

//     // ^\d{4}\-[0-1][0-9]$
//     const re = /^(\d{4})-(([0][1-9])|([1][0-2]))$/;
//     const match = newModelValue.match(re);
//     year.value = match[1];
//     month.value = parseInt(match[2]) - 1;
//     // TODO insert error handling
//     console.log(`parsed as ${match[1]} - ${MONTHS[month.value]}`);
//   }
//   // { deep: true }
// );

watch([month, year], ([newMonth, newYear]) => {
  const modelStr =
    newYear.toString().padStart(4, "0") +
    "-" +
    (newMonth + 1).toString().padStart(2, "0");
  console.log(`built as: ${modelStr}`);
  emit("update:modelValue", modelStr);
});

// const year = computed({
//   get() {
//     return props.modelValue;
//   },
//   set(value) {
//     emit("update:modelValue", value);
//   },
// });

// <!-- :value="modelValue"
//     @input="$emit('update:modelValue', $event.target.value)" -->
</script>

<template>
  <div class="control has-icons-left">
    <div class="select">
      <select v-model="month">
        <option v-for="(label, i) in AVAIL_MONTHS" :key="i" :value="i">
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
    <div v-if="avail_years" class="select">
      <select v-model="year">
        <option v-for="label in avail_years" :key="label" :value="label">
          {{ label }}
        </option>
      </select>
    </div>
    <input v-else v-model="year" class="input" type="number" />
  </div>
</template>
