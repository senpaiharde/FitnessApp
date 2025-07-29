import { v4 } from 'uuid';
interface AppData {
  timerData: Record<number, { time: number; minute: number; hour: number }> | null;
  workoutData: Record<string, any>; // or your specific workout shape
  steps: number;
}

const ANON_KEY = 'anonUserId';
const USER_KEY = 'userId';
export function getUserId() {
  let id = localStorage.getItem(USER_KEY);
  if (id) return id;
  if (!id) {
    id = v4();
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

export function setSignedInUser(clerkUserId: string) {
  const anon = localStorage.getItem(ANON_KEY);
  if (anon) {
    const oldKey = `appdata_${anon}`;
    
    const raw = localStorage.getItem(oldKey);
    if (raw) {
      localStorage.setItem(`appData_${clerkUserId}`, raw);
      localStorage.removeItem(oldKey);
    }

  }
  localStorage.setItem(USER_KEY, clerkUserId);
}

const STORAGE_KEY = (uid) => `appData_${uid}`;

export function loadAppData(): AppData {
  const uid = getUserId();
  const raw = localStorage.getItem(STORAGE_KEY(uid));

  return raw ? (JSON.parse(raw) as AppData) : { timerData: null, workoutData: {}, steps: 0 };
}

export function saveAppData(data: AppData) {
  const uid = getUserId();
  localStorage.setItem(STORAGE_KEY(uid), JSON.stringify(data));
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
