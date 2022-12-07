<template>
  <div class="box position" style="height: 96vh; width: 40vw">
    <button
      class="button is-light is-small"
      style="right: -33vw"
      @click="close"
    >
      X
    </button>

    <h1 class="title block">Eintrag bearbeiten</h1>
    <br />
    <button class="button is-danger is-light" @click="removeEvent">
      Eintrag löschen
    </button>
    <br />
    <br />
    <br />
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Datum</label>
      </div>
      <div class="field-body">
        <input type="month" />
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
    <button class="button is-white" style="margin-right: 1vw; right: -15vw">
      Abbrechen
    </button>
    <button
      class="button is-link is-light"
      style="right: -15vw"
      @click="editEvent"
    >
      Änderungen speichern
    </button>
  </div>
</template>

<script>
import { store } from "@/store";

export default {
  name: "DeleteEditDialogue",
  methods: {
    removeEvent() {
      console.log("Insert delete function :)");
      store.commit("data/removeEvent");
    },
    editEvent() {
      console.log("Insert edit function");
      //store.commit("data/editEvent", 0);
    },
    close() {
      console.log("Insert close function");
    },
  },
};
</script>

<style scoped></style>
