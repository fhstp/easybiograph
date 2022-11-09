<template>
<table>
  <thead>
  <tr class="year_age">
    <td class="content">
      <p>
        Jahr
      </p>
      <p>
        Alter
      </p>
    </td>
    <td class="year-wrap">
      <div v-for="(year, index) in years" class="year">
        <p>
          {{year}}
        </p>
        <p>
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
            <p>
              Traumatisch
            </p>
          </div>
          <div class="period" style="margin-left: 135px">
            <p>
              Wohnung der Mutter
            </p>
            <p>
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
  </tbody>
</table>
</template>

<script>
export default {
  name: "TimeGraph",
  data(){
    return {
      years: [2000, 2001, 2002, 2003, 2004, 2005]
    }
  }
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 95vw;
  height: 95vh;
  display: table;
  margin: auto;
}

td {
  text-align: center;
  padding: 8px;
}

tr:nth-child(odd){background-color: #fcfcfc}
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
}
.event{
  display: block;
  background-color: #f4f4f5;
  border-left: 3px solid #a1d592;
  width: 15%;
  margin: 5px 0;
  border-radius: 3px;
}
.period{
  display: block;
  background-color: #e6f2f8;
  border: 2px solid #afd3e3;
  width: 15%;
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
}
</style>