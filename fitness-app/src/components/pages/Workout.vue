<script setup>
import { computed, onMounted, ref, watch, reactive, toRef } from 'vue';
import { workoutProgram, exerciseDescriptions } from '../../utils';
import Portal from '../Portal.vue';
import draggable from 'vuedraggable';
import { useAppStore } from '../../utils/app';
import Warmup from '../sideComponents/Warmup.vue';
import Timer from '../sideComponents/Timer.vue';
const props = defineProps({
  handleReorderWorkout: Function,
  handleDeleteExercise: Function,
  handleAddWorkout: Function,
  workoutData: Object,
  selectedWorkout: Number,
  isWorkoutComplete: Boolean,
  handleSaveWorkout: Function,
});
const store = useAppStore();
const workout = computed({
  get: () => props.workoutData?.[props.selectedWorkout] || [],
  set: (newValue) => {
    props.workoutData[props.selectedWorkout] = newValue;
  },
});

let selectedExercise = ref(null);

const exerciseDescription = computed(() => exerciseDescriptions[selectedExercise.value]);

const reactiveData = toRef(props, 'workoutData');
const data = computed(() => reactiveData.value);

onMounted(() => {
  for (const key in workout.value) {
    console.log(workout.value[key], workout.value[key], workout.value[key].sets);

    workout.value[key].sets;
    workout.value[key].reps;
    workout.value[key].weight;
  }
});

const values = reactive({
  name: '',
  sets: '',
  reps: '',
  weight: '',
});

const EditAndAddForm = ref(false);
const ButtonsReady = ref(false);

function addExercise(value) {
  if (!values.name.trim()) return;
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

function onDelete(index) {
  props.handleDeleteExercise?.(index);
}

function onReorder() {
  props.handleReorderWorkout?.(workout.value);
}

function saveAndExit() {
  props.handleSaveWorkout?.(workout.value);
}

function completeWorkout() {
  if (!props.isWorkoutComplete) return;
  props.handleSaveWorkout?.(workout.value);
}

function handleSkip() {
  const arr = workout.value;
  arr.forEach((ex) => {
    ex.sets = ex.sets || '1';
    ex.reps = ex.reps || '1';
    ex.weight = ex.weight || '1';
  });
  props.handleSaveWorkout?.(arr);
}
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

    <section id="workout-card">
      <Timer
        :handleSkip="handleSkip"
        :handleReorderWorkout="props.handleReorderWorkout"
        :handleDeleteExercise="props.handleDeleteExercise"
        :handleAddWorkout="props.handleAddWorkout"
        :workoutData="props.workoutData"
        :isWorkoutComplete="props.isWorkoutComplete"
        :handleSaveWorkout="props.handleSaveWorkout"
        :selectedWorkout="props.selectedWorkout" />
      <div class="workout-grid">
        <h4 class="grid-name">Warmup</h4>
        <h6>sets</h6>
        <h6>reps</h6>
        <h6>weights</h6>
        <Warmup :selectedWorkout="props.selectedWorkout" />

        <div class="workout-grid-line"></div>
        <h4 class="grid-name">Workout</h4>
        <h6>sets</h6>
        <h6>reps</h6>
        <h6 class="grid-weights">
          weights
          <button class="add-exercise-btn" @click="EditAndAddForm = !EditAndAddForm">
            <i class="fa-regular fa-circle-question"></i>
          </button>
        </h6>
        <transition name="slide-fade">
          <form
            @submit.prevent="addExercise(values)"
            class="workout-grid-row"
            v-if="EditAndAddForm">
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
        @update="onReorder"
        v-model="workout"
        :item-key="(item, index) => item?.name || index"
        ghost-class="drag-ghost"
        handle=".drag-handle"
        animation="200"
        :tag="'div'"
        :item-tag="'div'"
        class="workout-grid">
        <template #item="{ element, index }">
          <div class="workout-grid-row drag-handle cursor-grab">
            <div class="grid-name">
              <button v-if="EditAndAddForm" @click="() => onDelete(index)">
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
        <button @click="() => saveAndExit(workout)">
          Save & Exit
          <i class="fa-solid fa-save"></i>
        </button>
        <button :disabled="!props.isWorkoutComplete" @click="() => saveAndExit(workout)">
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
  max-height: 500px;
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
</style>
