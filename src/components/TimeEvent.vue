<template>
  <div>
    <div :class="[event.isInterval ? 'period' : 'event']" id="contentEvent" >
      <!--style="margin-left: 235px"-->
      <p>
        {{ event.description }}
      </p>
      <p class="subcontent">
        {{
          event.notes
            ? event.notes
            : event.isInterval
            ? event.startDate.substring(0, 4) +
              " - " +
              event.endDate.substring(0, 4)
            : event.startDate
        }}
      </p>
    </div>
  </div>
</template>

<script>
//import {ZBEvent} from "@/data/ZBEvent.ts";

export default {
  name: "TimeEvent",
  props: {
    event: Object,
  },
  data(){
    return {
      showEditDialogue: false,
    }
  },
  methods:{
    editDiv(event) {
      this.showEditDialogue = true;
      console.log(event.eventId);
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  border-right: 0.5px solid lightgrey;
  width: 10%;
  text-align: center;
}

.event {
  display: block;
  background-color: $eventgrey;
  border-left: 3px solid $eventgreen;
  margin: 5px 0;
  border-radius: 3px;
}

.period {
  display: block;
  background-color: $periodblue;
  border: 2px solid $periodborderblue;
  box-shadow: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
}

.subcontent {
  color: darkgrey;
}
</style>
