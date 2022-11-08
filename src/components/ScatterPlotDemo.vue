<script setup lang="ts">
// import { scaleLinear } from "d3-scale";
import * as d3 from "d3";

// space around plotable area to be used for axes & axis labels
const WIDTH = 300;
const HEIGHT = 200;
const MARGIN = { top: 5, right: 10, bottom: 20, left: 25 };

// generate some random data (2 quantitative colums)
interface Item {
  foo: number;
  bar: number;
}

const MAX_FOO = 50;
const MAX_BAR = 100;

// TODO: data is not reactive yet -> experiment with ref()
const data = [...Array(50)].map((): Item => {
  return {
    foo: Math.random() * MAX_FOO,
    bar: Math.random() * MAX_BAR,
  };
});
console.log(data);

const x = d3
  .scaleLinear()
  .domain([0, MAX_FOO])
  .range([0, WIDTH - MARGIN.left - MARGIN.right]);
const y = d3
  .scaleLinear()
  .domain([0, MAX_BAR])
  .range([HEIGHT - MARGIN.top - MARGIN.bottom, 0]);

// add the X Axis
// g.append("g")
//   .attr("class", "x axis")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x));

// // add the Y axis
// g.append("g").attr("class", "y axis").call(d3.axisLeft(y));

const vAxisBottom = {
  mounted: (el: SVGGElement) => {
    console.log(el);
    d3.select(el).call(d3.axisBottom(x));
    // do something with the element
  },
};

const vAxisLeft = {
  mounted: (el: SVGGElement) => {
    console.log(el);
    d3.select(el).call(d3.axisLeft(y));
    // do something with the element
  },
};
</script>

<template>
  <svg :viewBox="'0 0 ' + WIDTH + ' ' + HEIGHT">
    <g
      class="substrate"
      :transform="'translate(' + MARGIN.left + ',' + MARGIN.top + ')'"
    >
      <g
        class="x axis"
        :transform="
          'translate(0, ' + (HEIGHT - MARGIN.top - MARGIN.bottom) + ')'
        "
        v-axis-bottom
      ></g>
      <g class="y axis" v-axis-left></g>
      <circle
        v-for="(mark, index) in data"
        :key="index"
        :cx="x(mark.foo)"
        :cy="y(mark.bar)"
        r="1"
      />
    </g>
  </svg>
</template>

<style scoped lang="scss">
svg {
  background: antiquewhite;
}
circle {
  fill: firebrick;
}
</style>
