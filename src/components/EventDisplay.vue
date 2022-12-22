<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ event.description }}</p>
          <p class="subtitle is-6">{{ event.isInterval ? "Zeitraum" : "Zeitpunkt" }}</p>
        </div>
      </div>

      <div class="content">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="text-align: left">Datum</label>
          </div>
          <div class="field-body">
            <div class="field">
              {{ event.isInterval
                ? event.startDate + " bis " + event.endDate
                : event.startDate }}
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="text-align: left">Notizen</label>
          </div>
          <div class="field-body">
            <div class="field">
              {{ event.notes }}
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
    event: Object,
  },
}
</script>

<style scoped>

</style>