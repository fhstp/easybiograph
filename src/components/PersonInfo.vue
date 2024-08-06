<template>
  <div class="personInfo">
    <!-- TODO: Aktuelles Datum statt Erstellungsdatum -->
    <p class="same interviewee">
      {{ $store.state.data.person.name }}
      ({{ $store.state.data.person.birthDate.substring(5, 7) > $store.state.data.person.creationDate.substring(5, 7) ?
        ($store.state.data.person.creationDate.substring(0, 4) - $store.state.data.person.birthDate.substring(0, 4)) - 1
      : ($store.state.data.person.creationDate.substring(0, 4) - $store.state.data.person.birthDate.substring(0, 4))}}a), {{ t("bornonthe") }}
      {{ $store.state.data.person.birthDate.substring(8, 10) }}.{{
        $store.state.data.person.birthDate.substring(5, 7)
      }}.{{ $store.state.data.person.birthDate.substring(0, 4) }}
      <span v-if="$store.state.data.person.birthplace">
        in {{ $store.state.data.person.birthplace }}
      </span>
    </p>
    <p class="same interviewer" style="float: right; text-align: right; margin-right: 1%">
      {{ t("created") }}
      <span v-if="$store.state.data.person.interviewers">
        {{ t("by") }} {{ $store.state.data.person.interviewers }},
      </span>
      {{ $store.state.data.person.creationDate.substring(8, 10) }}.{{
        $store.state.data.person.creationDate.substring(5, 7)
      }}.{{ $store.state.data.person.creationDate.substring(0, 4) }}
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
  props: {
    contrastMode: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    t(prop) {
      const lang = store.state.settings.language;
      const trans = lang === "de" ? de :  en;
      return trans[prop];
    },
  }
};
</script>

<style scoped>
.personInfo {
  position: fixed;
  padding-left: 1vw;
  padding-top: 0.5vh;
  font-weight: normal;
  width: 100vw;
  height: 2.5em;
  z-index: 5;
  white-space: nowrap;
  background-color: #d2dee2;
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
