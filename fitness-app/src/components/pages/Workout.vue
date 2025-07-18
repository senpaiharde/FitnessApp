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
      <div v-for="(exercise, idx) in workout" :key="idx" class="workout-grid-row">
        <div class="grid-name">
          <p>{{ exercise.name }}</p>
          <button>
            <i class="fa-regular fa-circle-question"></i>
          </button>
          <p>{{ exercise.sets }}</p>
          <p>{{ exercise.reps }}</p>
          <input class="grid-weights" type="text" placeholder="23Kg"  />
        </div>
      </div>
    </div>

    <button @click="() => handleChangeDisplay(2)">Back to Dashboard &larr;</button>
  </section>
</template>

<style scoped></style>
