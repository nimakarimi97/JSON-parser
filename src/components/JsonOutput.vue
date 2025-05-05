<script setup lang="ts">
import Prism from 'prismjs'
import { computed, onMounted, ref, watch } from 'vue'
import 'prismjs/components/prism-json'

const props = defineProps<{
  json: string
}>()

const copied = ref(false)
const outputRef = ref<HTMLElement | null>(null)

// Copy formatted JSON to clipboard
async function copyToClipboard() {
  if (!props.json)
    return

  try {
    await navigator.clipboard.writeText(props.json)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

// Process text with line numbers
const processTextWithLineNumbers = computed(() => {
  if (!props.json)
    return 'Formatted JSON will appear here...'

  const lines = props.json.split('\n')
  return lines.join('\n')
})

// Apply syntax highlighting when JSON changes
watch(() => props.json, () => {
  setTimeout(() => {
    if (outputRef.value) {
      Prism.highlightElement(outputRef.value)
    }
  }, 0)
})

onMounted(() => {
  if (outputRef.value && props.json) {
    Prism.highlightElement(outputRef.value)
  }
})
</script>

<template>
  <div class="json-output">
    <div class="output-header">
      <h3>Formatted JSON</h3>
      <button class="copy-btn" :disabled="!json" :class="{ copied }" @click="copyToClipboard">
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <div class="output-container">
      <pre><code ref="outputRef" class="language-json">{{ processTextWithLineNumbers }}</code></pre>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.json-output {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);

    h3 {
      margin: 0;
      font-weight: 600;
    }

    .copy-btn {
      font-size: 0.8rem;
      padding: var(--spacing-xs) var(--spacing-sm);
      background-color: var(--color-surface-variant);
      color: var(--color-on-surface);
      transition: background-color var(--transition-fast);

      &:hover:not(:disabled) {
        background-color: var(--color-primary-variant);
        color: var(--color-on-primary);
      }

      &.copied {
        background-color: var(--color-success);
        color: white;
      }
    }
  }

  .output-container {
    background-color: var(--color-surface-variant);
    border-radius: var(--border-radius-md);
    overflow: auto;
    flex-grow: 1;
    min-height: 300px;
    position: relative;

    pre {
      margin: 0;
      padding: var(--spacing-md);
      height: 100%;
      font-family: 'Roboto Mono', monospace;
      tab-size: 2;
      overflow: visible;

      code {
        font-family: 'Roboto Mono', monospace;
        white-space: pre;
        display: block;
      }
    }
  }
}
</style>
