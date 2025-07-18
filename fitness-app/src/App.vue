<script setup>
import Layouts from './components/layout/Layouts.vue';
import Welcome from './components/pages/Welcome.vue';
import Dashboard from './components/pages/Dashboard.vue';
import Workout from './components/pages/Workout.vue';

const selectedDisplay = 2;
</script>

<template>
  <Layouts>
    <Welcome v-if="selectedDisplay == 1" />
    <!-- The Welcome component will be displayed first -->
    <Dashboard v-if="selectedDisplay == 2" />
    <!-- The Dashboard component will be displayed after the Welcome component -->
    <Workout v-if="selectedDisplay == 3" />
    <!-- The Workout component will be displayed after the Dashboard component -->
  </Layouts>
</template>

<style scoped></style>
