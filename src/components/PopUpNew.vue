<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <label class="title is-4">
            Achtung, wenn der aktuelle Zeitbalken noch nicht gespeichtert wurde, dann geht dieser verloren!
          </label>
          <br><br>

          <p class="subtitle is-6">
            Wollen Sie dennoch fortfahren?
          </p>
          <br>
        </div>
      </div>
      <br />
      <div class="buttons">

        <button @click="$emit('open-edit')" class="button is-link">
          Weiter
        </button>

        <button @click="$emit('save-data')" class="button is-link">
          Speichern
        </button>

        <button @click="$emit('abort-new')" class="button is-danger is-light">
          Abbrechen
        </button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopUpNew"
}
</script>

<style scoped>

</style>