<template>
  <br />
  <h1 id="edit" class="title block">Dimension bearbeiten</h1>
  <br />
  <div>
    <div v-for="(dimension, index) in DimensionA" :key="index" class="checkbox-container">
      <label>
        <input type="checkbox" v-model="selectedDimensions[index]"> {{ dimension }}
      </label>
      <button class="is-small" @click="editDimension(index)">
        <font-awesome-icon icon="pencil-alt" />
      </button>
      <input v-if="isEditing[index]" v-model="editedDimension" @blur="cancelEdit(index)" @keyup.enter="saveEdit(index)" />
    </div>
  </div>
</template>

<script>
import { DimensionA} from "@/data/Dimension";

export default {
  name: "DimensionDialogue",
  data() {
    return {
      DimensionA, // Import the array
      selectedDimensions: Array(DimensionA.length).fill(false), // Initialize an array for tracking checkbox states
      isEditing: Array(DimensionA.length).fill(false), // Initialize an array to track editing state
      editedDimension: "", // Store the edited value
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
    },
  },
};
</script>

<style scoped>
/* Add CSS to style the checkboxes and buttons */
label {
  display: block; /* Make each checkbox appear on a new line */
  margin-bottom: 10px; /* Add some spacing between checkboxes */
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
