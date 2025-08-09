import { v4 as uuidv4 } from 'uuid';
interface AppData {
  timerData: Record<number, { time: number; minute: number; hour: number }> | null;
  workoutData: Record<string, any>;
  steps: number;
  completedCount: number;
  stepHistory?: Record<string, number>;
  workoutHistory?: Record<string, number>;
  timeHistory?: Record<string, number>;
}
const STORAGE_KEY = (uid: string) => `appData_${uid}`;
const ANON_KEY = 'anonUserId';
const USER_KEY = 'userId';
const ALL_DATA_KEY = 'allAppData';

function safeParse<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

export function getUserId() {
  let userId = localStorage.getItem(USER_KEY);
  if (userId) return userId;

  let anonId = localStorage.getItem(ANON_KEY);
  if (!anonId) {
    anonId = uuidv4();
    localStorage.setItem(ANON_KEY, anonId);
  }

  return anonId;
}

export function setSignedInUser(clerkUserId: string) {
  localStorage.setItem(USER_KEY, clerkUserId);

  const anon = localStorage.getItem(ANON_KEY);
  if (anon) {
    const anonData = safeParse<AppData>(localStorage.getItem(STORAGE_KEY(anon)), {
      timerData: {},
      workoutData: {},
      steps: 0,
      completedCount: 0,
    } as any);
    const current = safeParse<AppData>(localStorage.getItem(STORAGE_KEY(clerkUserId)), {
      timerData: {},
      workoutData: {},
      steps: 0,
      completedCount: 0,
    } as any);

    const merged: AppData = {
      timerData: { ...current.timerData, ...anonData.timerData },
      workoutData: { ...current.workoutData, ...anonData.workoutData },
      steps: (current.steps || 0) + (anonData.steps || 0),
      completedCount: (current.completedCount || 0) + (anonData.completedCount || 0),
      stepHistory: { ...(current.stepHistory || {}), ...(anonData.stepHistory || {}) },
      workoutHistory: { ...(current.workoutHistory || {}), ...(anonData.workoutHistory || {}) },
      timeHistory: { ...(current.timeHistory || {}), ...(anonData.timeHistory || {}) },
    };
    localStorage.setItem(STORAGE_KEY(clerkUserId), JSON.stringify(merged));
    localStorage.removeItem(STORAGE_KEY(anon));
  }
}

export function loadAppData(): AppData {
  const uid = getUserId();
  return safeParse<AppData>(localStorage.getItem(STORAGE_KEY(uid)), {
    timerData: {},
    workoutData: {},
    steps: 0,
    completedCount: 0,
  } as any);
}

export function updateAppData(patch: Partial<AppData>) {
  const uid = getUserId();
  const current = loadAppData();
  const next: AppData = {
    ...current,
    ...patch,
    timerData: { ...(current.timerData || {}), ...(patch.timerData || {}) },
    workoutData: { ...(current.workoutData || {}), ...(patch.workoutData || {}) },
    stepHistory: { ...(current.stepHistory || {}), ...(patch.stepHistory || {}) },
    workoutHistory: { ...(current.workoutHistory || {}), ...(patch.workoutHistory || {}) },
    timeHistory: { ...(current.timeHistory || {}), ...(patch.timeHistory || {}) },
  };
  localStorage.setItem(STORAGE_KEY(uid), JSON.stringify(next));
  updateAllUserData();
}

export function removeAppdata() {
  const uid = getUserId();
  localStorage.removeItem(STORAGE_KEY(uid));
}

export function updateAllUserData() {
  const uid: any = getUserId();
  const all = loadAllAppData();
  all[uid] = loadAppData();
  localStorage.setItem(ALL_DATA_KEY, JSON.stringify(all));
}

export function loadAllAppData() {
  return JSON.parse(localStorage.getItem(ALL_DATA_KEY) || '{}');
}
