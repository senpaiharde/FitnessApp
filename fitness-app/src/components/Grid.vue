<script setup>
import { workoutProgram } from '../utils';
const workoutTypes = ['push', 'pull', 'legs'];
</script>

<template>
  <section id="grid">
    <button
     :key="workoutIdx"
      v-for="(workout, workoutIdx) in Object.keys(workoutProgram)"
      class="card-button plan-card"
    >
      <div class="card">
        <p class="card-title">{{ workout < 9 ? '0' + (workoutIdx + 1) : workoutIdx + 1 }}</p>
        ICON
      </div>
      <h3>Types</h3>
    </button>
  </section>
</template>

<style scoped></style>
