<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">
            {{ selectedEvent.description }}
            <button @click="$emit('open-edit')" class="button is-link is-small">
              <span class="icon is-small">
                <font-awesome-icon icon="pencil-alt" />
              </span>
            </button>
          </p>

          <p class="subtitle is-6">
            {{ selectedEvent.isInterval ? "Zeitraum" : "Zeitpunkt" }}
          </p>
        </div>
      </div>
      <br />
      <div class="content">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="text-align: left">Datum</label>
          </div>
          <div class="field-body">
            <div class="field">
              {{
                selectedEvent.isOpenEnd ? selectedEvent.startDate + " bis Offenes Ende"
                : selectedEvent.isInterval
                  ? selectedEvent.startDate + " bis " + selectedEvent.endDate
                  : selectedEvent.startDate
              }}
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="text-align: left">Notizen</label>
          </div>
          <div class="field-body">
            <div class="field">
              {{ selectedEvent.notes }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventDisplay",
  props: {
    selectedEvent: Object,
  },
};
</script>

<style scoped></style>
