<script setup>
import { Teleport } from 'vue';


</script>

<template>

<Teleport to="#portal">
  <div class="portal">
    <slot />
  </div>
</Teleport>
<section></section>
</template>

<style scoped></style>
