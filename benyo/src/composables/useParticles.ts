import { onMounted, onUnmounted } from 'vue'

interface Particle {
  element: HTMLDivElement
  timeoutId: number
}

export function useParticles() {
  const particles: Particle[] = []
  let intervalId: number | undefined

  const createParticle = () => {
    const particle = document.createElement('div')
    particle.className = 'particle'

    const duration = 5 + Math.random() * 10
    const xOffset = Math.random() * 100 - 50

    particle.style.cssText = `
      position: fixed;
      width: 2px;
      height: 2px;
      background: rgba(59, 130, 246, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 100}vh;
      animation: float-particle ${duration}s infinite ease-in-out;
      --x-offset: ${xOffset}px;
    `

    document.body.appendChild(particle)

    // Remove particle after 15 seconds
    const timeoutId = window.setTimeout(() => {
      particle.remove()
      const index = particles.findIndex((p) => p.element === particle)
      if (index !== -1) {
        particles.splice(index, 1)
      }
    }, 15000)

    particles.push({ element: particle, timeoutId })
  }

  const addParticleStyles = () => {
    // Check if styles already exist
    if (document.getElementById('particle-styles')) {
      return
    }

    const style = document.createElement('style')
    style.id = 'particle-styles'
    style.textContent = `
      @keyframes float-particle {
        0%, 100% {
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 0.5;
        }
        90% {
          opacity: 0.5;
        }
        50% {
          transform: translateY(-100px) translateX(var(--x-offset, 0px));
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .particle {
          animation: none !important;
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)
  }

  const cleanup = () => {
    // Clear interval
    if (intervalId !== undefined) {
      clearInterval(intervalId)
    }

    // Remove all particles and their timeouts
    particles.forEach(({ element, timeoutId }) => {
      element.remove()
      clearTimeout(timeoutId)
    })
    particles.length = 0

    // Remove styles
    const styleElement = document.getElementById('particle-styles')
    if (styleElement) {
      styleElement.remove()
    }
  }

  onMounted(() => {
    addParticleStyles()
    // Create particles every 3 seconds
    intervalId = window.setInterval(createParticle, 3000)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    cleanup,
  }
}
