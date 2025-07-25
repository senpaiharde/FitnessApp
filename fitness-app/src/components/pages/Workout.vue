<script setup>
import { computed, onMounted, ref, watch, reactive } from 'vue';
import { workoutProgram, exerciseDescriptions } from '../../utils';
import Portal from '../Portal.vue';
import { loadAppData, updateAppData } from '../../service/storage';

const props = defineProps({
   handleSaveSteps: Function,
   handleSaveTimerData: Function,
  timerData: Object,
  steps: Number,
    workoutData: Object,
  selectedWorkout: Number,
  isWorkoutComplete: Boolean,
  handleSaveWorkout: Function,
});
const workoutTypes = ['push', 'pull', 'legs'];
const { workout, warmup } = workoutProgram[selectedWorkout];
let selectedExercise = ref(null);
const exerciseDescription = computed(() => exerciseDescriptions[selectedExercise.value]);

const day = selectedWorkout + 1;

let timers = reactive({});
let time = ref(0);
let minute = ref(0);
let hour = ref(0);
let timerId = ref(null);
let steps = ref(0);

const data = ref(props.workoutData);

onMounted(() => {
  let workoutData = props.workoutData || {};
  let timerData = props.timerData || {};
  console.log('Loaded workout data:', workoutData);
  console.log('Loaded timer data:', timerData);
  //const raw = localStorage.getItem('timerData');

  if (timerData) {
    Object.assign(timers, timerData);
    const savedTimer = timers[selectedWorkout];
    if (savedTimer) {
      time.value = savedTimer.time;
      minute.value = savedTimer.minute;
      hour.value = savedTimer.hour;
    }
  }
  if (workoutData) {
    data.value = workoutData;
    selectedDisplay.value = 2;
    steps.value = data.value[selectedWorkout]?.steps || 0;
  }
});


watch(
  () => selectedWorkout,
  (idx) => {
    const saved = timers[idx] || { time: 0, minute: 0, hour: 0 };
    time.value = saved.time;
    minute.value = saved.minute;
    hour.value = saved.hour;
  },

  { immediate: true }
);

function clearTimer() {
  if (timerId.value !== null) {
    clearInterval(timerId.value);
    timerId.value = null;
    time.value = 0;
    minute.value = 0;
    hour.value = 0;
    console.log('Timer cleared');
  }
}
let click = 0;
// 2) start/stop functions
function startTimer() {
  click++;
  if (click % 2 === 0) {
    stopTimer();
    click = 0;
    return;
  }
  // if you already have one running, clear it
  if (timerId.value !== null) {
    clearInterval(timerId.value);
  }

  time.value = time.value || 0; // reset time if needed
  timerId.value = setInterval(() => {
    time.value++;

    if (time.value % 60 === 0) {
      minute++; // increment minute every 60 seconds
      time.value = 0;
    }
    if (minute === 60 && hour < 24) {
      hour++; // increment hour every 60 minutes
      minute.value = 0; // reset minute
    }
  }, 1000);
}

function stopTimer() {
  if (timerId.value !== null) {
    clearInterval(timerId.value);
    timerId.value = null;
    console.log('Timer stopped at', time.value, 'seconds');
  }
  timers[selectedWorkout] = {
    time: time.value,
    minute: minute.value,
    hour: hour.value,
  };
    props.handleSaveTimerData(steps.value);
 
  //localStorage.setItem('timerData', JSON.stringify(timers));
}
const stepsPortal = ref(null);
const handleSkip = () => {
  console.log('Skipping workout');

  workout.forEach((exercise) => {
    data[selectedWorkout][exercise.name].sets = 'skipped';
    data[selectedWorkout][exercise.name].reps = 'skipped';
    data[selectedWorkout][exercise.name].weight = 'skipped';
  });
  props.handleSaveWorkout(workout.value);
   

  
};

const saveSteps = () => {
  if (steps.value < 1) {
    console.warn('Please enter a valid number of steps.');
    return;
  }
  data[selectedWorkout].steps = steps.value;

   props.handleSaveTimerData(steps.value);
  //localStorage.setItem(JSON.stringify(data[selectedWorkout].steps = steps.value))
  console.log(steps.value);
};
</script>
<template>
  <Portal :onClose="() => (selectedExercise = null)" v-if="selectedExercise">
    <div class="exercise-description">
      <h3>{{ selectedExercise }}</h3>

      <div class="exercise-image">
        <small>Description daddy </small>
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
  <Portal :onClose="() => (stepsPortal = null)" v-if="stepsPortal">
    <div class="exercise-description">
      <h3>{{ selectedExercise }}</h3>

      <div class="exercise-image">
        <small>Description </small>
        <p class="exercise-description">
          {{ exerciseDescription || 'No description available for this exercise.' }}
        </p>
      </div>
      <div class="exercise-image">
        <small>Steps</small>
        <p class="exercise-description">
          {{ steps || 'No steps recorded for this workout.' }}
        </p>
        <p class="exercise-description">
          while you Skipped the workout, you can add your steps here.
          <br />
          <input v-model="steps" type="range" :range="(0, 20000)" min="0" max="20000" />
        </p>

        <div class="exercise-btns">
          <button @click="() => ((stepsPortal = null), saveSteps, console.log(saveSteps, 'steps'))">
            Close
            <i class="fa-solid fa-xmark"></i>
          </button>
          <button @click="handleSaveWorkout">
            Next workout
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </Portal>
  <section id="workout-card">
    <div class="plan-card card">
      <div class="plan-card-header">
        <p>Day {{ day <= 9 ? '0' + day : day }}</p>
        <div class="plan-card-header">
          <button @click="startTimer">
            <i class="fa-solid fa-play"></i>
          </button>
          <button @click="stopTimer">
            <i class="fa-solid fa-pause"></i>
          </button>
          <button @click="clearTimer">
            <i class="fa-solid fa-stop"></i>
          </button>

          <button disabled class="time">
            {{ hour < 10 ? '0' + hour : hour }}: {{ minute < 10 ? '0' + minute : minute }}:
            {{ time < 10 ? '0' + time : time }}
          </button>
        </div>
        <i class="fa-solid fa-dumbbell"></i>
      </div>

      <h2>{{ workoutTypes[selectedWorkout % 3] }} Workout</h2>
      <button
        @click="
          () => {
            stepsPortal = true;
            handleSkip();
            s;
          }
        "
        :disabled="workoutTypes[selectedWorkout % 3] === 'legs' ? false : true"
      >
        {{ workoutTypes[selectedWorkout % 3] === 'legs' ? 'Steps Time?' : '' }}
      </button>
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
      <button
        @click="
          () => {
            props.handleSaveWorkout();
          }
        "
      >
        Save & Exit
        <i class="fa-solid fa-save"></i>
      </button>
      <button :disabled="!props.isWorkoutComplete" @click="props.handleSaveWorkout">
        Complete
        <i class="fa-solid fa-check"></i>
      </button>
    </div>
  </section>
</template>

<style scoped>
.exercise-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
.time {
  font-weight: bold;
  justify-content: center;
  align-items: center;
  display: flex;

  color: var(--color-link);
}
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
