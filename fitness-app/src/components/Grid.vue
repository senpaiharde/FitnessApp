<script setup>
import { workoutProgram } from '../utils';
const workoutTypes = ['push', 'pull', 'legs'];

const props = defineProps({
  handleSelectWorkout: Function,
  firstInCompletedWorkoutIndex: Number,
  handleRestPlan: Function,
});
console.log(
  'Grid component loaded',
  props.handleRestPlan,
  props.handleSelectWorkout,
  props.firstInCompletedWorkoutIndex
);
</script>

<template>
  <section id="grid">
    <button
      v-for="(workout, workoutIdx) in Object.keys(workoutProgram)"
      :disabled="workoutIdx > 0 && workoutIdx > props.firstInCompletedWorkoutIndex"
      :key="workoutIdx"
      class="card-button plan-card"
      @click="props.handleSelectWorkout(workoutIdx)"
    >
      <div class="card">
        <p class="card-title">{{ workout < 9 ? '0' + (workoutIdx + 1) : workoutIdx + 1 }}</p>
        <i class="card-icon fa-solid fa-dumbbell" v-if="workout % 3 == 0"></i>
        <i class="card-icon fa-solid fa-weight-hanging" v-if="workout % 3 == 1"></i>
        <i class="card-icon fa-solid fa-bolt" v-if="workout % 3 == 2"></i>
      </div>
      <h3>{{ workoutTypes[workoutIdx % 3] }}</h3>
    </button>
    <button
      :disabled="props.firstInCompletedWorkoutIndex == -1"
      class="card-button plan-card-reset"
      @click="
        () => (console.log('Resetting workout plan', props.handleRestPlan), props.handleRestPlan())
      "
    >
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
