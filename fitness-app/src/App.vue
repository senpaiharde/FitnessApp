<script setup>
import Layouts from './components/layout/Layouts.vue';
import Welcome from './components/pages/Welcome.vue';
import Dashboard from './components/pages/Dashboard.vue';
import Workout from './components/pages/Workout.vue';

import { ref, computed, onUnmounted, onMounted, reactive } from 'vue';
import { workoutProgram } from './utils';
import { loadAppData, removeAppdata, updateAppData } from './service/storage';
import LeaderBoard from './components/pages/LeaderBoard.vue';
import { formatISO } from 'date-fns';
const defaultData = {};
for (let workoutIdx in workoutProgram) {
  const workoutData = workoutProgram[workoutIdx];

  defaultData[workoutIdx] = workoutData.exercises.map((exercise) => ({
    name: exercise.name,
    sets: '',
    reps: '',
    weight: '',
  }));
}
const selectedDisplay = ref(1);

const selectedWorkout = ref(-1); // Example selected workout

const appData = reactive({
  timerData: {},
  workoutData: defaultData,
  steps: 0,
  completedCount: 0,
  stepHistory: { type: Object, default: () => ({}) },
  workoutHistory: { type: Object, default: () => ({}) },
  timeHistory: { type: Object, default: () => ({}) },
});
onMounted(() => {
  // only enter the if block if we find some data saved to the key workouts in localstroage database
  const store = loadAppData() || {};
  const loadedData = store.workoutData || {};

  // Ensure every workout index exists by merging defaults
  const mergedData = {};
for (const idx in defaultData) {
  const loaded = loadedData[idx];

  if (Array.isArray(loaded)) {
    mergedData[idx] = loaded;
  } else if (loaded && typeof loaded === 'object') {
    // Convert old object format to array
    mergedData[idx] = Object.entries(loaded).map(([name, values]) => ({
      name,
      ...values,
    }));
  } else {
    mergedData[idx] = defaultData[idx];
  }
}
  appData.timerData = store?.timerData || {};
  appData.steps = store?.steps || 0;
  appData.workoutData = mergedData;

  const hasSaved = Object.keys(store).length > 0;
  selectedDisplay.value = hasSaved ? 2 : 1;
});

const isWorkoutComplete = computed(() => {
  const curr = appData.workoutData[selectedWorkout.value];
  console.log('isWorkoutComplete check', curr);
  if (!curr) return false;

  return curr.every(
    (ex) => ex.sets?.trim?.() !== '' && ex.reps?.trim?.() !== '' && ex.weight?.trim?.() !== ''
  );
});
const firstInCompletedWorkoutIndex = computed(() => {
  for (const [idx, workoutObj] of Object.entries(appData.workoutData)) {
    const allFilled = workoutObj.every(
      (ex) =>  ex.sets?.trim?.() !== ''  && ex.reps?.trim?.() !== '' && ex.weight?.trim?.() !== ''
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

// save the current date in ISO format
const today = formatISO(new Date(), { representation: 'date' });
const data = loadAppData();

function handleRestPlan() {
  removeAppdata();
  appData.workoutData = defaultData; // Reset workout data
  appData.timerData = {};
  appData.steps = 0; // Reset steps
  appData.completedCount = 0; // Reset completed count
  selectedDisplay.value = 1; // Switch back to Welcome display
  window.location.reload(); // Reload the page to reset the state
}

function handleSaveWorkout(value) {
  const workoutHistory = { ...(data.workoutHistory || {}) };
  workoutHistory[today] = (workoutHistory[today] || 0) + 1;
  appData.workoutHistory = workoutHistory;

  appData.workoutData[selectedWorkout.value] = value;

  appData.completedCount++;

  //localStorage.setItem('workoutData', JSON.stringify(data.value));
  updateAppData({
    workoutData: appData.workoutData,
    completedCount: appData.completedCount,
    workoutHistory,
  });
  selectedDisplay.value = 2; // Switch back to Dashboard display

  selectedWorkout.value = -1; // Reset selected workout
}

function handleSaveTimerData(value) {
  // Clone & accumulate into today’s bucket
  const timerHistory = { ...data.timeHistory };
  timerHistory[today] = (timerHistory[today] || 0) + value;

  // (Optionally prune old dates here…)

  // Update both the raw timerData and the historical log
  appData.timerData = value;
  appData.timeHistory = timerHistory;

  updateAppData({
    timerData: appData.timerData,
    timeHistory: timerHistory || {},
  });
}

function handleSaveSteps(value) {
  const stepsHistory = { ...(data.stepHistory || {}) };
  stepsHistory[today] = (stepsHistory[today] || 0) + value;

  appData.steps = value;
  appData.stepHistory = stepsHistory;
  updateAppData({
    steps: appData.steps,
    stepHistory: stepsHistory,
  });
}
</script>

<template>
  <Layouts
    :appData="appData"
    :selectedDisplay="selectedDisplay"
    :handleChangeDisplay="handleChangeDisplay"
  >
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
      v-if="selectedDisplay === 4"
    />
  </Layouts>
</template>

<style scoped></style>
