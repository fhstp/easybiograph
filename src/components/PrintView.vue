<template>
  <div>
    <div id="printableContent">
      <div v-for="(timeRange, index) in timeRanges" :key="index" class="time-graph-page">
        <TimeGraph :start-year="timeRange.startYear" :end-year="timeRange.endYear" />
      </div>
    </div>
  </div>
</template>

<script>
import TimeGraph from "@/components/TimeGraph.vue";
import { store } from "@/store";

export default {
  name: 'PrintView',
  components: {
    TimeGraph
  },
  data() {
    return {
      contrastMode: this.$route.query.contrastMode === 'true',
      zoomMode: this.$route.query.zoomMode === 'true',
      timeRanges: []
    };
  },
  methods: {
    print() {
      window.print();
    },
    calculateTimeRanges() {
      const birthYear = new Date(store.state.data.person.birthDate).getFullYear();
      const endYear = new Date(store.state.data.person.endDate).getFullYear();
      const timeRanges = [];

      for (let year = birthYear; year <= endYear; year += 25) {
        timeRanges.push({
          startYear: year,
          endYear: Math.min(year + 24, endYear)
        });
      }

      this.timeRanges = timeRanges;
    }
  },
  created() {
    this.calculateTimeRanges();
  },
  mounted() {
    this.print();
  }
};
</script>

<style scoped>
.time-graph-page {
  page-break-after: always;
}
</style>
