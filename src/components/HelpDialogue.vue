<script setup>
// eslint-disable-next-line no-undef
const appVersion = __APP_VERSION__;
</script>

<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <p class="title is-4">easyBiograph</p>
        <p class="subtitle is-6">version {{ appVersion }}</p>
        <p class="block">
          <!-- TODO provide link to https://easybiograph.fhstp.ac.at/ -->
          Die Webseite mit Handbüchern und Einführungsmaterialien ist noch nicht
          verfügbar.
        </p>
        <p class="block">
          easyBiograph ist Free and Open Source Software. Den Source Code finden
          Sie auf <a href="https://github.com/fhstp/easybiograph">GitHub</a>.
        </p>
        <p class="block">
          Diese Software wurde im Rahmen des Erasmus+ Projekts
          <a
            href="https://research.fhstp.ac.at/en/projects/transsodia-transnational-and-digital-learning-and-teaching-in-cooperative-social-diagnostics"
            target="_blank"
          >
            TransSoDia
          </a>
          entwickelt, das von der Europäischen Union kofinanziert wurde.
        </p>
        <div class="buttons is-centered">
          <button class="button" @click="$emit('abort')">Schließen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
