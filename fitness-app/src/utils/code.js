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

export function WorkoutDataDisplay({ timerData, steps, completedCount }) {
  const seconds = Object.values(timerData || {}).reduce((a, t) => a + (t?.time || 0), 0);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [
    {
      workout: 'Workouts Completed',
      value: completedCount || 0,
      classname: 'fa-solid fa-dumbbell',
    },
    { workout: 'Steps', value: steps || 0, classname: 'fa-solid fa-shoe-prints' },
    { workout: 'Time Spent', value: `${h}h ${m}m ${s}s`, classname: 'fa-regular fa-clock' },
  ];
}
