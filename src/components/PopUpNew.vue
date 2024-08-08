<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <label class="title is-4">{{ t("attention") }}</label>
          <br /><br />

          <p class="subtitle is-6">{{ t("continuemsg") }}</p>
          <br />
        </div>
      </div>
      <br />
      <div class="buttons">
        <button @click="$emit('open-edit')" class="button is-link">
          {{ t("continue") }}
        </button>

        <button @click="$emit('save-data')" class="button is-link">
          {{ t("save") }}
        </button>

        <button @click="$emit('abort-new')" class="button is-danger is-light">
          {{ t("cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import de from "@/de";
import en from "@/en";
import { store } from "@/store";

export default {
  name: "PopUpNew",
  methods: {
    t(prop) {
      const lang = store.state.settings.language;
      const trans = lang === "de" ? de :  en;
      return trans[prop];
    }
  }
};
</script>

<style scoped></style>
