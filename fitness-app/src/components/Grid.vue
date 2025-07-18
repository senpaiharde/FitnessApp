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
      <h3>{{ workoutTypes[workoutIdx % 3] }}</h3>
    </button>
  </section>
</template>

<style scoped>
#grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
#grid button {
  width: 100%;
}
.plan-card {
  display: flex;
  flex-direction: column;
}
.plan-card div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
.plan-card dev p {
  text-align: left;
}
@media (min-width: 640px) {
  #grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
