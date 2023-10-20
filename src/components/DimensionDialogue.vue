<template>
  <br />
  <h1 id="edit" class="title block">Dimension bearbeiten</h1>
  <br />
  <div>
    <div v-for="(dimension, index) in Dimension" :key="index" class="checkbox-container">
      <label v-if="!isEditing[index]">
        <input type="checkbox" @click="toggleDim(index)"> {{ dimension.title }}
      </label>
      <input v-if="isEditing[index]" v-model="editedDimension" @blur="cancelEdit(index)" @keyup.enter="saveEdit(index)" />
      <div class="buttons">
      <button class="button is-small" @click="editDimension(index)">
        <font-awesome-icon icon="pencil-alt" />
      </button>
      <button class="button is-small" @click="moveUp(index)">
        ^
      </button>
        <button class="button is-small" @click="moveDown(index)">
          v
        </button>
      </div>
    </div>
  </div>
  <br />
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input
              v-model="newDimDetails.title"
              class="input"
              type="text"
              placeholder="Titel der neuen Dimension"
          />
        </div>
      </div>
    </div>
    <button class="button is-link is-light" @click="addDimension">
      Dimension hinzufügen
    </button>
  </div>
</template>

<script>
import {DimensionA, initDimension} from "@/data/Dimension";
import {store} from "@/store";
import {initEvent} from "@/data/ZBEvent";
import {initCustomFormatter} from "vue";

export default {
  name: "DimensionDialogue",
  data() {
    const dimensions = store.state.data.dimensions;
    return {
      Dimension: [...dimensions].reverse(),
      isEditing: Array(DimensionA.length).fill(false),
      editedDimension: "",
      dimensionString: [],
      currentDim: {},
      newDimDetails: {
        title: "",
      },
    };
  },
  methods: {
    editDimension(index) {
      this.isEditing[index] = true;
      this.editedDimension = this.Dimension[index];
    },
    addDimension() {
      const newDim = initDimension();
      newDim.title = this.newDimDetails.title;
      newDim.position = 0;
      newDim.visible = true;
      store.commit("data/addDimension", newDim)
    },
    cancelEdit(index) {
      this.isEditing[index] = false;
    },
    saveEdit(index) {
      this.Dimension[index] = this.editedDimension;
      this.isEditing[index] = false;
      //@ts-ignore
      store.commit("data/addDimensions", this.DimensionA);
    },
    moveUp(index) {
      if (index > 0) {
        const dimensionOne = this.Dimension[index];
        const dimensionTwo = this.Dimension[index - 1];

        store.commit("data/switchDimensions", {
          dimensionOne,
          dimensionTwo,
        });
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
      }
    },

    toggleDim(index) {
      const isVisible = this.Dimension[index].visible;
      this.$store.commit("data/editDimension", {
        index: index,
        changes: { visible: !isVisible },
      });
    }


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
