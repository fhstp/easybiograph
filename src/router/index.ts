import { createRouter, createWebHashHistory } from "vue-router";
import PersonDialogue from "@/components/PersonDialogue.vue";
import TimeGraph from "@/components/TimeGraph.vue";
import PrintView from "@/components/PrintView.vue";

const router = createRouter({
  history: createWebHashHistory(),
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
    {
      path: "/print-view",
      name: "PrintView",
      component: PrintView,
    },
  ],
});

export default router;
