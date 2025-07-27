<script setup>
const workoutDisplay = [
    {
        workout : "Total Workouts",
        classname : "card-icon fa-solid fa-dumbbell"
    },
    {
        workout : "Total Steps",
        classname :"card-icon fa-solid fa-weight-hanging"
    },
    {
        workout : "Total Time",
        classname :"card-icon fa-solid fa-bolt"
    }
]
</script>

<template>
  <section id="grid">
    <div v-for="(workout, workoutIdx) in Object.keys(workoutDisplay)" :key="workoutIdx" class="row">
      <!-- Left 25% -->
      <div class="card-div plan-card">
        <div class="card">
         
            <p class="card-title">{{ workoutDisplay[workout].workout }}</p>
            <i :class="workoutDisplay[workout].classname"></i>
        </div>
      </div>

      <!-- Right 75% -->
      <div class="card-div plan-card-reset">
        <p class="card-title">Rest / Totals for {{ workoutDisplay[workout] }}</p>
        <i class="fa-solid fa-rotate-left"></i>
      </div>
    </div>
  </section>
</template>

<style scoped>
#grid {
  display: flex;
  flex-direction: column; /* stack rows vertically */
  gap: 1rem;
}

.row {
  display: grid;
  grid-template-columns: 25% 75%; /* 2-column row */
  gap: 1rem;
  width: 100%;
}

.plan-card {
  display: flex;
  flex-direction: column;
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 1rem;
}

.plan-card-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f3f3;
  border: 1px solid #ddd;
  padding: 1rem;
}
</style>
