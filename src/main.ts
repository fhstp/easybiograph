import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(router);

// BEGIN fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// NB: import & add each used icon here
import {
  faBars,
  faPencilAlt,
  // faUserPlus,
  // faMapPin,
  // faUserMinus,
  // faExchangeAlt,
  // faProjectDiagram,
  // faPeopleArrows,
  // faExclamationTriangle,
  // faTimes,
  // faFolderOpen,
  // faFile,
  // faSave,
  // faFileImage,
  // faFileCsv,
  // faChevronDown,
  // faChevronUp,
  // // faUndoAlt,
  // // faRedoAlt,
  // faUndo,
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
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faBars,
  faPencilAlt,
  // faUserPlus,
  // faMapPin,
  // faUserMinus,
  // faExchangeAlt,
  // faProjectDiagram,
  // faPeopleArrows,
  // faExclamationTriangle,
  // faTimes,
  // faFolderOpen,
  // faFile,
  // faSave,
  // faFileImage,
  // faFileCsv,
  // faChevronDown,
  // faChevronUp,
  // // faUndoAlt,
  // // faRedoAlt,
  // faUndo,
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
  faArrowsAlt
);

app.component("font-awesome-icon", FontAwesomeIcon);

// END fontawesome

app.mount("#app");