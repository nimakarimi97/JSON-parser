<script setup lang="ts">
import Prism from 'prismjs'
import { ref, watch } from 'vue'
import { useJsonStore } from '../stores/jsonStore'

const jsonStore = useJsonStore()
const showResponse = ref(false)
const responseRef = ref<HTMLElement | null>(null)

function toggleResponsePanel() {
  showResponse.value = !showResponse.value

  if (showResponse.value && jsonStore.apiResponse) {
    setTimeout(() => {
      if (responseRef.value) {
        Prism.highlightElement(responseRef.value)
      }
    }, 0)
  }
}

watch(() => jsonStore.apiResponse, (newValue) => {
  if (newValue && showResponse.value) {
    setTimeout(() => {
      if (responseRef.value) {
        Prism.highlightElement(responseRef.value)
      }
    }, 0)
  }
})
</script>

<template>
  <div v-if="jsonStore.apiResponse || jsonStore.error" class="api-response-container">
    <button class="response-toggle" @click="toggleResponsePanel">
      <span v-if="jsonStore.apiResponseStatus">Response ({{ jsonStore.apiResponseStatus }})</span>
      <span v-else>Response</span>
      <span class="toggle-icon">{{ showResponse ? '▼' : '▶' }}</span>
    </button>

    <div v-if="showResponse" class="response-panel">
      <div v-if="jsonStore.error" class="error-message">
        {{ jsonStore.error }}
      </div>

      <div v-else class="response-content">
        <pre><code ref="responseRef" class="language-json">{{ jsonStore.apiResponse }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-response-container {
  margin-top: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  overflow: hidden;

  .response-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-surface-variant);
    border: none;
    color: var(--color-on-surface);
    font-weight: 500;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    .toggle-icon {
      font-size: 0.8em;
      transition: transform var(--transition-fast);
    }
  }

  .response-panel {
    padding: var(--spacing-md);
    max-height: 300px;
    overflow: auto;

    .error-message {
      color: var(--color-error);
    }

    .response-content {
      pre {
        margin: 0;

        code {
          font-family: 'Roboto Mono', monospace;
        }
      }
    }
  }
}
</style>
