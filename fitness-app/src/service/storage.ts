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
  const anon = localStorage.getItem(ANON_KEY);

  console.log('Setting signed-in user:', clerkUserId, 'from anon:', anon);
  if (anon) {
    const oldKey = `appData_${anon}`;

    const raw = localStorage.getItem(`appData_${anon}`);

    if (raw) {
      localStorage.setItem(`appData_${clerkUserId}`, raw);
      localStorage.removeItem(ANON_KEY);
    }
  }
  localStorage.setItem(USER_KEY, clerkUserId);
}
const userId = localStorage.getItem('userId') || localStorage.getItem('anonUserId');

export function loadAppData(): AppData {
  const uid = getUserId();
  console.log('Loading app data for user:', uid);
  const raw = localStorage.getItem(STORAGE_KEY(uid));

  return raw
    ? (JSON.parse(raw) as AppData)
    : {
        timerData: null,
        workoutData: {},
        steps: 0,
        completedCount: 0,
        stepHistory: {},
        workoutHistory: {},
        timeHistory: {},
      };
}

export function saveAppData(data: AppData) {
  const uid = getUserId();
  localStorage.setItem(STORAGE_KEY(uid), JSON.stringify(data));
  updateAllUserData();
}

export function updateAppData(patch: Partial<AppData>) {
  const Current = loadAppData();
  const merged = { ...Current, ...patch };
  saveAppData(merged);
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
