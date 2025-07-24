<script setup>
import Layouts from './components/layout/Layouts.vue';
import Welcome from './components/pages/Welcome.vue';
import Dashboard from './components/pages/Dashboard.vue';
import Workout from './components/pages/Workout.vue';
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { workoutProgram } from './utils';
import { loadAppData, removeAppdata, updateAppData } from './service/storage';
const defaultData = {};
for (let workoutIdx in workoutProgram) {
  const workoutData = workoutProgram[workoutIdx];
  defaultData[workoutIdx] = {};
  for (let e of workoutData.workout) {
    defaultData[workoutIdx][e.name] = { sets: '', reps: '', weight: '' };
  }
}
const selectedDisplay = ref(1);
const data = ref(defaultData);
const selectedWorkout = ref(-1); // Example selected workout

const isWorkoutComplete = computed(() => {
  const curr = data.value[selectedWorkout.value];
  if (!curr) return false;

  return Object.values(curr).every(
    (ex) => ex.sets.trim() !== '' && ex.reps.trim() !== '' && ex.weight.trim() !== ''
  );
});
const firstInCompletedWorkoutIndex = computed(() => {
  for (const [idx, workoutObj] of Object.entries(data.value)) {
    const allFilled = Object.values(workoutObj).every(
      (ex) => ex.sets.trim() !== '' && ex.reps.trim() !== '' && ex.weight.trim() !== ''
    );
    if (!allFilled) return parseInt(idx);
  }
  return -1;
});

function handleChangeDisplay(idx) {
  selectedDisplay.value = idx;
}

function handleSelectWorkout(idx) {
  selectedDisplay.value = 3; // Switch to Workout display
  selectedWorkout.value = idx;
 
}

function handleSaveWorkout() {
    updateAppData({workoutData: data.value})
  //localStorage.setItem('workoutData', JSON.stringify(data.value));

  selectedDisplay.value = 2; // Switch back to Dashboard display

  selectedWorkout.value = -1; // Reset selected workout
}

function handleRestPlan() {
    removeAppdata()
  window.location.reload(); // Reload the page to reset the state
}

onMounted(() => {
  
 
    // only enter the if block if we find some data saved to the key workouts in localstroage database
    let { workoutData } = loadAppData();
    
    data.value = workoutData ?? defaultData;
    selectedDisplay.value = 2; // if they have data, then we dont want them landing on the welcome screen every time they enter the app
  
});
</script>

<template>
  <Layouts :handleChangeDisplay="handleChangeDisplay" >
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
