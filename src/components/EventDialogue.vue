<template>
  <div
    class="box position"
    id="box"
    style="
      position: absolute;
      top: 3vh;
      height: 90vh;
      left: auto;
      right: auto;
      width: 50em;
      z-index: 10;
      overflow-y: scroll;
    "
  >
    <h1 class="title block">{{ title }}</h1>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label" style="text-align: left">{{ t("eventtyp") }}</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <label class="radio">
              <input
                type="radio"
                v-model="tempEvent.isInterval"
                v-bind:value="true"
              />
              {{ t("period") }}
            </label>
            <label class="radio">
              <input
                type="radio"
                v-model="tempEvent.isInterval"
                v-bind:value="false"
              />
              {{ t("moment") }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">{{t("eventdate")}}</label>
      </div>
      <div class="field-body">
        <MonthChooser
          v-model="tempEvent.startDate"
          :min="birthDate"
          :max="endDate"
          :disabled="false"
        />
      </div>
    </div>
    <div class="field is-horizontal" v-show="tempEvent.isInterval">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">{{t("until")}}</label>
      </div>
      <div class="field-body">
        <MonthChooser
          v-model="tempEvent.endDate"
          :min="birthDate"
          :max="endDate"
          :disabled="tempEvent.isOpenEnd"
        />
      </div>
    </div>
    <p
      class="help is-danger"
      v-if="invalidEnd"
      style="
        float: right;
        text-align: right;
        margin-right: 1%;
        font-size: smaller;
      ">{{ t("periodmsg") }}</p>
    <br />
    <br v-if="invalidEnd" />
    <label
      class="checkbox is-small"
      v-show="tempEvent.isInterval"
      style="
        float: right;
        text-align: right;
        margin-right: 1%;
        font-size: smaller;
      "
    >
      <input type="checkbox" v-model="tempEvent.isOpenEnd" />
      {{ t("openend") }}
    </label>
    <br />

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Dimension</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth is-link">
              <select v-model="tempEvent.dimensionId">
                <option
                  v-for="(dim, index) in dimensionOptions"
                  :key="dim.id"
                  :value="dim.id"
                >
                  {{ translateDim(dim.title, index) }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">{{t("title")}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <form @submit.prevent="isNewEvent ? addEvent() : editEvent()">
            <input
              class="input is-link"
              :class="{'is-danger': tempEvent.description.length < 1}"
              v-model="tempEvent.description"
              type="text"
              :placeholder="t('titleplaceholder')"
              id="eventNameId"
              required
            />
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">Emoji</label>
      </div>
      <br />
      <div class="field-body">
        <div>
          <div style="display: flex; align-items: center; margin-top: 10px;">
            <div>
              {{
                tempEvent.emoji == null || tempEvent.emoji.length < 1
                  ? t("noemoji")
                  : tempEvent.emoji
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{ t("selectEmoji") }}</label>
      </div>
      <div class="field-body">
        <div class="dropdown" :class="{ 'is-active': showEmojiPicker }">
          <div >
            <button
              class="button is-small emoji"
              @click="toggleEmojiPicker"
            >
            <span>{{ t("selectemoji") }}</span>
            </button>
            <button
              v-if="tempEvent.emoji != null && tempEvent.emoji.length > 0"
              @click="removeEmoji"
              class="button is-small emoji"
              style="margin-left: 10px;"
            >
            <span>{{t("removeemoji")}}</span>
            </button>
          </div>
          <div class="dropdown-menu" >
            <div>
              <div>
                <EmojiPicker
                  v-model="tempEvent.emoji"
                  :native="true"
                  :disableSkinTones="true"
                  @select="onSelectEmoji"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" style="text-align: left">{{t("notes")}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea is-link"
              v-model="tempEvent.notes"
              :placeholder="t('eventnotesplaceholder')"
              id="noteId"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="buttons is-right">
      <button
        v-if="!isNewEvent"
        class="button is-danger is-light"
        @click="removeEvent"
      >
        {{ t("delete") }}
      </button>
      <button
        class="button is-white"
        v-on:click="close"
      >
        {{ t("cancel") }}
      </button>
      <button
        v-if="isNewEvent"
        class="button is-dark"
        v-on:click="addEvent"
        :disabled="invalidEnd || tempEvent.description.length < 1"
      >
        {{ t("done") }}
      </button>
      <button
        v-if="!isNewEvent"
        class="button is-dark"
        v-on:click="editEvent"
        :disabled="invalidEnd || tempEvent.description.length < 1"
      >
        {{ t("done") }}
      </button>
   </div>
  </div>
</template>

<script lang="ts">
import MonthChooser from "./MonthChooser.vue";
import { store } from "../store";
import { initEvent } from "../data/ZBEvent";
import type { ZBEvent } from "../data/ZBEvent";
import { translateDim } from "@/data/Dimension";
import { ref, computed } from "vue";
import type { defineComponent, PropType } from "vue";
import de from "@/de";
import en from "@/en";
import EmojiPicker from "vue3-emoji-picker"
import "vue3-emoji-picker/css";

export default {
  name: "EventDialogue",
  components: { MonthChooser, EmojiPicker },
  props: {
    event: { type: Object as PropType<ZBEvent | null> },
  },
  setup() {
    const dimensionOptions = computed(() =>
      [...store.state.data.dimensions].reverse().filter((dim) => dim.visible)
    );
    const tempEvent = ref(initEvent());
    const showEmojiPicker = ref(false);

    function onSelectEmoji(emoji: any) {
      tempEvent.value.emoji = emoji.i;
      showEmojiPicker.value = false;
    }

    function removeEmoji() {
      tempEvent.value.emoji = "";
    }

    function toggleEmojiPicker() {
      showEmojiPicker.value = !showEmojiPicker.value;
    }

    return {
      tempEvent,
      dimensionOptions,
      onSelectEmoji,
      removeEmoji,
      showEmojiPicker,
      toggleEmojiPicker,
    };
  },
  computed: {
    birthDate() {
      return store.state.data.person.birthDate;
    },
    endDate() {
      return store.state.data.person.endDate;
    },
    title() {
      return this.isNewEvent ? this.t("createentry") : this.t("editentry");
    },
    invalidEnd(): boolean {
      return (
        this.tempEvent.startDate > this.tempEvent.endDate &&
        this.tempEvent.isInterval &&
        !this.tempEvent.isOpenEnd
      );
    },
  },
  data() {
    return {
      isNewEvent: true,
    };
  },
  methods: {
    addEvent() {
      if (!this.tempEvent.isInterval) {
        this.tempEvent.endDate = this.tempEvent.startDate; // Set the same as start date for non-interval events
      }
      if (this.tempEvent.isOpenEnd) {
        this.tempEvent.endDate = store.state.data.person.endDate;
      }

      store.commit("data/addEvent", this.tempEvent);
      this.$emit("close");
    },
    removeEvent() {
      if (this.event) {
        store.commit("data/removeEvent", this.event.eventId);
      } else {
        console.warn("try to remove newly added event");
      }
      this.$emit("close");
    },
    editEvent() {
      if (!this.tempEvent.isInterval) {
        this.tempEvent.endDate = this.tempEvent.startDate; // Set the same as start date for non-interval events
      }
      if (this.tempEvent.isOpenEnd) {
        this.tempEvent.endDate = store.state.data.person.endDate;
      }

      console.table(this.tempEvent);
      // safe to send currentEvent because it is a clone
      store.commit("data/editEvents", this.tempEvent);
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
    t(prop: string) {
      const lang = store.state.settings.language;
      const trans: any = lang === "de" ? de :  en;
      return trans[prop];
    },
    translateDim,
  },
  watch: {
    event: function () {
      if (this.event) {
        console.log("prepare EventDialogue for ..." + this.event);
        // shallow clone event data when opening the dialog
        this.tempEvent = Object.assign({}, this.event);
        this.isNewEvent = this.event.eventId === -1;
      }
    },
  },
};
</script>

<style scoped>
.position {
  position: fixed;
  margin-left: 10vw;
  margin-top: 4vh;
  z-index: 10;
}

.dropdown-menu {
  display: none;
  position: absolute;
  z-index: 10;
  width: 20em;
}

.dropdown.is-active .dropdown-menu {
  display: block;
}

button.emoji {
  border-color: #42ABC2;
}

@media screen and (min-width: 769px), print {
  .field-body {
    flex-grow: 3;
  }
}

@media screen and (max-width: 768px) {
  #box {
    width: 100vw !important;
    left: 0 !important;
    margin-left: 0 !important;
  }
}
</style>
