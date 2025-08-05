<script setup>
import { workoutProgram, exerciseDescriptions } from '../../utils';
import { computed, ref } from 'vue';
const props = defineProps({
  selectedWorkout: Number,
});
const warmup = computed(() => workoutProgram[props.selectedWorkout]?.warmup || []);
console.log(warmup, 'yes');
let selectedExercise = ref(null);
const exerciseDescription = computed(() => exerciseDescriptions[selectedExercise.value]);
</script>

<template>
  <div v-for="(exercise, idx) in warmup" :key="exercise.name + idx" class="workout-grid-row">
    <div class="grid-name">
      <p>{{ exercise.name }}</p>
      <button
        @click="
          () => {
            selectedExercise = exercise.name;
          }
        "
      >
        <i class="fa-regular fa-circle-question"></i>
      </button>
    </div>
    <p>{{ exercise?.sets || '-' }}</p>
    <p>{{ exercise.reps || '-' }}</p>

    <input class="grid-weights" type="text" placeholder="23Kg" disabled />
  </div>
</template>

<style scoped>
.workout-grid-row .grid-name button {
  opacity: 0;
  pointer-events: none;
}
.workout-grid-row:hover .grid-name button {
  opacity: 1;
  pointer-events: all;
}
.grid-name p {
  text-transform: capitalize;
}
.grid-name button:hover {
  transform: none;
  box-shadow: none;
  color: var(--color-link);
}
.grid-name button {
  padding: 0;
  border: none;
  box-shadow: none;
}
.grid-name {
  grid-column: span 3 / span 3;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.grid-weights {
  grid-column: span 2 / span 2;
}
.workout-grid,
.workout-grid-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1rem;
  align-items: center;
  cursor: grab;
}
.workout-grid-row,
.workout-grid-line {
  grid-column: span 7 / span 7;
}
</style>
