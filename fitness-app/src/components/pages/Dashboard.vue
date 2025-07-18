<script setup>
import { gymHealthFacts } from '../../utils/index';
import Grid from '../Grid.vue';
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
      <button @click="() => handleChangeDisplay(3)">Start Workout &rarr;</button>
    </div>
    <Grid />
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
