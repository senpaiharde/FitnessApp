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
import { Transition, ref, watch } from 'vue';
import { setSignedInUser } from '../../service/storage';

const props = defineProps({
  selectedWorkout: Number,
  steps: Number,
  timerData: Object,
  workoutData: Object,
  firstInCompletedWorkoutIndex: Number,
});

const { openSignIn, isSignedIn } = useClerk();
const { user } = useUser();

const showStats = ref(true);
const statsGrid = ref(null);
const totalWorkouts = Object.keys(props.workoutData).length;
const timeSpent = Object.values(props.timerData).reduce((acc, curr) => {
  return acc + (curr.time || 0) + (curr.minute || 0) * 60 + (curr.hour || 0) * 3600;
}, 0);
console.log('Total time spent in seconds:', showStats.value);
const totalTimesSpend = {
  hours: Math.floor(timeSpent / 3600),
  minutes: Math.floor((timeSpent % 3600) / 60),
  seconds: timeSpent % 60,
};
function toggleStats() {
  showStats.value = !showStats.value;
}
watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      console.log('🎉 Clerk user object just arrived:', newUser);
      console.log('→ user.id =', newUser.id);
      console.log('→ user.firstName =', newUser.firstName);
    }
  },
  { immediate: true }
);
watch(
  () => user['value'].id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      setSignedInUser(newId);
    }
  },
  { immediate: true }
);
const workoutDisplay = [
  {
    workout: 'Total Workouts',
    classname: 'card-icon fa-solid fa-dumbbell',
    value: props.firstInCompletedWorkoutIndex + 1 + ' / ' + totalWorkouts,
  },
  {
    workout: 'Total Steps',
    classname: 'card-icon fa-solid fa-weight-hanging',
    value: props.steps.toLocaleString() + ' steps',
  },
  {
    workout: 'Total Time',
    classname: 'card-icon fa-solid fa-bolt',
    value:
      [
        totalTimesSpend.hours,
        totalTimesSpend.minutes < 10 ? '0' + totalTimesSpend.minutes : totalTimesSpend.minutes,
        totalTimesSpend.seconds < 10 ? '0' + totalTimesSpend.seconds : totalTimesSpend.seconds,
      ].join(':') + ' minutes',
  },
];

function enter(el) {
  el.style.maxHeight = '0px';
  el.style.overflow = 'hidden';
  el.offsetHeight;
  el.style.maxHeight = el.scrollHeight + 'px';
  el.style.transition = 'max-height 0.5s ease';
}

function leave(el) {
  el.style.maxHeight = el.scrollHeight + 'px';
  el.offsetHeight;
  el.style.maxHeight = '0px';
  el.style.transition = 'max-height 0.5s ease';
  el.style.overflow = 'hidden';
}

const periodOptions = [7, 14, 30, 60, 90, 180, 365];
const period = ref(30); // Default to 30 days
const showFilter = ref(false);
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
      <button @click="showFilter = !showFilter">
        {{ showFilter ? 'Hide Filter' : 'Show Filter' }}
      </button>
    </div>
    <div class="login-container">
      <SignedOut>
        <SignInButton>Log in</SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton />

        <SignOutButton>Log out</SignOutButton>
      </SignedIn>

      <p>
        {{ user ? 'Welcome, ' + user.firstName : 'Please sign in' }}
      </p>
    </div>
  </section>
</template>

<style scoped>
#daddy {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
  clear: both;
}
.button-container {
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
  background: #007bff;
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
