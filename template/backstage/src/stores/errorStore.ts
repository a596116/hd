import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', () => {
  const errors = ref<Record<string, any>>({})

  const getError = computed(() => {
    return (name: string) => errors.value[name]
  })
  const hasError = computed(() => {
    return Object.keys(errors).length > 0
  })

  const resetError = () => {
    errors.value = {}
  }
  const setErrors = (error: Record<string, string[]>) => {
    Object.entries(error).forEach(([key, value]) => {
      errors.value[key] = value[0]
    })
  }
  const clearError = (name: string) => {
    if (errors.value[name]) {
      delete errors.value[name]
    }
  }

  return { errors, getError, hasError, resetError, setErrors, clearError }
})
