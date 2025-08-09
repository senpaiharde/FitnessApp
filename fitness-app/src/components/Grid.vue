<script setup>
import { computed } from 'vue';
import { workoutProgram } from '../utils';

const props = defineProps({
  handleSelectWorkout : Number,
  firstInCompletedWorkoutIndex : Number,
  handleRestPlan : Function,
});

// Use numeric, sorted indices (Object.keys returns strings)
const programIndices = computed(() =>
  Object.keys(workoutProgram)
    .map((k) => Number(k))
    .sort((a, b) => a - b)
);

// lock any workout with index greater than the first incomplete (except index 0)
function isLocked(idx) {
  const cut = props.firstInCompletedWorkoutIndex;
  return typeof cut === 'number' && idx > 0 && idx > cut;
}

function formatNum(idx) {
  return String(idx + 1).padStart(2, '0');
}

function iconClass(idx) {
  const mod = idx % 3;
  if (mod === 0) return 'fa-solid fa-dumbbell';
  if (mod === 1) return 'fa-solid fa-weight-hanging';
  return 'fa-solid fa-bolt';
}

function selectWorkout(idx) {
  if (typeof props.handleSelectWorkout === 'function') props.handleSelectWorkout(idx);
}

function onReset() {
  if (typeof props.handleRestPlan === 'function') props.handleRestPlan();
}

const canReset = computed(() => props.firstInCompletedWorkoutIndex !== -1);

const workoutTypes = ['push', 'pull', 'legs'];
</script>

<template>
  <section id="grid">
    <button
      v-for="idx in programIndices"
      :key="idx"
      class="card-button plan-card"
      :disabled="isLocked(idx)"
      @click="selectWorkout(idx)"
    >
      <div class="card">
        <p class="card-title">{{ formatNum(idx) }}</p>
        <i class="card-icon" :class="iconClass(idx)"></i>
      </div>
      <h3>{{ workoutTypes[idx % 3] }}</h3>
    </button>

    <button class="card-button plan-card-reset" :disabled="!canReset" @click="onReset">
      <p class="card-title">Rest</p>
      <i class="fa-solid fa-rotate-left"></i>
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
#grid button:disabled {
  box-shadow: none;
  cursor: not-allowed;
}
.plan-card {
  display: flex;
  flex-direction: column;
}
.plan-card-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.plan-card div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.plan-card div p {
  text-align: left;
}
@media (min-width: 640px) {
  #grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
