<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const addEvent = () => store.commit("data/addEvent");
const eventsCount = computed(() => store.state.data.events.length);

const localCount = ref(0);

defineProps<{
  msg: string;
}>();
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
      What's next?
    </h3>
    <h3>
      Here is a fontawesome icon:
      <font-awesome-icon icon="pencil-alt" />
    </h3>
    <p class="buttons">
      <button class="button is-primary" @click="localCount++">
        <span class="icon">
          <font-awesome-icon icon="arrows-alt" />
        </span>
        <span>Bulma Button: Increment Component Value</span>
      </button>
    </p>
    <p>Value from component state: {{ localCount }}</p>
    <p class="buttons">
      <button class="button is-primary" @click="addEvent">
        <span class="icon">
          <font-awesome-icon icon="arrows-alt" />
        </span>
        <span>Bulma Button: Add event to Zeitbalken</span>
      </button>
    </p>
    <p>Value from vuex store: {{ eventsCount }}</p>
  </div>
</template>

<style scoped lang="scss">
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
  background: $nwkorange;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
