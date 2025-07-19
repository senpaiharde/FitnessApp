<script setup>
import Layouts from './components/layout/Layouts.vue';
import Welcome from './components/pages/Welcome.vue';
import Dashboard from './components/pages/Dashboard.vue';
import Workout from './components/pages/Workout.vue';
import { ref, computed } from 'vue';
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


function handleChangeDisplay(idx) {
    selectedDisplay.value = idx;
    
}

function handleSelectWorkout(idx) {
    selectedWorkout.value = idx;
    selectedDisplay.value = 3; // Switch to Workout display
    
}


function handleSaveWorkout() {
    localStorage.setItem('workoutData', JSON.stringify(data.value));

    selectedDisplay.value = 2; // Switch back to Dashboard display

    selectedWorkout.value = -1; // Reset selected workout
}
</script>

<template>
  <Layouts>
    <Welcome :handleChangeDisplay="handleChangeDisplay" v-if="selectedDisplay == 1" />
    <!-- The Welcome component will be displayed first -->
    <Dashboard v-if="selectedDisplay == 2" />
    <!-- The Dashboard component will be displayed after the Welcome component -->
    <Workout
      :data="data"
      :selectedWorkout="selectedWorkout"
      v-if="workoutProgram?.[selectedWorkout]"
    />
    <!-- The Workout component will be displayed after the Dashboard component -->
  </Layouts>
</template>

<style scoped></style>
