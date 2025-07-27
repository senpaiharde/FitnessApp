<template>
  <transition @enter="enter" @leave="leave" mode="out-in">
    <!-- Force a dynamic key based on the slotted content -->
    <div
      class="garage-container"
      :key="$slots.default ? $slots.default()[0]?.key || 'default' : 'default'"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
const container = ref(null);

// Animation timing
const duration = 500;

function enter(el, done) {
  const height = el.offsetHeight;
  el.style.position = 'relative';
  el.style.overflow = 'hidden';

  // Create top and bottom "covers"
  const top = document.createElement('div');
  const bottom = document.createElement('div');
  [top, bottom].forEach((cover) => {
    cover.style.position = 'absolute';
    cover.style.left = 0;
    cover.style.width = '100%';
    cover.style.background = '#fff'; // Match background or use gradient
    el.appendChild(cover);
  });

  top.style.top = '0';
  top.style.height = '50%';
  bottom.style.bottom = '0';
  bottom.style.height = '50%';

  // Animate from middle to open
  requestAnimationFrame(() => {
    top.style.transition = bottom.style.transition = `transform ${duration}ms ease`;
    top.style.transform = 'translateY(-100%)';
    bottom.style.transform = 'translateY(100%)';
  });

  setTimeout(() => {
    el.removeChild(top);
    el.removeChild(bottom);
    done();
  }, duration);
}

function leave(el, done) {
  const height = el.offsetHeight;
  el.style.position = 'relative';
  el.style.overflow = 'hidden';

  // Create top and bottom "covers"
  const top = document.createElement('div');
  const bottom = document.createElement('div');
  [top, bottom].forEach((cover) => {
    cover.style.position = 'absolute';
    cover.style.left = 0;
    cover.style.width = '100%';
    cover.style.background = '#fff';
    el.appendChild(cover);
  });

  top.style.top = '0';
  top.style.height = '50%';
  bottom.style.bottom = '0';
  bottom.style.height = '50%';

  // Animate from edges to middle (closing)
  requestAnimationFrame(() => {
    top.style.transition = bottom.style.transition = `transform ${duration}ms ease`;
    top.style.transform = 'translateY(100%)';
    bottom.style.transform = 'translateY(-100%)';
  });

  setTimeout(() => {
    done();
  }, duration);
}
</script>

<style scoped>
.garage-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
