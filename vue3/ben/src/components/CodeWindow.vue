<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

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
  <Card
    ref="codeWindowRef"
    class="bg-gray-800 overflow-hidden shadow-2xl transition-transform duration-200 ease-out max-w-lg w-full border-gray-700"
    :style="{
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <CardHeader class="bg-gray-700 px-4 py-3 flex flex-row gap-2 border-b border-gray-600 p-3">
      <span class="w-3 h-3 rounded-full bg-red-500"></span>
      <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
      <span class="w-3 h-3 rounded-full bg-green-500"></span>
    </CardHeader>
    <CardContent class="p-6 md:p-4">
      <pre
        class="text-gray-100 font-mono text-sm leading-relaxed m-0 min-h-[200px] overflow-x-auto"
      ><code>{{ codeContent }}</code></pre>
    </CardContent>
  </Card>
</template>