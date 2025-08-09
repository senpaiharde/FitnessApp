<script setup>
import Layouts from './components/layout/Layouts.vue';
import Welcome from './components/pages/Welcome.vue';
import Dashboard from './components/pages/Dashboard.vue';
import Workout from './components/pages/Workout.vue';
import LeaderBoard from './components/pages/LeaderBoard.vue';

import { ref, computed, onMounted } from 'vue';
import { workoutProgram } from './utils';
import { removeAppdata } from './service/storage';
import { useAppStore } from '@/stores/app';

const store = useAppStore();

const selectedDisplay = ref(1);
const selectedWorkout = ref(-1);

// build defaultData once from program
const defaultData = {};
for (const i in workoutProgram) {
  const plan = workoutProgram[i];
  defaultData[i] = Array.isArray(plan?.workout)
    ? plan.workout.map((ex) => ({ name: ex.name, sets: '', reps: '', weight: '' }))
    : [];
}

function mergeDefaults(existing, defaults) {
  const out = {};
  for (const k in defaults) out[k] = Array.isArray(existing?.[k]) ? existing[k] : defaults[k];
  return out;
}

onMounted(() => {
  store.init();
  if (!store.workoutData || Object.keys(store.workoutData).length === 0) {
    store.save({ workoutData: mergeDefaults(store.workoutData, defaultData) });
  }
  const hasAny =
    store.completedCount > 0 || store.steps > 0 || Object.keys(store.timerData || {}).length > 0;
  selectedDisplay.value = hasAny ? 2 : 1;
});

const isWorkoutComplete = computed(() => {
  const curr = store.workoutData?.[selectedWorkout.value];
  if (!Array.isArray(curr)) return false;
  return curr.every(
    (ex) =>
      String(ex.sets || '').trim() !== '' &&
      String(ex.reps || '').trim() !== '' &&
      String(ex.weight || '').trim() !== ''
  );
});

const firstInCompletedWorkoutIndex = computed(() => {
  const wd = store.workoutData || {};
  for (const [idx, arr] of Object.entries(wd)) {
    if (!Array.isArray(arr)) continue;
    const allFilled = arr.every(
      (ex) =>
        String(ex.sets || '').trim() !== '' &&
        String(ex.reps || '').trim() !== '' &&
        String(ex.weight || '').trim() !== ''
    );
    if (!allFilled) return parseInt(idx);
  }
  return -1;
});

// nav
function handleChangeDisplay(idx) {
  selectedDisplay.value = idx;
}
function handleSelectWorkout(idx) {
  selectedWorkout.value = idx;
  selectedDisplay.value = 3;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

// actions (call the store; no direct localStorage)
function handleRestPlan() {
  removeAppdata(); // clears raw storage
  store.resetAll(); // clears store + persists
  store.save({ workoutData: mergeDefaults({}, defaultData) });
  selectedWorkout.value = -1;
  selectedDisplay.value = 1;
}

function handleSaveWorkout(value) {
  const wk = selectedWorkout.value;
  const merged = { ...(store.workoutData || {}) };
  merged[wk] = value;
  store.save({ workoutData: merged });
  store.incrementWorkout(todayISO());
  selectedWorkout.value = -1;
  selectedDisplay.value = 2;
}

function handleSaveTimerData(payload) {
  let seconds = 0;
  let key = selectedWorkout.value;

  if (typeof payload === 'number') seconds = payload;
  else if (payload && typeof payload === 'object') {
    seconds = payload.seconds ?? payload.time ?? 0;
    key = payload.key ?? key;
  }
  if (key == null || key < 0 || seconds <= 0) return;

  store.upsertTimer(key, seconds);
  const th = { ...(store.timeHistory || {}) };
  th[todayISO()] = (th[todayISO()] || 0) + seconds;
  store.save({ timeHistory: th });
}

function handleSaveSteps(delta) {
  store.addSteps(todayISO(), delta);
}

function handleAddWorkout(value) {
  const wk = selectedWorkout.value;
  const arr = Array.isArray(store.workoutData?.[wk]) ? [...store.workoutData[wk]] : [];
  arr.push({ name: value.name, sets: value.sets, reps: value.reps, weight: value.weight });
  const merged = { ...(store.workoutData || {}) };
  merged[wk] = arr;
  store.save({ workoutData: merged });
}

function handleDeleteExercise(exerciseIndex) {
  const wk = selectedWorkout.value;
  const arr = Array.isArray(store.workoutData?.[wk]) ? [...store.workoutData[wk]] : [];
  arr.splice(exerciseIndex, 1);
  const merged = { ...(store.workoutData || {}) };
  merged[wk] = arr;
  store.save({ workoutData: merged });
}

function handleReorderWorkout(updatedList) {
  const wk = selectedWorkout.value;
  const merged = { ...(store.workoutData || {}) };
  merged[wk] = updatedList;
  store.save({ workoutData: merged });
}
</script>

<template>
  <Layouts :selectedDisplay="selectedDisplay" :handleChangeDisplay="handleChangeDisplay">
    <Welcome :handleChangeDisplay="handleChangeDisplay" v-if="selectedDisplay == 1" />

    <Dashboard
      :handleRestPlan="handleRestPlan"
      :firstInCompletedWorkoutIndex="firstInCompletedWorkoutIndex"
      :handleSelectWorkout="handleSelectWorkout"
      v-if="selectedDisplay == 2"
    />

    <Workout
      :handleReorderWorkout="handleReorderWorkout"
      :handleDeleteExercise="handleDeleteExercise"
      :handleAddWorkout="handleAddWorkout"
      :timerData="store.timerData"
      :steps="store.steps"
      :workoutData="store.workoutData"
      :handleSaveSteps="handleSaveSteps"
      :handleSaveTimerData="handleSaveTimerData"
      :isWorkoutComplete="isWorkoutComplete"
      :handleSaveWorkout="handleSaveWorkout"
      :selectedWorkout="selectedWorkout"
      v-if="selectedDisplay === 3 && selectedWorkout >= 0"
      @finishWorkout="selectedDisplay = 2"
    />

    <LeaderBoard
      :firstInCompletedWorkoutIndex="firstInCompletedWorkoutIndex"
      :selectedWorkout="selectedWorkout"
      :steps="store.steps"
      :timerData="store.timerData"
      :workoutData="store.workoutData"
      v-if="selectedDisplay === 4"
    />
  </Layouts>
</template>

<style scoped></style>
