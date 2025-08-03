<script setup>
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
  isAnimating: Object,
  handleChangeDisplay: Function,
  selectedDisplay: Number,
  appData: Object,
});
const hasSaved = computed(() => {
  return Object.keys(props.appData.workoutData).length > 0;
});
console.log('App mounted with data:', hasSaved.value, props.selectedDisplay);
// start on Dashboard (2) if saved, otherwise Welcome (1)
const activePage = ref(hasSaved.value ? 2 : 1);
let isFirstLoad = true;
onMounted(() => {
  if (isFirstLoad) {
    isFirstLoad = false;
    activePage.value = props.selectedDisplay;
  }
});
watch(
  () => props.selectedDisplay,
  (newPage) => {
    if (hasSaved.value && newPage !== 1) {
      // only animate for pages 2–4

      const leaveDuration = 200;
      activePage.value = null; // triggers leave animation
      setTimeout(() => {
        activePage.value = newPage; // triggers enter animation
      }, leaveDuration);
    } else {
      activePage.value = newPage; // no animation for Welcome (1)
    }
  },
  { immediate: true }
);
animation = props.isAnimating;
function getDuration(height) {
  const baseHeight = 400;
  const baseDuration = 500;
  const maxDuration = 1000;
  return Math.min(maxDuration, (height / baseHeight) * baseDuration);
}

function enter(el, done) {
  const height = el.scrollHeight;
  const duration = getDuration(height);
  const buffer = 2500;

  animation.value = true;

  el.style.overflow = 'hidden';

  el.style.maxHeight = '0px';
  el.style.transition = `max-height ${duration}ms ease`;

  requestAnimationFrame(() => {
    el.style.maxHeight = height + 'px';
  });

  setTimeout(() => {
    done(); // Vue marks transition as done

    // Wait a bit longer to unlock full natural height
    setTimeout(() => {
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';
      animation.value = false;
    }, buffer);
  }, duration);
}

function leave(el, done) {
  const height = el.scrollHeight;
  const duration = getDuration(height);

  el.style.overflow = 'hidden';

  el.style.maxHeight = height + 'px';
  el.style.transition = `max-height ${duration}ms ease`;

  requestAnimationFrame(() => {
    el.style.maxHeight = '0px';
  });

  setTimeout(done, duration);
}
</script>

<template>
  <header>
    <div class="HeaderTop">
      <h1>Fitness App</h1>
      <div>
        <button @click="() => handleChangeDisplay(4)">Dashboard</button>
        <button @click="() => handleChangeDisplay(2)" class="HeaderButton">Workout</button>
      </div>
    </div>
  </header>

  <main>
    <!-- Animate using activePage instead of selectedDisplay directly -->
    <transition @enter="enter" @leave="leave" mode="out-in">
      <div v-if="activePage !== null" :key="activePage" class="garage-container">
        <slot></slot>
      </div>
    </transition>
  </main>

  <footer>
    <small>Created by</small>
    <a href="https://github.com/senpaiharde" target="_blank">
      <img src="https://avatars.githubusercontent.com/u/66986422?v=4" alt="Logo" />
      <p>senpaiharde</p>
      <i class="fa-brands fa-github"></i>
    </a>
  </footer>
</template>

<style scoped>
.HeaderButton {
  margin-left: 0.5rem;
}
.HeaderTop {
  display: flex;
  justify-content: space-between;
}
header,
footer,
main {
  padding: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

main {
  flex: 1;
}

footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  padding: 2rem 0;
  padding-bottom: 3rem;
}

footer a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem;
  padding-right: 0.5rem;
  background: var(--background-muted);
  border-radius: 4rem;
  border: 1px solid transparent;
  transition-duration: 200ms;
  text-decoration: none;
}

footer a:hover {
  border-color: var(--color-link);
}

footer a img {
  max-width: 30px;
  aspect-ratio: 1 / 1;
  border-radius: 100%;
}
</style>
