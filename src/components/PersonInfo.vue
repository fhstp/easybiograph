<template>
  <div class="personInfo">
    <!-- TODO: Aktuelles Datum statt Erstellungsdatum -->
    <p class="same interviewee">
      {{ $store.state.data.person.name }}
      ({{ $store.state.data.person.birthDate.substring(5, 7) > $store.state.data.person.creationDate.substring(5, 7) ?
        ($store.state.data.person.creationDate.substring(0, 4) - $store.state.data.person.birthDate.substring(0, 4)) - 1
      : ($store.state.data.person.creationDate.substring(0, 4) - $store.state.data.person.birthDate.substring(0, 4))}}a), {{ t("bornon") }}
      {{ formatDate($store.state.data.person.birthDate)}}
      <span v-if="$store.state.data.person.birthplace">
        in {{ $store.state.data.person.birthplace }}
      </span>
    </p>
    <p class="same interviewer" style="float: right; text-align: right; margin-right: 1%">
      {{ t("created") }}
      <span v-if="$store.state.data.person.interviewers">
        {{ t("by") }} {{ $store.state.data.person.interviewers }},
      </span>
      {{ formatDate($store.state.data.person.creationDate)}}
      &nbsp;
    </p>
    <!-- TODO fill from stored ZBPerson -->
    <!-- <span class="client">{{ $store.state.data.person.name }}</span> -->
  </div>
</template>

<script>
import { store } from "../store";
import de from "@/de";
import en from "@/en";

export default {
  name: "PersonInfo",
  methods: {
    t(prop) {
      const lang = store.state.settings.language;
      const trans = lang === "de" ? de :  en;
      return trans[prop];
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(this.t("language"), {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.personInfo {
 
  padding-left: 1vw;
  padding-top: 0.5vh;
  font-weight: normal;
  width: 100vw;
  height: 2.5em;
  z-index: 5;
  white-space: nowrap;
  background-color: var(--secondary-color);
  color: var(--secondary-text-color);
}

.contrast .personInfo {
  /* background-color: #93b2c9; */
  color: #001f3f;
}

.same {
  display: inline-block;
}

.interviewee {
  font-size: medium;
  font-weight: bold;
}

.interviewer {
  margin-left: 2vw;
  font-size: smaller;
}
</style>
