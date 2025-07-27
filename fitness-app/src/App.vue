<script setup>
import Layouts from './components/layout/Layouts.vue';
import Welcome from './components/pages/Welcome.vue';
import Dashboard from './components/pages/Dashboard.vue';
import Workout from './components/pages/Workout.vue';
import { ref, computed, onUnmounted, onMounted, reactive } from 'vue';
import { workoutProgram } from './utils';
import { loadAppData, removeAppdata, updateAppData } from './service/storage';
import LeaderBoard from './components/pages/LeaderBoard.vue';
const defaultData = {};
for (let workoutIdx in workoutProgram) {
  const workoutData = workoutProgram[workoutIdx];
  defaultData[workoutIdx] = {};
  for (let e of workoutData.workout) {
    defaultData[workoutIdx][e.name] = { sets: '', reps: '', weight: '' };
  }
}
const selectedDisplay = ref(1);

const selectedWorkout = ref(-1); // Example selected workout

const appData = reactive({
  timerData: {},
  workoutData: defaultData,
  steps: 0,
});
onMounted(() => {
  // only enter the if block if we find some data saved to the key workouts in localstroage database
  const store = loadAppData() || {};
  const loadedData = store.workoutData || {};

  // Ensure every workout index exists by merging defaults
  const mergedData = { ...defaultData };
  for (const idx in defaultData) {
    mergedData[idx] = {
      ...defaultData[idx],
      ...(loadedData[idx] || {}), // keep any saved values
    };
  }
  appData.timerData = store?.timerData || {};
  appData.steps = store?.steps || 0;
  appData.workoutData = mergedData;

  const hasSaved = Object.keys(store).length > 0;
  selectedDisplay.value = hasSaved ? 2 : 1;
});
console.log('App mounted with data:', appData, selectedWorkout.value, selectedDisplay.value);
const isWorkoutComplete = computed(() => {
  const curr = appData.workoutData[selectedWorkout.value];
  console.log('isWorkoutComplete check', curr);
  if (!curr) return false;

  return Object.values(curr).every(
    (ex) => ex.sets.trim() !== '' && ex.reps.trim() !== '' && ex.weight.trim() !== ''
  );
});
const firstInCompletedWorkoutIndex = computed(() => {
  for (const [idx, workoutObj] of Object.entries(appData.workoutData)) {
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
  console.log('Selected workout:', idx);

  selectedDisplay.value = 3; // Switch to Workout display
  selectedWorkout.value = idx;
  console.log('Selected workout index:', selectedWorkout.value);
}

function handleSaveWorkout(value) {
  appData.workoutData[selectedWorkout.value] = value;
  updateAppData({ workoutData: appData.workoutData });
  //localStorage.setItem('workoutData', JSON.stringify(data.value));

  selectedDisplay.value = 2; // Switch back to Dashboard display

  selectedWorkout.value = -1; // Reset selected workout
}

function handleRestPlan() {
  removeAppdata();
  appData.workoutData = defaultData; // Reset workout data
  appData.timerData = {};
  appData.steps = 0; // Reset steps
  selectedDisplay.value = 1; // Switch back to Welcome display
  window.location.reload(); // Reload the page to reset the state
}
function handleSaveTimerData(value) {
  appData.timerData = value;
  updateAppData({ timerData: appData.timerData });
}

function handleSaveSteps(value) {
  appData.steps = value;
  updateAppData({ steps: appData.steps });
}
</script>

<template>
  <Layouts :handleChangeDisplay="handleChangeDisplay">
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
      :timerData="appData.timerData"
      :steps="appData.steps"
      :workoutData="appData.workoutData"
      :handleSaveSteps="handleSaveSteps"
      :handleSaveTimerData="handleSaveTimerData"
      :isWorkoutComplete="isWorkoutComplete"
      :handleSaveWorkout="handleSaveWorkout"
      :selectedWorkout="selectedWorkout"
      v-if="selectedDisplay === 3 && selectedWorkout >= 0"
    />
    <!-- The Workout component will be displayed after the Dashboard component -->

   
      <LeaderBoard  
      :firstInCompletedWorkoutIndex="firstInCompletedWorkoutIndex"
      
      :selectedWorkout="selectedWorkout"
      :steps="appData.steps"
      :timerData="appData.timerData"
      :workoutData="appData.workoutData"
      v-if="selectedDisplay === 4" />
  </Layouts>
</template>

<style scoped></style>
