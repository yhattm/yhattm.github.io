# Capability: Interactive UI Animations

## ADDED Requirements

### Requirement: Scroll-Triggered Animations
The system MUST animate elements when they enter the viewport during scrolling.

#### Scenario: Statistics cards animate on scroll
**Given** the user scrolls toward the about section
**When** the statistics cards enter the viewport (10% threshold)
**Then** each card:
- Fades in from opacity 0 to 1
- Translates from 30px below to original position
- Transition duration: 600ms with ease-out easing
- Unobserves itself after animation (performance optimization)

#### Scenario: Timeline items animate sequentially
**Given** the user scrolls to the experience section
**When** timeline items enter viewport
**Then** each timeline item:
- Animates with fade-in and slide-up effect
- Triggers independently based on viewport position
- Completes animation before unobserving

#### Scenario: Tech items animate with stagger
**Given** the user scrolls to tech stack section
**When** tech items enter viewport
**Then** each item:
- Fades in with slide-up effect
- Progress bar animates from 0% to target percentage
- Animation triggers when item crosses viewport threshold

---

### Requirement: Code Typing Animation
The system MUST display a typing animation effect for the code snippet in the hero section.

#### Scenario: Code types on initial page load
**Given** the user visits the homepage
**When** the hero section is visible (50% threshold)
**Then** the code window:
- Starts with empty code content
- Types out Golang code character by character
- Typing speed: 30ms per character
- Starts 500ms after hero section becomes visible
- Displays full code:
  ```
  package main

  import "fmt"

  func main() {
      fmt.Println("Hello, World!")
      // Building the future
      // with clean code
  }
  ```

#### Scenario: Typing animation runs only once
**Given** the typing animation has completed
**When** the user scrolls away and returns to hero section
**Then** the code displays in full immediately (no re-animation)

---

### Requirement: 3D Perspective Code Window Effect
The system MUST apply 3D perspective effect to the code window based on mouse movement.

#### Scenario: Mouse movement creates perspective tilt
**Given** the user moves mouse over the hero section
**When** mouse position changes
**Then** the code window:
- Rotates on Y-axis based on horizontal mouse position (-20deg to +20deg)
- Rotates on X-axis based on vertical mouse position (-20deg to +20deg)
- Maintains perspective transform: `perspective(1000px)`
- Transitions smoothly between positions

#### Scenario: Mouse leave resets perspective
**Given** the code window has perspective rotation applied
**When** the user moves mouse out of hero section
**Then** the code window smoothly returns to default rotation (0deg, 0deg)

---

### Requirement: Navbar Scroll Effects
The system MUST update navbar appearance based on scroll position.

#### Scenario: Navbar becomes more opaque on scroll
**Given** the user scrolls down the page
**When** scroll position exceeds 100px
**Then** the navbar:
- Background opacity increases from 0.8 to 0.95
- Box shadow appears: `0 4px 6px rgba(0, 0, 0, 0.1)`

#### Scenario: Navbar returns to semi-transparent at top
**Given** the navbar has increased opacity from scrolling
**When** scroll position returns to less than 100px
**Then** the navbar:
- Background opacity decreases to 0.8
- Box shadow removes

---

### Requirement: Active Navigation Link Highlighting
The system MUST highlight the active navigation link based on current scroll section.

#### Scenario: Navigation link becomes active on section entry
**Given** the user scrolls through the page
**When** a section occupies the viewport (offset -100px from top)
**Then** the corresponding navigation link:
- Adds "active" CSS class
- Changes color to primary color (--primary)
- All other nav links remove "active" class

#### Scenario: Active link updates smoothly during scroll
**Given** the user scrolls from About to Experience section
**When** Experience section crosses the activation threshold
**Then** the system:
- Removes "active" from About nav link
- Adds "active" to Experience nav link
- Transition happens immediately based on scroll position

---

### Requirement: Smooth Scroll Navigation
The system MUST provide smooth scrolling when clicking navigation links.

#### Scenario: Clicking nav link scrolls smoothly to section
**Given** the user clicks a navigation link (e.g., "#experience")
**When** the click event triggers
**Then** the system:
- Prevents default anchor jump behavior
- Scrolls smoothly to target section with offset (-80px for navbar)
- Uses native smooth scroll behavior: `behavior: 'smooth'`

---

### Requirement: Interactive Hover Effects
The system MUST provide visual feedback on interactive elements.

#### Scenario: Statistics cards scale on hover
**Given** the user hovers over a statistics card
**When** mouseenter event triggers
**Then** the card:
- Translates up by 10px: `translateY(-10px)`
- Scales to 105%: `scale(1.05)`
- Transition duration: 300ms

**When** mouseleave event triggers
**Then** the card returns to original state

#### Scenario: Timeline markers change on hover
**Given** the user hovers over a timeline item
**When** mouseenter event triggers
**Then** the timeline marker:
- Background changes from solid primary to gradient
- Gradient: `linear-gradient(135deg, var(--primary), var(--secondary))`

**When** mouseleave event triggers
**Then** marker returns to solid primary background

#### Scenario: Language toggle button lifts on hover
**Given** the user hovers over language toggle button
**When** mouseenter event triggers
**Then** the button:
- Background changes to primary color
- Border color changes to primary
- Translates up by 2px
- Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)

---

### Requirement: Particle Background Effect
The system MUST display subtle animated particles in the background.

#### Scenario: Particles spawn periodically
**Given** the page is loaded
**When** every 3 seconds interval triggers
**Then** the system:
- Creates a new particle element
- Positions randomly across viewport (0-100vw, 0-100vh)
- Applies float animation (5-15 seconds duration)
- Removes particle after 15 seconds (memory cleanup)

#### Scenario: Particle animation creates depth
**Given** a particle is created
**When** the float animation plays
**Then** the particle:
- Starts at opacity 0
- Fades in to opacity 0.5 (10% through animation)
- Moves vertically by -100px and horizontally by random ±50px
- Fades out to opacity 0 (90% through animation)
- Uses ease-in-out easing

---

### Requirement: Performance Optimization
The system MUST optimize animations for performance.

#### Scenario: Intersection Observer unobserves after animation
**Given** an element has completed its scroll animation
**When** the animation finishes
**Then** the IntersectionObserver:
- Unobserves the element
- Frees up observer resources
- Prevents unnecessary re-triggering

#### Scenario: Animations use GPU-accelerated properties
**Given** any CSS animation or transition is applied
**When** the animation runs
**Then** the system:
- Uses transform properties (translateX, translateY, scale) instead of position properties
- Uses opacity instead of display changes
- Ensures smooth 60fps performance

---

### Requirement: Reduced Motion Support
The system MUST respect user's motion preferences for accessibility.

#### Scenario: Reduced motion preference disables animations
**Given** the user has enabled "prefers-reduced-motion" in OS settings
**When** the page loads
**Then** the system:
- Sets all animation durations to 0.01ms
- Sets all transition durations to 0.01ms
- Maintains functionality without visual motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Details

### Scroll Animation Composable
```typescript
import { ref, onMounted } from 'vue'

export function useScrollAnimation(threshold = 0.1, rootMargin = '0px 0px -100px 0px') {
  const isVisible = ref(false)
  const targetRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (!targetRef.value) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(targetRef.value)
  })

  return { isVisible, targetRef }
}
```

### Component Usage
```vue
<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const { isVisible, targetRef } = useScrollAnimation(0.1)
</script>

<template>
  <div
    ref="targetRef"
    :class="{ 'is-visible': isVisible }"
    class="animated-element"
  >
    Content
  </div>
</template>

<style scoped>
.animated-element {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.animated-element.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
```

---

## CSS Transition Variables
```css
:root {
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Performance Targets
- First animation frame: < 100ms after trigger
- Animation frame rate: 60fps (16.67ms per frame)
- No layout thrashing (use transform, not position)
- Memory cleanup: Remove particle elements after lifecycle
- Intersection Observer cleanup: Unobserve after trigger