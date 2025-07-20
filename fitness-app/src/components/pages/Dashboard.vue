<script setup>
import { gymHealthFacts } from '../../utils/index';
import Grid from '../Grid.vue';

const props = defineProps({
  handleSelectWorkout: Function,
  firstInCompletedWorkoutIndex: Number,
});
console.log('Dashboard component loaded', props);

const randomFact = gymHealthFacts[Math.floor(Math.random() * gymHealthFacts.length)];
</script>

<template>
  <section id="dashboard">
    <div class="card tip-container">
      <h2>Welcome Natty</h2>
      <div>
        <p class="tip">
          <strong> Daily Tip</strong> <br />
          {{ randomFact }}
        </p>
      </div>
      <button @click="() => handleSelectWorkout(firstInCompletedWorkoutIndex < 0 ? 0 : firstInCompletedWorkoutIndex)">Start Workout &rarr;</button>
    </div>
    <Grid  v-bind="props" />
  </section>
</template>

<style scoped>
.tip-container, .tip-container div,
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
  
}
@media (min-width: 640px) {
  
  .tip-container {
    gap: 1rem;
  }
    
}
</style>
