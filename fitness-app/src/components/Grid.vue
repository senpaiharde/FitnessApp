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
        <i class="card-icon fa-solid fa-dumbbell" v-if="workout % 3 == 0"></i>
        <i class="card-icon fa-solid fa-weight-hanging" v-if="workout % 3 == 1"></i>
        <i class="card-icon fa-solid fa-bolt" v-if="workout % 3 == 2"></i>
      </div>
      <h3>Types</h3>
    </button>
  </section>
</template>

<style scoped></style>
