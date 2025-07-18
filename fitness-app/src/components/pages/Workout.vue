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
      </div>
    </div>
    <button @click="() => handleChangeDisplay(2)">Back to Dashboard &larr;</button>
  </section>
</template>

<style scoped></style>
