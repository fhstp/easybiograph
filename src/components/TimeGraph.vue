<template>
  <nav class="navbar is-fixed-top">
    <div id="navbarBasicExample" class="navbar-menu bar">
      <div class="navbar-start">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-dark is-small" @click="showDiv()" style="left: 10vw">
              <strong>+</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <br>
  <div id="dialogue" style="display:none" class="event_dialogue"> <!--  -->
    Hier
  </div>
<table>
  <thead>
  <tr class="year_age">
    <td class="content">
      <p>
        Jahr
      </p>
      <p class="subcontent">
        Alter
      </p>
    </td>
    <td class="year-wrap">
      <div v-for="(year, index) in years" class="year">
        <p>
          {{year}}
        </p>
        <p class="subcontent">
          {{index}}
        </p>
      </div>
    </td>
  </tr>
  </thead>
  <tbody>
    <tr>
      <td class="content">
        <div>
          <font-awesome-icon icon="family" />
        Familie
        </div>
      </td>
      <td>
        <div>
          <div>
            Blubb
          </div>
          <div>
            Hi
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="content">
        <div>
        Wohnen
        </div>
      </td>
      <td>
        <div>
          <div class="event">
            <p>
              Delogierung
            </p>
            <p class="subcontent">
              Jänner 2000
            </p>
          </div>
          <div class="period" style="margin-left: 135px">
            <p>
              Wohnung der Mutter
            </p>
            <p class="subcontent">
              Zweimal
            </p>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="content">
        <div>
        Bildung
        </div>
      </td>
      <td>
        <div>
          Blubb
        </div>
      </td>
    </tr>
    <tr>
      <td class="content">
        <div>
          Arbeit
        </div>
      </td>
      <td>
        <div>
          Blubb
        </div>
      </td>
    </tr>
  </tbody>
</table>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import EventDialogue from "@/components/EventDialogue.vue";

const store = useStore();


export default {
  name: "TimeGraph",
  data(){
    return {
      years: [2000, 2001, 2002, 2003, 2004, 2005]
    }
  },
  setup(){
    function showDiv() {
      document.getElementById('dialogue').style.display = "block";
      console.log("Bin da");
    }
    return{
      showDiv
    }
  }
}
</script>

<style scoped lang="scss">
table {
  //border-collapse: collapse;
  border-spacing: 0;
  width: 100vw;
  height: 93vh;
  display: table;
  margin-top: 1vh;
  margin-left: -10vh;
}

td {
  text-align: center;
  padding: 8px;
}

tr:nth-child(odd){background-color: $gridgrey}
thead > tr{background-color: white !important;}

.year{
  padding: 0 10px;
}
.year:nth-child(1){padding-left: 0px}

.year-wrap{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: center;
}
.year_age{
  border-bottom: 0.5px solid lightgrey;
}
.content{
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}
.event{
  display: block;
  background-color: $eventgrey;
  border-left: 3px solid $eventgreen;
  width: 15%;
  margin: 5px 0;
  border-radius: 3px;
}
.period{
  display: block;
  background-color: $periodblue;
  border: 2px solid $periodborderblue;
  width: 15%;
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
}
.subcontent{
  color: darkgrey;
}
.event_dialogue{
  z-index: 2;
}
.bar{
  background-color: #181818;
  width: 100vw;
  height: 5.25vh;
  left: -3vw;
}
</style>