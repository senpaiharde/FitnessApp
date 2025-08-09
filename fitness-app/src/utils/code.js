import { loadAllAppData } from '../service/storage';

import { ref } from 'vue';

export function buildLeaderboard(user, limit = 10) {
  const all = loadAllAppData() || {};
  const board = Object.entries(all).map(([uid, data]) => {
    const timeSpent = Object.values(data?.timerData || {}).reduce((acc, t) => acc + (t.time || 0));
    const workouts = Object.values(data?.workoutHistory || {}).reduce((a, b) => a + b, 0);
    const steps = Object.values(data?.steps || {}).reduce((a, b) => a + b, 0);

    return {
      userId: uid,
      name: uid === (user.value?.id || '') ? user.value?.firstName || 'You' : 'Anonymous',
      timeSpent,
      totalWorkouts: data?.completedCount ?? workouts,
      totalSteps: data?.steps ?? steps,
    };
  });
  board.sort((a, b) => {
    if (b.timeSpent !== a.timeSpent) return b.timeSpent - a.timeSpent;
    if (b.totalWorkouts !== a.totalWorkouts) return b.totalWorkouts - a.totalWorkouts;
    return (b.totalSteps = a.totalSteps);
  });
}

export function leave(el) {
  el.style.maxHeight = el.scrollHeight + 'px';
  void el.offsetHeight;
  el.style.maxHeight = '0px';
  el.style.transition = 'max-height 0.5s ease';
  el.style.overflow = 'hidden';
}

export function enter(el) {
  el.style.maxHeight = '0px';
  el.style.overflow = 'hidden';
  void el.offsetHeight;
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
