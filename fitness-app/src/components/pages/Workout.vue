<script setup>
import { workoutProgram, exerciseDescriptions } from '../../utils';
import Portal from '../Portal.vue';
const selectedWorkout = 4; // Example selected workout
const { workout, warmup } = workoutProgram[selectedWorkout];
const selectedExercise = workout[3]; // Example selected exercise
const exerciseDescription =
  exerciseDescriptions[selectedExercise.name] || 'No description available';
</script>

<template>
  <Portal>
    <div class="exercise-description">
      <h4>{{ selectedExercise.name }}</h4>

      <div class="exercise-image">
        <small>Description</small>
        <p class="exercise-description">
          {{ exerciseDescription || 'No description available for this exercise.' }}
        </p>
      </div>
      <button @click="$emit('close')">
        Close
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </Portal>
  <section id="workout-card">
    <div class="plan-card card">
      <div class="plan-card-header">
        <p>Day {{ selectedWorkout < 9 ? '0' + selectedWorkout : selectedWorkout }}</p>
        <i class="fa-solid fa-dumbbell"></i>
      </div>
      <h2>{{}}</h2>
    </div>
    <div class="workout-grid">
      <h4 class="grid-name">Warmup</h4>
      <h6>sets</h6>
      <h6>reps</h6>
      <h6>weights</h6>
      <div v-for="(exercise, idx) in warmup" :key="idx" class="workout-grid-row">
        <div class="grid-name">
          <p>{{ exercise.name }}</p>
          <button>
            <i class="fa-regular fa-circle-question"></i>
          </button>
        </div>
        <p>{{ exercise.sets }}</p>
        <p>{{ exercise.reps }}</p>
        <input class="grid-weights" type="text" placeholder="23Kg" disabled />
      </div>

      <div class="workout-grid-line"></div>
      <h4 class="grid-name">Workout</h4>
      <h6>sets</h6>
      <h6>reps</h6>
      <h6 class="grid-weights">weights</h6>
      <div v-for="(exercise, idx) in workout" :key="idx" class="workout-grid-row">
        <div class="grid-name">
          <p>{{ exercise.name }}</p>
          <button>
            <i class="fa-regular fa-circle-question"></i>
          </button>
        </div>
        <p>{{ exercise.sets }}</p>
        <p>{{ exercise.reps }}</p>
        <input class="grid-weights" type="text" placeholder="23Kg" />
      </div>
    </div>

    <div class="card workout-btns">
      <button @click="() => handleChangeDisplay(2)">
        Save & Exit
        <i class="fa-solid fa-save"></i>
      </button>
      <button @click="() => handleChangeDisplay(2)">
        Complete
        <i class="fa-solid fa-check"></i>
      </button>
    </div>
  </section>
</template>

<style scoped>
#workout-card,
.plan-card {
  display: flex;
  flex-direction: column;
}
#workout-card {
  gap: 1.5rem;
}
.plan-card-header,
.workout-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.workout-grid,
.workout-grid-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1rem;
  align-items: center;
}
.workout-grid-row,
.workout-grid-line {
  grid-column: span 7 / span 7;
}
.workout-grid-line {
  margin: 0.5rem 0;
  height: 3px;
  border-radius: 2px;
  background: var(--background-muted);
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
.grid-name button {
  padding: 0;
  border: none;
  box-shadow: none;
}
.grid-name button:hover {
  transform: none;
  box-shadow: none;
  color: var(--color-link);
}
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
.workout-btns button {
  flex: 1;
}
.workout-btns button i {
  padding-left: 0.5rem;
}
.exercise-description {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
