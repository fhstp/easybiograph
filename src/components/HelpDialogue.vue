<script setup>
import de from '@/de';
import en from '@/en';
import { store } from '@/store';

// eslint-disable-next-line no-undef
const appVersion = __APP_VERSION__;

function t(prop) {
  const lang = store.state.settings.language;
      const trans = lang === "de" ? de :  en;
      return trans[prop];
}
</script>

<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <p class="title is-4">easyBiograph</p>
        <p class="subtitle is-6">version {{ appVersion }}</p>
        <p class="block">
          {{ t("help0_1") }} <a href="https://easybiograph.com/">{{ t("help0_2") }}</a>.
        </p>
        <p class="block">
          {{ t("help1") }} <a href="https://github.com/fhstp/easybiograph">GitHub</a>.
        </p>
        <p class="block">
          {{ t("help2") }}
          <a
            href="https://research.fhstp.ac.at/en/projects/transsodia-transnational-and-digital-learning-and-teaching-in-cooperative-social-diagnostics"
            target="_blank"
          >
            TransSoDia
          </a>
          {{ t("help3") }}
        </p>
        <div class="buttons is-centered">
          <button class="button" @click="$emit('abort')">{{ t("close") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #318091;
}
</style>
