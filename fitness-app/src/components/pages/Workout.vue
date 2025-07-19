<script setup>
import { workoutProgram } from '../../utils';
const selectedWorkout = 4; // Example selected workout
const { workout, warmup } = workoutProgram[selectedWorkout];
</script>

<template>
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
      <h6 class="grid-name">sets</h6>
      <h6 class="grid-name">reps</h6>
      <h6 class="grid-weights">weights</h6>
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
      <h6 class="grid-name">sets</h6>
      <h6 class="grid-name">reps</h6>
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

    <div class="card">
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
.plan-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.workout-grid,
.workout-grid-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1rem;
}
.workout-grid-row,
.workout-grid-line {
  grid-column: span 7 / span 7;
}
.grid-name{
    grid-column: span 3 / span 3;
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
</style>
