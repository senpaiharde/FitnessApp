<script setup>
import { Transition, ref } from 'vue';

const props = defineProps({
  selectedWorkout: Number,
  steps: Number,
  timerData: Object,
  workoutData: Object,
  firstInCompletedWorkoutIndex: Number,
});
const showStats = ref(true);
const totalWorkouts = Object.keys(props.workoutData).length;
const timeSpent = Object.values(props.timerData).reduce((acc, curr) => {
  return acc + (curr.time || 0) + (curr.minute || 0) * 60 + (curr.hour || 0) * 3600;
}, 0);
console.log('Total time spent in seconds:', showStats.value);
const totalTimesSpend = {
  hours: Math.floor(timeSpent / 3600),
  minutes: Math.floor((timeSpent % 3600) / 60),
  seconds: timeSpent % 60,
};
function toggleStats() {
  showStats.value = !showStats.value;
}
const workoutDisplay = [
  {
    workout: 'Total Workouts',
    classname: 'card-icon fa-solid fa-dumbbell',
    value: props.firstInCompletedWorkoutIndex + 1 + ' / ' + totalWorkouts,
  },
  {
    workout: 'Total Steps',
    classname: 'card-icon fa-solid fa-weight-hanging',
    value: props.steps.toLocaleString() + ' steps',
  },
  {
    workout: 'Total Time',
    classname: 'card-icon fa-solid fa-bolt',
    value:
      [
        totalTimesSpend.hours,
        totalTimesSpend.minutes < 10 ? '0' + totalTimesSpend.minutes : totalTimesSpend.minutes,
        totalTimesSpend.seconds < 10 ? '0' + totalTimesSpend.seconds : totalTimesSpend.seconds,
      ].join(':') + ' minutes',
  },
];
</script>

<template>
  <!-- Toggle Button -->
  <div class="toggle-bar">
    <button @click="toggleStats">
      {{ showStats ? 'Hide Stats ▲' : 'Show Stats ▼' }}
    </button>
  </div>

  <!-- Collapsible Stats Grid -->
  <transition name="slide-fade">
    <section id="grid" v-show="showStats">
      <div v-for="(item, idx) in workoutDisplay" :key="idx" class="row">
        <!-- Left 25% -->
        <div class="card-div plan-cardD">
          <div class="card">
            <p class="card-title">{{ item.workout }}</p>
          </div>
        </div>

        <!-- Right 75% -->
        <div class="card-div plan-card-resetT">
          <p class="card-title">{{ item.value }}</p>
          <i :class="item.classname"></i>
        </div>
      </div>
      <div class="top-row">
        <div class="card-div plan-cardD">
          <div class="card">
            <p class="card-title">Current Workout</p>
          </div>
        </div>
      </div>
    </section>
  </transition>
  <sections id="Daddy"> </sections>
</template>

<style scoped>
.toggle-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.toggle-bar button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

/* Slide & Fade Animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

#grid {
  border: 1px solid var(--border-secondary);
  display: flex;
  flex-direction: column; /* stack rows vertically */
  gap: 1rem;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 25% 75%; /* 2-column row */

  width: 100%;
}

.plan-cardD {
  height: 60px;
  display: flex;
  flex-direction: column;
}

.plan-card-resetT {
  padding-left: 1rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
