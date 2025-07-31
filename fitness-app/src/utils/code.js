import { loadAllAppData } from '../service/storage';

import { ref } from 'vue';

export function buildLeaderboard(user, limit = 10) {
  const topUsers = ref([]);
  const all = loadAllAppData();
  const board = Object.entries(all).map(([uid, data]) => ({
    userId: uid,
    name: uid === user.value?.id ? user.value.firstName : 'Anonymous',
    totalSteps: data.steps,
    totalWorkouts: data.completedCount + 1,
    stepsHistory: data.stepHistory || {},
    workoutHistory: data.workoutHistory || {},
    timeHistory: data.timeHistory || {},
    timeSpent: Object.values(data.timerData || {}).reduce(
      (sum, e) => sum + (e.time || 0) + (e.minute || 0) * 60 + (e.hour || 0) * 3600,
      0
    ),
  }));
  // sort & slice
  const sorted = board.sort((a, b) => b.totalSteps - a.totalSteps).slice(0, limit);

  return sorted;
}

export function leave(el) {
  el.style.maxHeight = el.scrollHeight + 'px';
  el.offsetHeight;
  el.style.maxHeight = '0px';
  el.style.transition = 'max-height 0.5s ease';
  el.style.overflow = 'hidden';
}

export function enter(el) {
  el.style.maxHeight = '0px';
  el.style.overflow = 'hidden';
  el.offsetHeight;
  el.style.maxHeight = el.scrollHeight + 'px';
  el.style.transition = 'max-height 0.5s ease';
}

export function WorkoutDataDisplay({
  timerData,
  
  firstInCompletedWorkoutIndex,
  steps,
  workoutData,
}) {
  const totalWorkouts = Object.keys(workoutData).length;

  const timeSpent = Object.values(timerData).reduce((acc, curr) => {
    return acc + (curr.time || 0) + (curr.minute || 0) * 60 + (curr.hour || 0) * 3600;
  }, 0);

  const totalTimesSpend = {
    hours: Math.floor(timeSpent / 3600),
    minutes: Math.floor((timeSpent % 3600) / 60),
    seconds: timeSpent % 60,
  };
  return [
    {
      workout: 'Total Workouts',
      classname: 'card-icon fa-solid fa-dumbbell',
      value: firstInCompletedWorkoutIndex + 1 + ' / ' + totalWorkouts,
    },
    {
      workout: 'Total Steps',
      classname: 'card-icon fa-solid fa-weight-hanging',
      value: steps.toLocaleString() + ' steps',
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
}
