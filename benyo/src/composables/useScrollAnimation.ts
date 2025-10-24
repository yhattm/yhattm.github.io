import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollAnimation(
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px'
): {
  isVisible: Ref<boolean>
  targetRef: Ref<HTMLElement | null>
} {
  const isVisible = ref(false)
  const targetRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (observer) {
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { isVisible, targetRef }
}
