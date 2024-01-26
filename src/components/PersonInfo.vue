<template>
  <div class="personInfo">
    <!-- TODO: Aktuelles Datum statt Erstellungsdatum -->
    <p class="same interviewee">
      {{ $store.state.data.person.name }}
      ({{ $store.state.data.person.birthDate.substring(5, 7) > $store.state.data.person.creationDate.substring(5, 7) ?
        ($store.state.data.person.creationDate.substring(0, 4) - $store.state.data.person.birthDate.substring(0, 4)) - 1
      : ($store.state.data.person.creationDate.substring(0, 4) - $store.state.data.person.birthDate.substring(0, 4))}}a), geboren am
      {{ $store.state.data.person.birthDate.substring(8, 10) }}.{{
        $store.state.data.person.birthDate.substring(5, 7)
      }}.{{ $store.state.data.person.birthDate.substring(0, 4) }}
      <span v-if="$store.state.data.person.birthplace">
        in {{ $store.state.data.person.birthplace }}
      </span>
    </p>
    <p class="same interviewer" style="float: right; text-align: right; margin-right: 1%">
      erstellt
      <span v-if="$store.state.data.person.interviewers">
        von: {{ $store.state.data.person.interviewers }},
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
export default {
  name: "PersonInfo",
};
</script>

<style scoped>
.personInfo {
  position: fixed;
  padding-left: 1vw;
  padding-top: 0.5vh;
  background-color: #d2dee2;
  color: #3e505b;
  font-weight: normal;
  width: 100vw;
  height: 2.5em;
  z-index: 5;
  white-space: nowrap;
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
