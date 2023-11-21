import { createRouter, createWebHistory } from "vue-router";
import PersonDialogue from "@/components/PersonDialogue.vue";
import TimeGraph from "@/components/TimeGraph.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: TimeGraph,
      props: {},
    },
    {
      path: "/setup",
      name: "setup",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: PersonDialogue,
    },
  ],
});

export default router;
