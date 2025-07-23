<script setup>
import { Teleport } from 'vue';
const { onClose } = defineProps({
  onClose: Function,
  
});

console.log('Portal component loaded', onClose);
</script>

<template>
  <Teleport to="#portal">
    <div class="portal-container">
      <div role="button" tabindex="0" class="portal-underlay" @click="onClose"></div>

      <div class="portal-content">
        <slot></slot>
      </div>
    </div>
  </Teleport>
  <section></section>
</template>

<style scoped>
.portal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1001;
    }

    .portal-underlay {
        position: absolute;
        inset: 0;
        background: var(--background-primary);
        opacity: 0.7;
        z-index: 999;
        border: none;
        padding: none;
    }

    .portal-content {
        position: absolute;
        z-index: 1000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        max-width: 90vw;
        max-height: 80vh;
        display: grid;
        place-items: center;
        background: var(--background-primary);
        border-radius: var(--border-radius-small);
        padding: 1rem;
        border: 1px solid var(--background-muted);
    }
</style>
