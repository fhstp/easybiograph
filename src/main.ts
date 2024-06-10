import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { key, store } from "./store";

import "@/assets/main.scss";

const app = createApp(App);

app.use(router);

// BEGIN fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// NB: import & add each used icon here
import {
  faBars,
  faPencilAlt,
  faUserPlus,
  faArrowDown,
  faArrowUp,
  // faMapPin,
  // faUserMinus,
  // faExchangeAlt,
  // faProjectDiagram,
  // faPeopleArrows,
  // faExclamationTriangle,
  // faTimes,
  faFolderOpen,
  faFile,
  faSave,
  // faFileImage,
  // faFileCsv,
  faCalendar,
  // faChevronDown,
  // faChevronUp,
  // // faUndoAlt,
  // // faRedoAlt,
  faUndo,
  // faRedo,
  // faChartBar,
  // faUserSecret,
  // faRss,
  // faFont,
  // faTrashAlt,
  // faInfoCircle,
  // faCheck,
  // faFilePdf,
  // faArrowLeft,
  // faInfo,
  // faLink,
  // faUnlink,
  faPlus,
  faArrowsAlt,
  faPalette,
  faSliders,
  faTableList,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faQuestion,
  faPaintRoller,
  faTimes,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faBars,
  faPencilAlt,
  faUserPlus,
  faArrowDown,
  faArrowUp,
  // faMapPin,
  // faUserMinus,
  // faExchangeAlt,
  // faProjectDiagram,
  // faPeopleArrows,
  // faExclamationTriangle,
  // faTimes,
  faFolderOpen,
  faFile,
  faSave,
  faCalendar,
  // faFileImage,
  // faFileCsv,
  // faChevronDown,
  // faChevronUp,
  // // faUndoAlt,
  // // faRedoAlt,
  faUndo,
  // faRedo,
  // faChartBar,
  // faUserSecret,
  // faRss,
  // faFont,
  // faTrashAlt,
  // faInfoCircle,
  // faCheck,
  // faFilePdf,
  // faArrowLeft,
  // faInfo,
  // faLink,
  // faUnlink,
  faPlus,
  faArrowsAlt,
  faPalette,
  faSliders,
  faTableList,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faQuestion,
  faPaintRoller,
  faTimes,
  faPrint
);

app.component("font-awesome-icon", FontAwesomeIcon);

// END fontawesome

app.use(store, key);

app.mount("#app");
