<script setup lang="ts">
import { computed, ref } from 'vue'
import { useJsonStore } from '../stores/jsonStore'

const jsonStore = useJsonStore()

const apiUrl = ref(jsonStore.apiUrl)
const headersText = ref(JSON.stringify(jsonStore.customHeaders, null, 2))
const isVisible = computed(() => jsonStore.showApiConfig)
const validationError = ref('')

function saveConfig() {
  validationError.value = ''

  // Validate URL
  try {
    new URL(apiUrl.value)
  }
  catch {
    validationError.value = 'Please enter a valid URL'
    return
  }

  // Validate headers JSON
  try {
    const headers = JSON.parse(headersText.value)
    if (typeof headers !== 'object' || headers === null) {
      throw new Error('Headers must be an object')
    }

    jsonStore.updateApiConfig({
      url: apiUrl.value,
      headers,
    })

    jsonStore.toggleApiConfig()
  }
  catch (e) {
    console.error(e)
    validationError.value = 'Headers must be a valid JSON object'
  }
}

function cancel() {
  apiUrl.value = jsonStore.apiUrl
  headersText.value = JSON.stringify(jsonStore.customHeaders, null, 2)
  jsonStore.toggleApiConfig()
}
</script>

<template>
  <div v-if="isVisible" class="api-config-overlay" @click.self="cancel">
    <div class="api-config-panel card">
      <h2>API Configuration</h2>

      <div class="form-group">
        <label for="api-url">API URL</label>
        <input
          id="api-url"
          v-model="apiUrl"
          type="text"
          placeholder="https://api.example.com/endpoint"
        >
      </div>

      <div class="form-group">
        <label for="api-headers">Headers (JSON)</label>
        <textarea
          id="api-headers"
          v-model="headersText"
          placeholder="{ &quot;Content-Type&quot;: &quot;application/json&quot; }"
          rows="5"
        />
        <small>Enter headers as a JSON object</small>
      </div>

      <div v-if="validationError" class="error-message">
        {{ validationError }}
      </div>

      <div class="button-group">
        <button class="secondary" @click="cancel">
          Cancel
        </button>
        <button @click="saveConfig">
          Save Configuration
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-config-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn var(--transition-normal);
}

.api-config-panel {
  width: 90%;
  max-width: 500px;
  animation: slideUp var(--transition-normal);

  h2 {
    margin-top: 0;
    margin-bottom: var(--spacing-lg);
  }

  .form-group {
    margin-bottom: var(--spacing-lg);

    label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-weight: 500;
    }

    small {
      display: block;
      color: rgba(255, 255, 255, 0.6);
      margin-top: var(--spacing-xs);
    }
  }

  .error-message {
    color: var(--color-error);
    margin-bottom: var(--spacing-md);
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
