<script setup>
const props = defineProps({
  selectedWorkout: Number,
  steps: Number,
  timerData: Object,
  workoutData: Object,
  firstInCompletedWorkoutIndex: Number,
});
const totalWorkouts = Object.keys(props.workoutData).length;
const timeSpent = Object.values(props.timerData).reduce((acc, curr) => {
  return acc + (curr.time || 0) + (curr.minute || 0) * 60 + (curr.hour || 0) * 3600;
}, 0);
const totalTimesSpend = {
  hours: Math.floor(timeSpent / 3600),
  minutes: Math.floor((timeSpent % 3600) / 60),
  seconds: timeSpent % 60,
};

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
      ].join(':') + ' hrs',
  },
];
console.log('daddy', props.firstInCompletedWorkoutIndex);
</script>

<template>
  <section id="grid">
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
  </section>
</template>

<style scoped>
#grid {
  display: flex;
  flex-direction: column; /* stack rows vertically */
  gap: 1rem;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 25% 75%; /* 2-column row */
  gap: 1rem;
  width: 100%;
}

.plan-cardD {
  height: 60px;
  display: flex;
  flex-direction: column;
}

.plan-card-resetT {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
