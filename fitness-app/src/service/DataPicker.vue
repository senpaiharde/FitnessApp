<template>
  <div
    class="data-picker"
    ref="picker"
    :style="pickerStyle"
    @mousedown.prevent="onDragStart"
    @mousemove.prevent="onDrag"
    @mouseup.prevent="onDragEnd"
    @mouseleave.prevent="onDragEnd"
  >
    <div
      v-for="(opt, i) in repeatedOptions"
      :key="i"
      class="picker-item"
      :class="{ selected: opt === modelValue }"
      @click="select(opt)"
    >
      {{ opt }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  options: { type: Array, required: true },
  modelValue: { type: [String, Number], default: null },
  width: { type: String, default: '200px' },
  height: { type: String, default: '40px' },
});
const emit = defineEmits(['update:modelValue']);
const picker = ref(null);

// 3× repetition for infinite scroll
const repeatedOptions = computed(() => [...props.options, ...props.options, ...props.options]);

function select(opt) {
  emit('update:modelValue', opt);
}

// drag-scrolling
let isDragging = false,
  startY = 0,
  startScroll = 0;
function onDragStart(e) {
  isDragging = true;
  startY = e.clientY;
  startScroll = picker.value.scrollTop;
}
function onDrag(e) {
  if (!isDragging) return;
  picker.value.scrollTop = startScroll - (e.clientY - startY);
}
function onDragEnd() {
  isDragging = false;
}

// measurements
let itemHeight = 0,
  blockHeight = 0,
  lowThreshold = 0,
  highThreshold = 0;

function onScroll() {
  const c = picker.value;
  const items = c.querySelectorAll('.picker-item');
  const rect = c.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;

  // 3D tilt effect
  items.forEach((el) => {
    const r = el.getBoundingClientRect();
    const offset = (r.top + r.height / 2 - midY) / (rect.height / 2);
    el.style.transform = `rotateX(${offset * 30}deg)`;
  });

  // infinite-wrap when beyond thresholds
  const st = c.scrollTop;
  if (st < lowThreshold) {
    c.scrollTop += blockHeight;
  } else if (st > highThreshold) {
    c.scrollTop -= blockHeight;
  }
}

onMounted(() => {
  nextTick(() => {
    const el = picker.value.querySelector('.picker-item');
    if (el) {
      itemHeight = el.offsetHeight;
      blockHeight = itemHeight * props.options.length;
      // require scrolling past half a block before wrap
      const margin = blockHeight / 2;
      lowThreshold = blockHeight - margin; // = blockHeight/2
      highThreshold = blockHeight * 2 - margin; // = blockHeight*1.5
      // start in the middle block
      picker.value.scrollTop = blockHeight;
    }
    picker.value.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
});

onBeforeUnmount(() => {
  picker.value.removeEventListener('scroll', onScroll);
});

const pickerStyle = computed(() => ({
  width: props.width,
  height: props.height,
  overflowY: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  perspective: '500px',
}));
</script>

<style scoped>
.data-picker {
  position: relative;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.data-picker::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.picker-item {
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  transform-origin: center center;
  backface-visibility: hidden;
}

.picker-item.selected {
  background: #007bff;
  color: #fff;
  font-weight: bold;
}
</style>
