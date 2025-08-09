import { createApp } from 'vue';
import './style.css';
import './stylesDesgin.css';
import App from './App.vue';
import { clerkPlugin } from '@clerk/vue';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const app = createApp(App);
if (PUBLISHABLE_KEY) {
  app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY });
} else {
  if (import.meta.env.DEV) console.warn('Clerk key missing. Auth features disabled.');
}
app.mount('#app');
