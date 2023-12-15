import { useAuthStore } from '@/stores/authStore'

export default {
  mounted(el: any, binding: any) {
    if (!binding.value) return
    const authStore = useAuthStore()
    const currentTag = binding.value?.currentTag
    const effect = binding.value?.effect
    const currentRight = authStore.getUserPermission()
    let item = currentRight.filter((item) => {
      return item === currentTag
    })
    if (item.length === 0) {
      if (effect === 'disabled') {
        el.disabled = true
        el.classList.add('is-disabled')
      } else {
        el.parentNode.removeChild(el)
      }
    }
  },
  name: 'permission',
}
