<script setup>
import { Teleport } from 'vue';
</script>

<template>
  <Teleport to="#portal">
    <div class="portal-container">
      <div role="button" tabindex="0" class="portal-underlay" ></div>

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
  width: 100%;
  height: 100%;
  display: flex;
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
  max-width: 90%;
  max-height: 80%;
  display: grid;
  place-items: center;
  background-color: var(--background-primary);
  border-radius: var(--border-radius-small);
  padding: 1rem;
}
</style>
