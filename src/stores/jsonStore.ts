import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface ApiConfig {
  url: string
  headers: Record<string, string>
}

export const useJsonStore = defineStore('json', () => {
  // State
  const sourceJson = ref<string>('')
  const formattedJson = ref<string>('')
  const error = ref<string | null>(null)
  const isLoading = ref<boolean>(false)
  const apiUrl = ref<string>('https://jolcatania.tim.it/live-mobility-data/api/parse')
  const customHeaders = ref<Record<string, string>>({
    'Content-Type': 'application/json',
  })
  const apiResponse = ref<{ status: number, data: any } | null>(null)
  const apiResponseStatus = ref<number | null>(null)
  const showApiConfig = ref<boolean>(false)

  // Computed properties
  const isJsonValid = computed(() => {
    if (!sourceJson.value.trim())
      return false
    try {
      JSON.parse(sourceJson.value)
      return true
    } catch {
      return false
    }
  })

  const formattedJsonWithLineBreaks = computed(() => {
    if (!formattedJson.value)
      return ''
    return formattedJson.value.split('\n').map(line => line).join('\n')
  })

  // Actions
  function formatJson() {
    error.value = null
    if (!sourceJson.value.trim()) {
      error.value = 'Please enter JSON to format'
      return
    }

    try {
      const parsed = JSON.parse(sourceJson.value)
      formattedJson.value = JSON.stringify(parsed, null, 2)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Invalid JSON'
      formattedJson.value = ''
    }
  }

  async function sendJsonToApi() {
    if (!isJsonValid.value) {
      error.value = 'Please ensure JSON is valid before sending'
      return
    }

    isLoading.value = true
    error.value = null
    apiResponse.value = null
    apiResponseStatus.value = null

    try {
      apiResponse.value = await axios.post(apiUrl.value, sourceJson.value, { headers: customHeaders.value })
      apiResponseStatus.value = apiResponse.value.status
      formattedJson.value = JSON.stringify(apiResponse.value.data, null, 2)

      if (apiResponse.value.status !== 200) {
        error.value = `API error: ${apiResponse.value.status} ${apiResponse.value.data}`
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Network error'
    } finally {
      isLoading.value = false
    }
  }

  function toggleApiConfig() {
    showApiConfig.value = !showApiConfig.value
  }

  function updateApiConfig(config: ApiConfig) {
    apiUrl.value = config.url
    customHeaders.value = config.headers
  }

  function clearAll() {
    sourceJson.value = ''
    formattedJson.value = ''
    error.value = null
    apiResponse.value = null
    apiResponseStatus.value = null
  }

  return {
    sourceJson,
    formattedJson,
    error,
    isLoading,
    apiUrl,
    customHeaders,
    apiResponse,
    apiResponseStatus,
    showApiConfig,
    isJsonValid,
    formattedJsonWithLineBreaks,
    formatJson,
    sendJsonToApi,
    toggleApiConfig,
    updateApiConfig,
    clearAll,
  }
})
