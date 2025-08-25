
import { defineStore } from 'pinia';
import { loadAppData, updateAppData } from '../service/storage';

export const useAppStore = defineStore('app', {
  state: () => ({
   
    timerData: {},
    
    workoutData: {},
    steps: 0,
    completedCount: 0,
    
    stepHistory: {},
    workoutHistory: {},
    timeHistory: {},
  }),
  getters: {
    totalSeconds: (s) => Object.values(s.timerData || {}).reduce((a, t) => a + (t?.time || 0), 0),
  },
  actions: {
    init() {
      const loaded = loadAppData() || {};
      this.timerData = loaded.timerData || {};
      this.workoutData = loaded.workoutData || {};
      this.steps = loaded.steps || 0;
      this.completedCount = loaded.completedCount || 0;
      this.stepHistory = loaded.stepHistory || {};
      this.workoutHistory = loaded.workoutHistory || {};
      this.timeHistory = loaded.timeHistory || {};
    },
    save(partial) {
      updateAppData(partial);
      if (partial.timerData) this.timerData = { ...this.timerData, ...partial.timerData };
      if (partial.workoutData) this.workoutData = { ...this.workoutData, ...partial.workoutData };
      if (partial.stepHistory) this.stepHistory = { ...this.stepHistory, ...partial.stepHistory };
      if (partial.workoutHistory)
        this.workoutHistory = { ...this.workoutHistory, ...partial.workoutHistory };
      if (partial.timeHistory) this.timeHistory = { ...this.timeHistory, ...partial.timeHistory };
      if (typeof partial.steps === 'number') this.steps = partial.steps;
      if (typeof partial.completedCount === 'number') this.completedCount = partial.completedCount;
    },
    incrementWorkout(dateISO) {
      this.workoutHistory[dateISO] = (this.workoutHistory[dateISO] || 0) + 1;
      this.completedCount += 1;
      this.save({
        workoutHistory: this.workoutHistory,
        completedCount: this.completedCount,
      });
    },
    addSteps(dateISO, delta) {
      const add = Number(delta) || 0;
      this.steps = (this.steps || 0) + add;
      this.stepHistory[dateISO] = (this.stepHistory[dateISO] || 0) + add;
      this.save({ steps: this.steps, stepHistory: this.stepHistory });
    },
    upsertTimer(key, seconds) {
      const s = Math.max(0, Number(seconds) || 0);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      this.timerData[key] = { time: s, hour: h, minute: m };
      this.save({ timerData: this.timerData });
    },
    resetAll() {
      this.timerData = {};
      this.workoutData = {};
      this.steps = 0;
      this.completedCount = 0;
      this.stepHistory = {};
      this.workoutHistory = {};
      this.timeHistory = {};
      this.save({});
    },
  },
});
