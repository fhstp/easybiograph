<template>
  <div class="box position" style="height: 96vh; width: 40vw">
    <button class="button is-light is-small" style="right: -33vw">X</button>

    <h1 class="title block">Eintrag erstellen</h1>
    <br />
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label" style="text-align: left">Typ</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <label class="radio">
              <input type="radio" name="member" checked />
              Zeitraum
            </label>
            <label class="radio">
              <input type="radio" name="member" />
              Zeitpunkt
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Datum</label>
      </div>
      <div class="field-body">
        <input type="month" />
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Dimension</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth">
              <select>
                <option>Familie</option>
                <option>Wohnen</option>
                <option>Bildung</option>
                <option>Arbeit</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Titel</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Anzeigename des Events"
            />
            <!-- class: is danger -->
          </div>
          <!--
          <p class="help is-danger">
            Bitte beschreibe das Event
          </p>
          -->
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Notizen</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Notizen zum Event"
            ></textarea>
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
  name: "EventDialogue",
};
</script>

<style scoped lang="scss">
* {
  overflow-x: auto;
  display: flex;
}
.position {
  right: -47vw;
}
</style>
