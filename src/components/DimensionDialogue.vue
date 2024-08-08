<template>
  <br />
  <h1 id="edit" class="title block">{{ t("editdimension") }}</h1>
  <br />
  <div>
    <div v-for="(dimension, index) in Dimension" :key="dimension.id" class="checkbox-container">
      <label v-if="!isEditing[index]">
        <input type="checkbox" @click="toggleDim(dimension.id)" :checked="dimension.visible" v-if="dimension.id > 6"> {{ translateDim(dimension.title, index) }}
      </label>
      <input v-if="isEditing[index]" v-model="editedDimension" @blur="cancelEdit(index)" @keyup.enter="saveEdit(index)" />
      <div class="buttons">
      <button class="button is-small" v-if="!isEditing[index] && dimension.id > 6" @click="editDimension(index)">
        <font-awesome-icon icon="pencil-alt" />
      </button>
        <button class="button is-small" v-if="isEditing[index] && dimension.id > 6" @click="cancelEdit(index)">
          <font-awesome-icon icon="pencil-alt" />
        </button>
      <button class="button is-small" @click="moveUp(index)" :disabled="index === 6" v-if="dimension.id > 6">
        <font-awesome-icon icon="arrow-up" />
      </button>
        <button class="button is-small" @click="moveDown(index)" :disabled="index === Dimension.length - 1" v-if="dimension.id > 6">
          <font-awesome-icon icon="arrow-down" />
        </button>
      </div>
    </div>
  </div>
  <br />
  <form @submit.prevent="addDimension">
    <div class="field is-grouped">
      <p class="control is-expanded">
        <input
          v-model="newDimDetails.title"
          class="input"
          type="text"
          :placeholder="t('dimensionplaceholder')"
        />
      </p>
      <p class="control">
        <a class="button is-link is-light" @click="addDimension"> {{ t("adddimension") }}</a>
      </p>
    </div>
  </form>
</template>

<script>
import { translateDim } from "@/data/Dimension";
import {DimensionA, initDimension} from "@/data/Dimension";
import de from "@/de";
import en from "@/en";
import {store} from "@/store";

export default {
  name: "DimensionDialogue",
  data() {
    return {
      // TODO AR 8 Aug : how does this work with custom dimensions
      isEditing: Array(DimensionA.length).fill(false),
      editedDimension: "",
      dimensionString: [],
      currentDim: {},
      newDimDetails: {
        title: "",
      },
    };
  },
  computed: {
    Dimension() {
      const dimensions = store.state.data.dimensions;
      return dimensions ? [...dimensions].reverse() : [];
    },
  },
  methods: {
    editDimension(index) {
      this.isEditing[index] = true;
      this.editedDimension = this.Dimension[index].title;
    },
    addDimension() {
      const newDim = initDimension();
      newDim.title = this.newDimDetails.title;
      newDim.position = 0;
      newDim.visible = true;
      store.commit("data/addDimension", newDim);
//      this.updateDimensionList();
          this.newDimDetails.title = "";
    },
    cancelEdit(index) {
      this.isEditing[index] = false;
    },
    saveEdit(index) {
      const dimension = this.Dimension[index];
      if (dimension) {
        const editedDimension = { ...dimension };
        editedDimension.title = this.editedDimension;

        store.commit("data/editDimName", { id: dimension.id, changes: editedDimension });
        this.isEditing[index] = false;
        // this.updateDimensionList()
      }
    },

    moveUp(index) {
      if (index > 0) {
        const dimensionOne = this.Dimension[index];
        const dimensionTwo = this.Dimension[index - 1];

        store.commit("data/switchDimensions", {
          dimensionOne,
          dimensionTwo,
        });
        // this.updateDimensionList();
      }
    },

    moveDown(index) {
      if (index < this.Dimension.length) {
        const dimensionOne = this.Dimension[index];
        const dimensionTwo = this.Dimension[index + 1];

        store.commit("data/switchDimensions", {
          dimensionOne,
          dimensionTwo,
        });
        // this.updateDimensionList();
      }
    },

    updateDimensionList() {
      const dimensions = store.state.data.dimensions;
      this.Dimension = [...dimensions].reverse();
    },

    toggleDim(id) {
      const dimension = this.Dimension.find(dim => dim.id === id);
      if (dimension) {
        const isVisible = dimension.visible;
        store.commit("data/toggleDimVisi", {
          id: dimension.id,
          changes: { visible: !isVisible },
        });
      }
    },
    t(prop) {
      const lang = store.state.settings.language;
      const trans = lang === "de" ? de :  en;
      return trans[prop];
    },
    translateDim,
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 10px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
