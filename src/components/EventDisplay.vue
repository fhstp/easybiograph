<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">
            {{ description }}
            <button @click="$emit('open-edit')" class="button is-link is-small">
              <span class="icon is-small">
                <font-awesome-icon icon="pencil-alt" />
              </span>
            </button>
          </p>

          <p class="subtitle is-6">
            {{ eventTypeAsString }}
          </p>
        </div>
      </div>
      <br />
      <div class="content">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="text-align: left">{{ t("eventdate") }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              {{ timeInfo }}
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="text-align: left">{{ t("notes") }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              {{ notes }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ZBEvent } from "@/data/ZBEvent";
import de from "@/de";
import en from "@/en";
import { store } from "@/store";
import { computed } from "vue";

const props = defineProps<{
  selectedEvent: ZBEvent | null;
}>();

const description = computed(() =>
  props.selectedEvent ? props.selectedEvent.description : ""
);

const notes = computed(() =>
  props.selectedEvent ? props.selectedEvent.notes : ""
);

const eventTypeAsString = computed(() => {
  if (props.selectedEvent) {
    return props.selectedEvent.isInterval ? t("period") : t("moment");
  } else {
    return "";
  }
});

const timeInfo = computed(() => {
  if (props.selectedEvent) {
    return props.selectedEvent.isOpenEnd
      ? props.selectedEvent.startDate + t("toopenend")
      : props.selectedEvent.isInterval
      ? props.selectedEvent.startDate + t("to") + props.selectedEvent.endDate
      : props.selectedEvent.startDate;
  } else {
    return "";
  }
});

function t(prop: string) {
  const lang = store.state.settings.language;
      const trans: any = lang === "de" ? de :  en;
      return trans[prop];
}
</script>

<style scoped></style>
