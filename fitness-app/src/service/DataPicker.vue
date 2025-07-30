<!-- components/DataPicker.vue -->
<template>
  <div class="data-picker" ref="picker" :style="pickerStyle">
    <!-- visible box -->
    <div class="picker-box" @click="toggle">
      {{ displayText }}
      <span class="arrow">▼</span>
    </div>

    <!-- dropdown list -->
    <div v-if="open" class="dropdown">
      <div
        v-for="(opt, i) in options"
        :key="i"
        class="dropdown-item"
        @click="select(opt)"
      >
        {{ opt }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  options:    { type: Array, required: true },
  modelValue: { type: [String, Number], default: null },
  width:      { type: String, default: '200px' },
  height:     { type: String, default: '40px' },
});
const emit = defineEmits(['update:modelValue']);
const open = ref(false);
const picker = ref(null);

// toggle dropdown
function toggle() {
  open.value = !open.value;
}
// choose an item
function select(opt) {
  emit('update:modelValue', opt);
  open.value = false;
}
// text shown in the box
const displayText = computed(() =>
  props.modelValue != null ? props.modelValue : 'Select…'
);

// click-outside closes
function onClickOutside(e) {
  if (picker.value && !picker.value.contains(e.target)) {
    open.value = false;
  }
}
onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

// inline style for sizing
const pickerStyle = computed(() => ({
  width: props.width,
  '--dp-height': props.height
}));
</script>

<style scoped>
.data-picker {
  position: relative;
  font-family: sans-serif;
}
.picker-box {
  height: var(--dp-height);
  line-height: var(--dp-height);
  padding: 0 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.arrow {
  margin-left: 0.5rem;
  font-size: 0.8em;
}
.dropdown {
  position: absolute;
  top: calc(var(--dp-height) + 4px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 10;
}
.dropdown-item {
  padding: 0.5rem;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f5f5f5;
}
</style>
