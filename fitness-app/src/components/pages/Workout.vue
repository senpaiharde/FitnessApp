<script setup>
import { computed, ref } from 'vue';
import { workoutProgram, exerciseDescriptions } from '../../utils';
import Portal from '../Portal.vue';
const { data, selectedWorkout, isWorkoutComplete } = defineProps({
  data: Object,
  selectedWorkout: Number,
  isWorkoutComplete: Boolean,
  handleSaveWorkout: Function,
});
const workoutTypes = ['push', 'pull', 'legs'];
const { workout, warmup } = workoutProgram[selectedWorkout];
let selectedExercise = ref(null);
const exerciseDescription = computed(() => exerciseDescriptions[selectedExercise.value]);
console.log('Workout component loaded', selectedWorkout, workout, warmup, exerciseDescription);
const day = selectedWorkout + 1;
console.log('Selected workout day:', isWorkoutComplete);

const time = ref(0)
const timerId = ref(null)
let minute = 0
let hour = 0
function clearTimer() {
  if (timerId.value !== null) {
    clearInterval(timerId.value);
    timerId.value = null;
    time.value = 0; // Reset time when clearing the timer
    minute = 0; // Reset minute
    hour = 0; // Reset hour
    console.log('Timer cleared');
  }
}
// 2) start/stop functions
function startTimer() {
  // if you already have one running, clear it
 

  time.value = time.value || 0 // reset time if needed
  timerId.value = setInterval(() => {
    time.value++
    if(time.value % 60 === 0) {
      minute ++ // increment minute every 60 seconds
    }
    if(time.value % 3600 === 0) {
      hour ++ // increment hour every 3600 seconds
    }
    
  }, 1000)
}

function stopTimer() {
  if (timerId.value !== null) {
    clearInterval(timerId.value)
    timerId.value = null
    console.log('Timer stopped at', time.value, 'seconds')
  }
}

</script>

<template>
  <Portal :onClose="() => (selectedExercise = null)" v-if="selectedExercise">
    <div class="exercise-description">
      <h3>{{ selectedExercise }}</h3>

      <div class="exercise-image">
        <small>Description </small>
        <p class="exercise-description">
          {{ exerciseDescription || 'No description available for this exercise.' }}
        </p>
      </div>
      <button @click="() => (selectedExercise = null)">
        Close
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </Portal>
  <section id="workout-card">
    <div class="plan-card card">
      <div class="plan-card-header">
        <p>Day {{ day <= 9 ? '0' + day : day }}</p>
        <i class="fa-solid fa-dumbbell"></i>
      </div>
      <h2>
        {{ workoutTypes[selectedWorkout % 3] }} Workout
        <button @click="startTimer">Start Timer</button>
        <button @click="stopTimer">step Timer</button>
        <h2>{{ time }}</h2>
      </h2>
    </div>
    <div class="workout-grid">
      <h4 class="grid-name">Warmup</h4>
      <h6>sets</h6>
      <h6>reps</h6>
      <h6>weights</h6>
      <div v-for="(exercise, idx) in warmup" :key="idx" class="workout-grid-row">
        <div class="grid-name">
          <p>{{ exercise.name }}</p>
          <button
            @click="
              () => {
                selectedExercise = exercise.name;
              }
            "
          >
            <i class="fa-regular fa-circle-question"></i>
          </button>
        </div>
        <p>{{ exercise.sets }}</p>
        <p>{{ exercise.reps }}</p>
        <input class="grid-weights" type="text" placeholder="23Kg" disabled />
      </div>

      <div class="workout-grid-line"></div>
      <h4 class="grid-name">Workout</h4>
      <h6>sets</h6>
      <h6>reps</h6>
      <h6 class="grid-weights">weights</h6>
      <div v-for="(exercise, idx) in workout" :key="idx" class="workout-grid-row">
        <div class="grid-name">
          <p>{{ exercise.name }}</p>
          <button
            @click="
              () => {
                selectedExercise = exercise.name;
              }
            "
          >
            <i class="fa-regular fa-circle-question"></i>
          </button>
        </div>
        <input
          v-model="data[selectedWorkout][exercise.name].sets"
          type="text"
          :placeholder="exercise.sets + ' sets'"
        />
        <input
          v-model="data[selectedWorkout][exercise.name].reps"
          type="text"
          :placeholder="exercise.reps + ' reps'"
        />
        <input
          v-model="data[selectedWorkout][exercise.name].weight"
          class="grid-weights"
          type="text"
          placeholder="23Kg"
        />
      </div>
    </div>

    <div class="card workout-btns">
      <button @click="handleSaveWorkout">
        Save & Exit
        <i class="fa-solid fa-save"></i>
      </button>
      <button :disabled="!isWorkoutComplete" @click="handleSaveWorkout">
        Complete
        <i class="fa-solid fa-check"></i>
      </button>
    </div>
  </section>
</template>

<style scoped>
#workout-card,
.plan-card {
  display: flex;
  flex-direction: column;
}
#workout-card {
  gap: 1.5rem;
}
.plan-card-header,
.workout-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.workout-grid,
.workout-grid-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1rem;
  align-items: center;
}
.workout-grid-row,
.workout-grid-line {
  grid-column: span 7 / span 7;
}
.workout-grid-line {
  margin: 0.5rem 0;
  height: 3px;
  border-radius: 2px;
  background: var(--background-muted);
}
.grid-name {
  grid-column: span 3 / span 3;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.grid-weights {
  grid-column: span 2 / span 2;
}
.grid-name button {
  padding: 0;
  border: none;
  box-shadow: none;
}
.grid-name button:hover {
  transform: none;
  box-shadow: none;
  color: var(--color-link);
}
.workout-grid-row .grid-name button {
  opacity: 0;
  pointer-events: none;
}
.workout-grid-row:hover .grid-name button {
  opacity: 1;
  pointer-events: all;
}
.grid-name p {
  text-transform: capitalize;
}

.workout-btns button {
  flex: 1;
}
.workout-btns button i {
  padding-left: 0.5rem;
}
.exercise-description {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
.exercise-description h3 {
  text-transform: capitalize;
}
.exercise-description button i {
  padding-left: 0.5rem;
}
</style>
