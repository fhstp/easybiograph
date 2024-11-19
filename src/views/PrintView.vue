<template>
  <div class="page">
    <div id="printinfo">
      <div class="buttons">
        <button class="button" @click="createPdf">
          <span class="icon">
            <font-awesome-icon icon="file-pdf" />
          </span>
          <span>Drucken bzw. als PDF drucken</span>
        </button>

        <button class="button" onclick="window.close()">
          <span class="icon">
            <font-awesome-icon icon="arrow-left" />
          </span>
          <span>Schließen &amp; zu easyBiograph zurückkehren</span>
        </button>
      </div>
    </div>

    <div id="print">
      <div id="titlebar">
        <div id="brand"><i>easy</i>Biograph</div>
      </div>
      <div id="egobar">
        <p class="name">{{ "Name: "  + person.name}} </p>
        <p>{{ "Geburtsdatum: " + formatDate(person.birthDate) }}</p>
        <p>{{ "Zeitbalken bis: " + formatDate(person.endDate) }}</p>
        <p>{{ "Erstellt am: " + formatDate(person.creationDate) }}</p>
        <p v-if="person.birthplace.length > 0">{{ "Geburtort: " + person.birthplace }}</p>
        <p v-if="person.interviewers.length > 0">{{ "Ersteller*in: " + person.interviewers }}</p>
        <p v-if="person.notes.length > 0">{{ "Notizen: " + person.notes }}</p>
      </div>

      <!-- Hochformat -->
      <div class="rows">
        <div class="row" v-for="(dimension, i) in sortedDimensions" :key="i">
          <p class="panel-heading">{{ dimension.title }}</p>
          <div class="panel-block" v-for="event in filteredEvents(dimension)" :key="event.id" >
            <p class="name"> {{ event.description }}</p>
            <div class="date-row">
              <p>{{ formatDate(event.startDate) }} </p>
              <p v-if="!event.isOpenEnd && event.startDate != event.endDate">{{ "bis " + formatDate(event.endDate) }}</p>
              <p v-if="event.isOpenEnd">{{ "bis offenes Ende" }}</p>
            </div>
            <p>{{ event.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Querformat auf 4 Seiten
      <div class="timegraph-container">
        <div class="timegraph-page">
          <TimePane :is-black-mode="true" :page="1" />
        </div>
        <div class="timegraph-page">
          <TimePane :is-black-mode="true" :page="2" />
        </div>
      </div>
      -->

    </div>
  </div>
</template>

<script>
// import TimePane from "./TimePane.vue";
import { store, useStore } from "@/store";
import { computed, onMounted } from "vue";

export default {
  name: 'PrintView',
  // components: {
  //   TimePane
  // },
  setup: function () {
    const store = useStore();
    const person = computed(() => store.state.data.person);
    const dimensions = computed(() => store.state.data.dimensions);
    const events = computed(() => store.state.data.events);

    const createPdf = () => {
      const today = new Date();
      (document.title =
          store.state.data.person.name +
          " " +
          today.toLocaleDateString("en-CA")),
          window.print();
    };

    onMounted(() => {
      createPdf();
    });
    return {
      person,
      dimensions,
      createPdf,
      events
    }
  },
  data() {
    return {
      timeRanges: []
    };
  },
  methods: {
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
    },

    filteredEvents(dimension) {
      return this.events.filter(event => event.dimensionId === dimension.id);
    },
    formatDate(date) {
      if (date.length > 7) {
        return new Date(date).toLocaleDateString("de-DE", {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      } else {
        return new Date(date).toLocaleDateString("de-DE", {
          month: 'short',
          year: 'numeric'
        });
      }
    },

  },
  created() {
    this.calculateTimeRanges();
  },
  computed: {
    sortedDimensions() {
      return [...this.$store.state.data.dimensions].sort((a, b) => a.id - b.id);
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/main.scss";

.name {
  font-weight: bold;
}
.panel-heading {
  margin-top: 2em;
  border: 1px solid black;
}
.panel-block {
  display: flex;
  background: none;
  flex-direction: column;
  align-items: baseline;
  border: 1px solid black
}
.date-row {
  display: flex;
  gap: 5px;
}
#brand {
  margin: 0 0;
  font-weight: bold;
}
#egobar {
  font-size: 1rem;
  padding: 0.5rem 1vmin 1vmin 1vmin;
  margin: 0 1px 1rem 1px;
  border-radius: 0 0 6px 6px;
  background: none;
}

#titlebar {
  font-size: 180%;
  color: $text;
  padding: 1vmin 1vmin 0.3rem 1vmin;
  margin: 0.5rem 1px 0 1px;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;

  flex-direction: row;
  flex-wrap: nowrap;
  display: flex;
  background: none;
}
.page {
  margin-left: 4em;
  padding: 2em 0em 0em;
}
.rows {
  margin-right: 4em;
}

@media screen and (min-width: 133vh) {
  .page {
    display: flex;
    flex-direction: column;
    height: 100vmin;
  }
  #print {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: none;
    max-height: 100vh;
  }
}

@media print {
  #printinfo {
    display: none;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  .timegraph-container {
    page-break-before: always;
    display: block;
    width: 100%;
    height: 100%;
  }

  .timegraph-page {
    page-break-after: always;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @page timegraph {
    size: A4 landscape;
  }

  .timegraph-page {
    page: timegraph;
    margin: 0;
    transform: none;
  }
}

</style>
