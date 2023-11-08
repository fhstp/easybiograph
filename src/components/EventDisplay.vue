<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">
            <!-- {{ SelectedEvent.description }} -->
            <button @click="$emit('open-edit')" class="button is-link is-small">
              <span class="icon is-small">
                <font-awesome-icon icon="pencil-alt" />
              </span>
            </button>
          </p>

          <p class="subtitle is-6">
            <!-- {{ SelectedEvent.isInterval ? "Zeitraum" : "Zeitpunkt" }} -->
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
              <!-- {{
                SelectedEvent.isOpenEnd ? SelectedEvent.startDate + " bis Offenes Ende"
                    : SelectedEvent.isInterval
                        ? SelectedEvent.startDate + " bis " + SelectedEvent.endDate
                        : SelectedEvent.startDate
              }} -->
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="text-align: left">Notizen</label>
          </div>
          <div class="field-body">
            <div class="field">
              <!-- {{ SelectedEvent.notes }} -->
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
    SelectedEvent: Object,
  },
};
</script>

<style scoped></style>
