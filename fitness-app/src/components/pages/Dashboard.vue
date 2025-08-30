<script setup>
import { computed, ref } from 'vue';

import Grid from '../Grid.vue';
import { gymHealthFacts } from '../../utils';
import { useAppStore } from '../../utils/app';
const props = defineProps({
  firstInCompletedWorkoutIndex: Number,
  handleRestPlan: Function, // keep if truly needed
});

const store = useAppStore();

// stable “daily tip” (same tip for the whole day)
const facts = gymHealthFacts;
const dayKey = new Date().toDateString();
const dailyIndex =
  Math.abs(dayKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % facts.length;
const randomFact = ref(facts[dailyIndex]);

// compute safe start index (fallback to 0)
const startIndex = computed(() =>
  typeof props.firstInCompletedWorkoutIndex === 'number' && props.firstInCompletedWorkoutIndex >= 0
    ? props.firstInCompletedWorkoutIndex
    : 0
);

// never put inline arrows in template
function startWorkout() {
  store.selectWorkout(startIndex.value);
}
</script>

<template>
  <section id="dashboard">
    <div class="card tip-container">
      <h2>Welcome Natty</h2>
      <div>
        <p class="tip">
          <strong>Daily Tip</strong><br />
          {{ randomFact }}
        </p>
      </div>
      <button @click="startWorkout">Start Workout →</button>
    </div>

    <Grid
      :handle-select-workout="props.handleSelectWorkout"
      :first-in-completed-workout-index="props.firstInCompletedWorkoutIndex"
      :handle-rest-plan="props.handleRestPlan" />
  </section>
</template>

<style scoped>
.tip-container,
.tip-container div,
#dashboard {
  display: flex;
}
.tip-container,
#dashboard {
  flex-direction: column;
}
#dashboard {
  gap: 2rem;
}
.tip-container {
  gap: 0.5rem;
  border: 1.5px solid var(--border-secondary);
}
@media (min-width: 640px) {
  .tip-container {
    gap: 1rem;
  }
}
</style>
