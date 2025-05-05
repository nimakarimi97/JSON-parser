<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string | null
  type?: 'success' | 'error'
  duration?: number
}>()

const visible = ref(false)
let timeoutId: number | null = null

watch(
  () => props.message,
  (newVal) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    if (newVal) {
      visible.value = true
      timeoutId = window.setTimeout(() => {
        visible.value = false
      }, props.duration || 3000)
    }
  },
)
</script>

<template>
  <Transition name="toast-fade">
    <div
      v-if="visible && message"
      class="toast"
      :class="type"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.toast {
  position: fixed;
  bottom: var(--spacing-xl);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  box-shadow: var(--shadow-elevation-3);
  z-index: 1000;

  &.success {
    border-left: 4px solid var(--color-success);
  }

  &.error {
    border-left: 4px solid var(--color-error);
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition:
    opacity var(--transition-normal),
    transform var(--transition-normal);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
