<script setup>
import { ref, Transition } from 'vue';

const { handleChangeDisplay } = defineProps({
  handleChangeDisplay: Function,
});

const statsGrid = ref(null);
const showStats = ref(true);
function toggleStats() {
  showStats.value = !showStats.value;
}

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
</script>

<template>
  <header>
    <div class="HeaderTop">
      <h1>Fitness App</h1>
      <div class="">
        <button
          @click="
            () => {
              handleChangeDisplay(4);
              toggleStats('dashboard');
            }
          "
        >
          Dashboard
        </button>
        <button
          @click="
            () => {
              handleChangeDisplay(2);
              toggleStats('workout');
            }
          "
          class="HeaderButton"
        >
          Workout
        </button>
      </div>
    </div>
  </header>
  <main>
    <transition @enter="enter" @leave="leave">
      <div v-if="showStats" class="garage-container">
        <!-- This is where the main content will be rendered -->
        <slot></slot>
      </div>
    </transition>

    <!-- This slot will render the Welcome component or any other content passed to Layouts -->`
  </main>
  <footer>
    <small> Created by </small>
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
