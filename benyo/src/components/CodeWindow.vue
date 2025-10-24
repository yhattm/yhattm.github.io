<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const codeContent = ref('')
const codeWindowRef = ref<HTMLElement | null>(null)
const hasTyped = ref(false)
const rotateX = ref(0)
const rotateY = ref(0)

const fullCode = `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    // Building the future
    // with clean code
}`

let observer: IntersectionObserver | null = null

const typeCode = () => {
  if (hasTyped.value) return

  let i = 0
  const typingInterval = setInterval(() => {
    if (i < fullCode.length) {
      codeContent.value += fullCode.charAt(i)
      i++
    } else {
      clearInterval(typingInterval)
      hasTyped.value = true
    }
  }, 30)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!codeWindowRef.value) return

  const rect = codeWindowRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateXValue = ((y - centerY) / centerY) * -20
  const rotateYValue = ((x - centerX) / centerX) * 20

  rotateX.value = rotateXValue
  rotateY.value = rotateYValue
}

const handleMouseLeave = () => {
  rotateX.value = 0
  rotateY.value = 0
}

onMounted(() => {
  const heroSection = document.querySelector('.hero')

  if (heroSection) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTyped.value) {
            setTimeout(() => {
              typeCode()
            }, 500)
            if (observer) {
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(heroSection)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div
    ref="codeWindowRef"
    class="code-window"
    :style="{
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="code-header">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <pre class="code-content"><code>{{ codeContent }}</code></pre>
  </div>
</template>

<style scoped>
.code-window {
  background: var(--dark-800);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-out;
  max-width: 500px;
  width: 100%;
}

.code-header {
  background: var(--dark-700);
  padding: 0.75rem 1rem;
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--dark-600);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--dark-600);
}

.dot:nth-child(1) {
  background: #ff5f56;
}

.dot:nth-child(2) {
  background: #ffbd2e;
}

.dot:nth-child(3) {
  background: #27c93f;
}

.code-content {
  padding: 1.5rem;
  color: var(--text);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  min-height: 200px;
  overflow-x: auto;
}

.code-content code {
  color: var(--text);
}

@media (max-width: 768px) {
  .code-window {
    max-width: 100%;
  }

  .code-content {
    font-size: 0.75rem;
    padding: 1rem;
  }
}
</style>
