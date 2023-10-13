<template>
  <br />
  <h1 id="edit" class="title block">Dimension bearbeiten</h1>
  <br />
  <div>
    <div v-for="(dimension, index) in DimensionA" :key="index" class="checkbox-container">
      <label v-if="!isEditing[index]">
        <input type="checkbox" v-model="selectedDimensions[index]" checked> {{ dimension }}
      </label>
      <input v-if="isEditing[index]" v-model="editedDimension" @blur="cancelEdit(index)" @keyup.enter="saveEdit(index)" />
      <button class="button is-small" @click="editDimension(index)">
        <font-awesome-icon icon="pencil-alt" />
      </button>
    </div>
  </div>
  <br />
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input
              class="input"
              type="text"
              placeholder="Titel der neuen Dimension"
          />
        </div>
      </div>
    </div>
    <button class="button is-link is-light">
      Dimension hinzufügen
    </button>
  </div>
</template>

<script>
import { DimensionA} from "@/data/Dimension";
import {store} from "@/store";

export default {
  name: "DimensionDialogue",
  data() {
    return {
      DimensionA,
      selectedDimensions: Array(DimensionA.length).fill(false),
      isEditing: Array(DimensionA.length).fill(false),
      editedDimension: "",
      dimensionString: [],
    };
  },
  methods: {
    editDimension(index) {
      this.isEditing[index] = true;
      this.editedDimension = this.DimensionA[index];
    },
    cancelEdit(index) {
      this.isEditing[index] = false;
    },
    saveEdit(index) {
      this.DimensionA[index] = this.editedDimension;
      this.isEditing[index] = false;
      //@ts-ignore
      store.commit("data/addDimensions", this.DimensionA);
    },
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
