<script setup>
import Layouts from './components/layout/Layouts.vue';
import Welcome from './components/pages/Welcome.vue';
import Dashboard from './components/pages/Dashboard.vue';
import Workout from './components/pages/Workout.vue';
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { workoutProgram } from './utils';
const defaultData = {};
for (let workoutIdx in workoutProgram) {
  const workoutData = workoutProgram[workoutIdx];
  defaultData[workoutIdx] = {};
  for (let e of workoutData.workout) {
    defaultData[workoutIdx][e.name] = '';
  }
}
const selectedDisplay = ref(1);
const data = ref(defaultData);
const selectedWorkout = ref(-1); // Example selected workout

const isWorkoutComplete = computed(() => {
  const currWorkout = data.value?.[selectedWorkout.value];
  if (!currWorkout) {
    return false;
  } // guard clause to exit function

  const isCompleteCheck = Object.values(currWorkout).every((ex) => !!ex);
  console.log('ISCOMPLETE CHECK:', isCompleteCheck);
  return isCompleteCheck;
});

const firstInCompletedWorkoutIndex = computed(() => {
  const allWorkouts = data.value;
  if (!allWorkouts) {
    return -1;
  }

  // loop over every key value pair, and check if the workout is complete or not
  for (const [index, workout] of Object.entries(allWorkouts)) {
    const isComplete = Object.values(workout).every((ex) => !!ex);
    if (!isComplete) {
      return parseInt(index);
    }
  }
  return -1; // all are complete
});

function handleChangeDisplay(idx) {
  selectedDisplay.value = idx;
}

function handleSelectWorkout(idx) {
  selectedDisplay.value = 3; // Switch to Workout display
  selectedWorkout.value = idx;
  console.log('Selected workout:', idx);
}

function handleSaveWorkout() {
  localStorage.setItem('workoutData', JSON.stringify(data.value));

  selectedDisplay.value = 2; // Switch back to Dashboard display

  selectedWorkout.value = -1; // Reset selected workout
}

function handleRestPlan() {
  selectedDisplay.value = 2; // Switch back to Dashboard display
  selectedWorkout.value = -1; // Reset selected workout
  data.value = defaultData; // Reset all workout data
  console.log('Rest plan activated, all workouts reset.');
  localStorage.removeItem('workoutData'); // Clear local storage
}
onMounted(() => {
  console.log('App component unmounted');
  if(!localStorage) {return; }
  if(localStorage.getItem('workoutData')) {
    data.value = JSON.parse(localStorage.getItem('workoutData'));
    selectedDisplay.value = 2; // Switch to Dashboard display
  } else {
    console.log('No workout data found in local storage, using default data.');
  }
});
</script>

<template>
  <Layouts>
    <Welcome :handleChangeDisplay="handleChangeDisplay" v-if="selectedDisplay == 1" />
    <!-- The Welcome component will be displayed first -->
    <Dashboard
      :handleRestPlan="handleRestPlan"
      :firstInCompletedWorkoutIndex="firstInCompletedWorkoutIndex"
      :handleSelectWorkout="handleSelectWorkout"
      v-if="selectedDisplay == 2"
    />
    <!-- The Dashboard component will be displayed after the Welcome component -->
    <Workout
      :isWorkoutComplete="isWorkoutComplete"
      :handleSaveWorkout="handleSaveWorkout"
      :data="data"
      :selectedWorkout="selectedWorkout"
      v-if="workoutProgram?.[selectedWorkout]"
    />
    <!-- The Workout component will be displayed after the Dashboard component -->
  </Layouts>
</template>

<style scoped></style>
