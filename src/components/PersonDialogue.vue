<template>
  <div class="box position" style="height: 96vh; width: 40vw">
    <button class="button is-light is-small" style="right: -33vw">X</button>

    <h1 class="title block">Neuen Zeitbalken erstellen</h1>
    <br />
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Name</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
                class="input"
                type="text"
                placeholder="Name"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Geburtsdatum</label>
      </div>
      <div class="field-body">
        <input type="month" />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Bis</label>
      </div>
      <div class="field-body">
        <input type="month" />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Geburtsort</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
                class="input"
                type="text"
                placeholder="Geburtsort der Person"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Ersteller</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
                class="input"
                type="text"
                placeholder="Name des Erstellers"
            />
          </div>
        </div>
      </div>
    </div>
    <br />
    <button class="button is-white" style="margin-right: 1vw; right: -20vw">
      Abbrechen
    </button>
    <button class="button is-link is-light" style="right: -20vw">Fertig</button>
  </div>
</template>

<script>
export default {
  name: "PersonDialogue"
}
</script>

<style scoped>

</style>