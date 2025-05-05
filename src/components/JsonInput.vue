<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelValue: string
  placeholder?: string
  label?: string
}>()

const emit = defineEmits(['update:modelValue', 'format'])

function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const textareaRef = ref<HTMLTextAreaElement | null>(null)

// Resize textarea to fit content
function adjustTextareaHeight() {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}
</script>

<template>
  <div class="json-input">
    <label v-if="label" class="input-label">{{ label }}</label>
    <textarea
      ref="textareaRef"
      class="textarea"
      :value="modelValue"
      :placeholder="placeholder || 'Paste your JSON here...'"
      spellcheck="false"
      @input="handleInput"
      @keydown.tab.prevent="emit('format')"
      @keyup="adjustTextareaHeight"
    />
  </div>
</template>

<style lang="scss" scoped>
.json-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .input-label {
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
  }

  .textarea {
    min-height: 300px;
    max-height: 83%;
    resize: vertical;
    font-family: 'Roboto Mono', monospace;
    line-height: 1.5;
    tab-size: 2;
    overflow-y: auto;
    transition: border-color var(--transition-fast);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
}
</style>
