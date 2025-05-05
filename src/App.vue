<script setup lang="ts">
import ApiConfigPanel from './components/ApiConfigPanel.vue'
import ApiResponsePanel from './components/ApiResponsePanel.vue'
import JsonInput from './components/JsonInput.vue'
import JsonOutput from './components/JsonOutput.vue'
import ToastNotification from './components/ToastNotification.vue'
import { useJsonStore } from './stores/jsonStore'

const jsonStore = useJsonStore()

// Handle formatting with keyboard shortcut
function handleKeyDown(e: KeyboardEvent) {
  if (e.ctrlKey && e.key === 'Enter') {
    jsonStore.formatJson()
  }
}
</script>

<template>
  <div class="app-container" @keydown="handleKeyDown">
    <header>
      <h1>JSON Formatter</h1>
      <small class="shortcut-hint">Press Ctrl+Enter to format</small>
    </header>

    <main>
      <div class="editor-container">
        <div class="panel source-panel">
          <h2>Source JSON</h2>
          <JsonInput
            v-model="jsonStore.sourceJson" placeholder="Paste your JSON here..."
            @format="jsonStore.formatJson"
          />

          <div class="button-group">
            <button :disabled="!jsonStore.sourceJson" @click="jsonStore.formatJson">
              Format JSON
            </button>
            <button
              class="secondary" :disabled="!jsonStore.isJsonValid || jsonStore.isLoading"
              @click="jsonStore.sendJsonToApi"
            >
              <span v-if="jsonStore.isLoading">Sending...</span>
              <span v-else>Send to API</span>
            </button>
            <button class="text" title="Configure API endpoint" @click="jsonStore.toggleApiConfig">
              API Config
            </button>
            <button class="text" title="Clear all inputs and outputs" @click="jsonStore.clearAll">
              Clear All
            </button>
          </div>
        </div>

        <div class="panel result-panel">
          <JsonOutput :json="jsonStore.formattedJson" />
        </div>
      </div>

      <ApiResponsePanel />
    </main>

    <ApiConfigPanel />
    <ToastNotification :message="jsonStore.error" type="error" />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);

  @media (min-width: 768px) {
    padding: var(--spacing-lg);
  }
}

header {
  text-align: center;
  margin-bottom: var(--spacing-lg);

  h1 {
    margin-bottom: var(--spacing-xs);
    background: linear-gradient(90deg, var(--color-primary-variant), var(--color-secondary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
  }

  .shortcut-hint {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
  }
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;

  .editor-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);

    @media (min-width: 1024px) {
      flex-direction: row;
    }

    .panel {
      flex: 1;
      display: flex;
      flex-direction: column;

      h2 {
        margin-top: 0;
        margin-bottom: var(--spacing-md);
        font-size: 1.25rem;
        font-weight: 600;
      }
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);

      @media (max-width: 768px) {
        button {
          flex: 1 0 calc(50% - var(--spacing-sm));

          &.text {
            flex: 1 0 calc(25% - var(--spacing-sm));
          }
        }
      }
    }
  }
}

// Animation for panel transitions
.panel {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-elevation-1);
  transition:
    transform var(--transition-normal),
    box-shadow var(--transition-normal);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-elevation-2);
  }
}
</style>
