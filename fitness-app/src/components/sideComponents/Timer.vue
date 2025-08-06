<script setup>
import Portal from '../Portal.vue';
import { computed, onMounted, ref, watch, reactive, toRef } from 'vue';
const props = defineProps({
  handleSkip: Function,
  handleReorderWorkout: Function,
  handleDeleteExercise: Function,
  handleAddWorkout: Function,
  handleSaveSteps: Function,
  handleSaveTimerData: Function,
  timerData: Object,
  steps: Number,
  workoutData: Object,
  selectedWorkout: Number,
  isWorkoutComplete: Boolean,
  handleSaveWorkout: Function,
});
console.log(props, 'data');
const workoutTypes = ['push', 'pull', 'legs'];
const day = props.selectedWorkout + 1;
let timers = reactive({ ...props.timerData } || {});
let time = ref(0);
let minute = ref(0);
let hour = ref(0);
let timerId = ref(null);
let localSteps = ref(props.steps || 0);
console.log(
  'Workout component loaded with props:',
  props.workoutData[props.selectedWorkout],
  'Selected workout:',
  props.selectedWorkout
);

const reactiveData = toRef(props, 'workoutData');
const data = computed(() => reactiveData.value);
console.log(data.value, 'data', props, 'while props');
onMounted(() => {
  const saved = timers[props.selectedWorkout] || { time: 0, minute: 0, hour: 0 };
  time.value = saved.time || 0;
  minute.value = saved.minute || 0;
  hour.value = saved.hour || 0;

  localSteps.value = props.steps || 0;
});
watch(
  () => props.selectedWorkout,
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
      minute.value++; // increment minute every 60 seconds
      time.value = 0;
    }
    if (minute.value === 60 && hour.value < 24) {
      hour.value++; // increment hour every 60 minutes
      minute.value = 0; // reset minute
    }
  }, 1000);
}

function stopTimer() {
  if (timerId.value !== null) {
    clearInterval(timerId.value);
    timerId.value = null;
    console.log('Timer stopped');
  }
  timers[props.selectedWorkout] = {
    time: time.value,
    minute: minute.value,
    hour: hour.value,
  };
  props.handleSaveTimerData(timers);

  //localStorage.setItem('timerData', JSON.stringify(timers));
}
const stepsPortal = ref(null);

const saveSteps = () => {
  if (localSteps.value < 1) {
    console.warn('Please enter a valid number of steps.');
    return;
  }
  props.handleSaveSteps(localSteps.value);
};

const isEditMode = ref(false);
const EditTime = ref(false);

const tempHour = ref(hour.value);
const tempMinute = ref(minute.value);
const tempTime = ref(time.value);

function saveTime() {
  hour.value = tempHour.value;
  minute.value = tempMinute.value;
  time.value = tempTime.value;
  timers[props.selectedWorkout] = {
    time: time.value,
    minute: minute.value,
    hour: hour.value,
  };
  props.handleSaveTimerData(timers);
 
  EditTime.value = false;
}
</script>

<template>
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
          {{ localSteps || 'No steps recorded for this workout.' }}
        </p>
        <p class="exercise-description">
          while you Skipped the workout, you can add your steps here.
          <br />
          <input v-model="localSteps" type="range" :range="(0, 20000)" min="0" max="20000" />
        </p>

        <div class="exercise-btns">
          <button @click="() => ((stepsPortal = null), saveSteps, console.log(saveSteps, 'steps'))">
            Close
            <i class="fa-solid fa-xmark"></i>
          </button>
          <button @click="props.handleSkip">
            Next workout
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </Portal>
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

        <button v-if="!EditTime" @click="EditTime = !EditTime" class="time">
          <div>
            {{ hour < 10 ? '0' + hour : hour }}: {{ minute < 10 ? '0' + minute : minute }}:
            {{ time < 10 ? '0' + time : time }}
          </div>
        </button>
        <div v-else class="time time-button time-edit">
          <input v-model="tempHour" type="number" min="0" max="99" />
          <span>:</span>
          <input v-model="tempMinute" type="number" min="0" max="59" />
          <span>:</span>
          <input v-model="tempTime" type="number" min="0" max="59" />

          <button @click="saveTime" class="save-btn">
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>
      <i class="fa-solid fa-dumbbell"></i>
    </div>

    <h2 class="workoutName">{{ workoutTypes[props.selectedWorkout % 3] }} Workout</h2>
    <button @click="isEditMode = !isEditMode">
      {{ isEditMode ? 'Done Editing' : 'Edit Layout' }}
    </button>

    <button
      v-if="workoutTypes[props.selectedWorkout % 3] === 'legs'"
      @click="
        () => {
          stepsPortal = true;
        }
      "
    >
      {{ workoutTypes[props.selectedWorkout % 3] === 'legs' ? 'Steps Time?' : '' }}
    </button>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide spinners for Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
.time-button {
  padding: 0.3rem 0.7rem;
  font-size: 1rem;
  border-radius: 6px;
  background-color: #222;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: none;
  cursor: pointer;
}

.time-edit {
  gap: 0.4rem;
}

.time-edit input {
  width: 2.3rem;
  text-align: center;
  font-size: 1rem;
  padding: 2px 4px;

  color: white;
  border: 1px solid #444;
  border-radius: 4px;
}

.save-btn {
  background: transparent;
  border: none;
  color: #4caf50;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  height: 100%;
}
.exercise-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
.plan-card-header,
.workout-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
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
