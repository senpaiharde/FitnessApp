<script setup>
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUp,
  useClerk,
  UserButton,
  useUser,
  SignOutButton,
} from '@clerk/vue';
import { Transition, ref, watch, computed } from 'vue';
import { loadAllAppData, setSignedInUser } from '../../service/storage';
import DataPicker from '../../service/DataPicker.vue';
import { buildLeaderboard, enter, leave, WorkoutDataDisplay } from '../../utils/code';
import { OptionsOfRange, OptionsOfRangeInDays } from '../../utils/options';
import { useAppStore } from '../../utils/app';

const store = useAppStore();
const props = defineProps({
  selectedWorkout: Number,
  firstInCompletedWorkoutIndex: Number,
});

const { openSignIn, isSignedIn } = useClerk();
const { user } = useUser();
const toggleStats = () => {
  showStats.value = !showStats.value;
};
const showStats = ref(true);

watch(
  () => user.value?.id,
  (newId, oldId) => {
    if (newId) setSignedInUser(newId);
    else setSignedInUser(null);
  },
  { immediate: true }
);

const workoutDisplay = computed(() =>
  WorkoutDataDisplay({
    workoutData: store.workoutData,
    firstInCompletedWorkoutIndex: props.firstInCompletedWorkoutIndex,
    timerData: store.timerData,
    steps: store.steps,
    completedCount: store.completedCount,
  })
);

const topUsers = ref([]);
const selectedRange = ref(30);
const board = buildLeaderboard(user, 10);

watch(
  () => user.value?.id,
  (newId) => {
    if (newId) {
      const slava = buildLeaderboard(user);
      topUsers.value = slava;
    }
  },
  { immediate: true }
);

watch(
  selectedRange,
  (newRange) => {
    topUsers.value = buildLeaderboard(user, newRange);
  },
  { immediate: true }
);
console.log('selectedRange', selectedRange.value);

const selectedMetric = ref('all');

const filterTopUsers = computed(() => {
  if (selectedMetric.value === 'all') {
    return topUsers.value;
  } else if (selectedMetric.value === 'Workouts') {
    return topUsers.value.filter((user) => user.totalWorkouts > 0);
  } else if (selectedMetric.value === 'steps') {
    return topUsers.value.filter((user) => user.totalSteps > 0);
  } else if (selectedMetric.value === 'time') {
    return topUsers.value.filter((user) => user.timeSpent > 0);
  }
  return [...topUsers.value].sort((a, b) => b[selectedMetric.value] - a[selectedMetric.value]);
});
watch(filterTopUsers, (newList) => {
  console.log('Filtered Users:', newList.target);
});

watch(selectedMetric, (newList) => {
  console.log('selectedMetric', newList, [...filterTopUsers.value, ...topUsers.value]);
});
let formattedTime = 0;
console.log(
  filterTopUsers.value.map((a) => {
    console.log(a.timeSpent, 'a');
    const totalSeconds = a.timeSpent;
    const hour = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    console.log(`${hour}h ${min}m ${seconds}s`, 'a');

    return {
      ...a,
      formattedTime: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(
        seconds
      ).padStart(2, '0')}`,
    };
  }),
  'daddy'
);
console.log(formattedTime);
</script>

<template>
  <!-- Toggle Button -->
  <div class="toggle-bar">
    <button @click="toggleStats">
      {{ showStats ? 'Hide Stats ▲' : 'Show Stats ▼' }}
    </button>
  </div>

  <!-- Collapsible Stats Grid -->
  <transition @enter="enter" @leave="leave">
    <section ref="stateGrid" id="grid" v-show="showStats">
      <div v-for="(item, idx) in workoutDisplay" :key="idx" class="row">
        <!-- Left 25% -->
        <div class="card-div plan-cardD">
          <div class="card">
            <p class="card-title">{{ item.workout }}</p>
          </div>
        </div>

        <!-- Right 75% -->
        <div class="card-div plan-card-resetT">
          <p class="card-title">{{ item.value }}</p>
          <i :class="item.classname"></i>
        </div>
      </div>
    </section>
  </transition>
  <section id="daddy">
    <div class="button-container">
      <select v-model="selectedRange" class="data-picker">
        {{
          selectedRange
        }}
        Days
        <option v-for="(item, idx) in OptionsOfRange" :key="idx" :value="item">
          {{ item }} Days
        </option>
        >
      </select>
      <select v-model="selectedMetric">
        <option v-for="(item, idx) in OptionsOfRangeInDays" :key="idx" :value="item">
          {{ item }}
        </option>
      </select>
      <button @click="openSignIn">Search</button>
    </div>

    <div class="top-table">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Workouts</th>
            <th>Steps</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filterTopUsers" :key="index">
            <td class="tdDisplay">{{ index + 1 }} <UserButton /></td>
            <td>{{ user.name }}</td>
            <td>{{ user.totalWorkouts }}</td>
            <td>{{ user.totalSteps }}</td>
            <td>
              <span v-if="user.timeSpent === 0"> 0 </span>
              <span v-else>
                {{
                  String(Math.floor(user.timeSpent / 3600 / 24)).padStart(2, '0') +
                  ':' +
                  String(Math.floor((user.timeSpent % 3600) / 60)).padStart(2, '0') +
                  ':' +
                  String(Math.floor(user.timeSpent % 60)).padStart(2, '0')
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.tdDisplay {
  display: flex;
  gap: 8px;
  align-self: center;
}
.top-table {
  width: 100%;
  overflow-x: auto;
}
.top-table table {
  width: 100%; /* fill the wrapper */
  table-layout: fixed; /* columns share width evenly (optional) */
  font-size: 11pt;
  color: #ccc;
}
#daddy {
  display: flex;
  flex-direction: column;

  align-items: stretch;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
  clear: both;
  padding-bottom: 60px;
}
.button-container {
  gap: 0.5rem;
  display: flex;
  justify-content: center;
  margin: 1rem;
  justify-content: space-between;
}
.toggle-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.toggle-bar button {
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

#grid {
  display: flex;
  flex-direction: column; /* stack rows vertically */
  gap: 1rem;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 25% 75%; /* 2-column row */

  width: 100%;
}

.plan-cardD {
  height: 60px;
  display: flex;
  flex-direction: column;
}

.plan-card-resetT {
  padding-left: 1rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
