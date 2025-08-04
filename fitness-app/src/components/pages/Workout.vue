<script setup>
import { computed, onMounted, ref, watch, reactive, toRef } from 'vue';
import { workoutProgram, exerciseDescriptions } from '../../utils';
import Portal from '../Portal.vue';
import draggable from 'vuedraggable';
import draggableComponent from 'vuedraggable';
const props = defineProps({
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
const workoutTypes = ['push', 'pull', 'legs'];
const workout = computed({
  get: () => props.workoutData?.[props.selectedWorkout] || [],
  set: (newValue) => {
    props.workoutData[props.selectedWorkout] = newValue;
  },
});
const warmup = computed(() => workoutProgram[props.selectedWorkout]?.warmup || []);
let selectedExercise = ref(null);
console.log(workout, warmup, 'data');

const exerciseDescription = computed(() => exerciseDescriptions[selectedExercise.value]);
console.log('Selected workout:', props.selectedWorkout, 'Workout data:', props.workoutData);
console.log(workout.value, 'this is workout');
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
  console.log('Mounted workout, preloaded values:', data.value[props.selectedWorkout]);

  for (const key in workout.value) {
    console.log(workout.value[key], workout.value[key], workout.value[key].sets);

    workout.value[key].sets;
    workout.value[key].reps;
    workout.value[key].weight;
  }
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
const handleSkip = () => {
  workout.value.forEach((exercise) => {
    exercise.sets = '';
    exercise.reps = '';
    exercise.weight = '';
  });
  props.handleSaveWorkout(workout.value);
};

const saveSteps = () => {
  if (localSteps.value < 1) {
    console.warn('Please enter a valid number of steps.');
    return;
  }
  props.handleSaveSteps(localSteps.value);
};

const values = reactive({
  name: '',
  sets: '',
  reps: '',
  weight: '',
});

const EditAndAddForm = ref(false);
const ButtonsReady = ref(false);
console.log(ButtonsReady.value, 'here');
setTimeout(() => {
  ButtonsReady.value = true;
  console.log(ButtonsReady.value, 'here');
}, 2500);
function handleSaveNewWorkout(value) {
  props.handleAddWorkout({ ...value });
  EditAndAddForm.value = false;
  ButtonsReady.value = false;
  setTimeout(() => {
    ButtonsReady.value = true;
  }, 1500);
  values.name = '';
  values.sets = '';
  values.reps = '';
  values.weight = '';
}
console.log(workout.value, 'workout');
</script>

<template>
  <section id="workout-card">
    <Portal :onClose="() => (selectedExercise = null)" v-if="selectedExercise">
      <div class="exercise-description">
        <h3>{{ selectedExercise }}</h3>

        <div class="exercise-image">
          <small>Description</small>
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
            {{ localSteps || 'No steps recorded for this workout.' }}
          </p>
          <p class="exercise-description">
            while you Skipped the workout, you can add your steps here.
            <br />
            <input v-model="localSteps" type="range" :range="(0, 20000)" min="0" max="20000" />
          </p>

          <div class="exercise-btns">
            <button
              @click="() => ((stepsPortal = null), saveSteps, console.log(saveSteps, 'steps'))"
            >
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

        <h2 class="workoutName">{{ workoutTypes[props.selectedWorkout % 3] }} Workout</h2>

        <button
          v-if="workoutTypes[props.selectedWorkout % 3] === 'legs'"
          @click="
            () => {
              stepsPortal = true;
              handleSkip();
            }
          "
        >
          {{ workoutTypes[props.selectedWorkout % 3] === 'legs' ? 'Steps Time?' : '' }}
        </button>
      </div>
      <div class="workout-grid">
        <h4 class="grid-name">Warmup</h4>
        <h6>sets</h6>
        <h6>reps</h6>
        <h6>weights</h6>
        <div v-for="(exercise, idx) in warmup" :key="exercise.name + idx" class="workout-grid-row">
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
          <p>{{ exercise?.sets || '-' }}</p>
          <p>{{ exercise.reps || '-' }}</p>

          <input class="grid-weights" type="text" placeholder="23Kg" disabled />
        </div>

        <div class="workout-grid-line"></div>
        <h4 class="grid-name">Workout</h4>
        <h6>sets</h6>
        <h6>reps</h6>
        <h6 class="grid-weights">
          weights
          <button class="add-exercise-btn" @click="() => props.handleAddExercise()">
            <i class="fa-regular fa-circle-question"></i>
          </button>
        </h6>
        <transition name="slide-fade">
          <form
            @submit.prevent="handleSaveNewWorkout(values)"
            class="workout-grid-row"
            v-if="EditAndAddForm"
          >
            <div class="grid-name">
              <button type="submit" class="submit-btn">Add</button>
              <input v-model="values.name" placeholder="Exercise Name" required />
            </div>
            <input v-model="values.sets" type="text" placeholder="Sets" />
            <input v-model="values.reps" type="text" placeholder="Reps" />
            <input v-model="values.weight" class="grid-weights" type="text" placeholder="23Kg" />
          </form>
        </transition>
      </div>
      <draggable
        @update="() => props.handleReorderWorkout(workout)"
        v-model="workout"
        :item-key="(item, index) => item?.name || index"
        ghost-class="drag-ghost"
        handle=".drag-handle"
        animation="200"
        :tag="'div'"
        :item-tag="'div'"
        class="workout-grid"
      >
        <template #item="{ element, index }">
          <div class="workout-grid-row drag-handle cursor-grab">
            <div class="grid-name">
            
              <button v-if="EditAndAddForm" @click="() => props.handleDeleteExercise(index)">
                <i class="fa-solid fa-trash"></i>
              </button>
              <p>{{ element.name }}</p>

              <button @click="() => (selectedExercise = element.name)">
                <i class="fa-regular fa-circle-question"></i>
              </button>
            </div>

            <input v-model="element.sets" type="text" :placeholder="element.sets + ' sets'" />
            <input v-model="element.reps" type="text" :placeholder="element.reps + ' reps'" />
            <input v-model="element.weight" class="grid-weights" type="text" placeholder="23Kg" />
          </div>
        </template>
      </draggable>

      <div class="card workout-btns">
        <button :disabled="!ButtonsReady" @click="EditAndAddForm = !EditAndAddForm">
          <span v-if="!ButtonsReady">
            Loading...
            <i class="fa-solid fa-spinner fa-spin" style="margin-right: 0.5rem"></i>
          </span>
          <span v-else>
            {{ EditAndAddForm ? 'Done' : 'Add & Edit' }}
            <i class="fa-solid fa-save"></i>
          </span>
        </button>
        <button @click="() => props.handleSaveWorkout(workout)">
          Save & Exit
          <i class="fa-solid fa-save"></i>
        </button>
        <button
          :disabled="!props.isWorkoutComplete"
          @click="() => props.handleSaveWorkout(workout)"
        >
          Complete
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
    </section>
  </section>
</template>

<style scoped>
/* Smooth slide open animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1.5s ease;
  overflow: hidden;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 500px; /* Enough height to fully show the form */
  opacity: 1;
}
@media screen and (max-width: 500px) {
  .plan-card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  .workoutName {
    font-size: 1.5rem;
    line-height: 2rem;
    align-self: center;
  }
  .add-exercise-btn {
    margin: 0;
    width: 40px;
    height: 40px;
  }
}
.add-exercise-btn {
  align-items: center;
  margin-left: 2rem;
}
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
  cursor: grab;
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
