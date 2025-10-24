# Design: Import Portfolio Content

## Architecture Overview

This change transforms a static HTML/CSS/JS portfolio into a Vue 3 single-page application using component-based architecture, TypeScript, and Pinia for state management.

## Component Hierarchy

```
App.vue
├── LanguageToggle.vue (fixed position)
├── NavBar.vue (sticky navigation)
└── RouterView
    └── HomeView.vue (single-page layout)
        ├── HeroSection.vue
        │   └── CodeWindow.vue
        ├── AboutSection.vue
        │   └── StatCard.vue (x3)
        ├── ExperienceSection.vue
        │   └── TimelineItem.vue (x3)
        ├── TechStackSection.vue
        │   └── TechCategory.vue (x4)
        │       └── TechItem.vue (multiple)
        ├── ContactSection.vue
        └── FooterSection.vue
```

## State Management

### Language Store (Pinia)
```typescript
interface LanguageState {
  currentLang: 'en' | 'zh'
  preferredLang: 'en' | 'zh'
}

interface LanguageStore {
  state: LanguageState
  toggleLanguage(): void
  setLanguage(lang: 'en' | 'zh'): void
  loadPreference(): void
  savePreference(): void
}
```

**Rationale**: Centralized language state allows any component to access or change the current language. Using Pinia provides type-safe state management with DevTools support.

**Trade-offs**:
- **Pro**: Single source of truth for language state
- **Pro**: Easy to test language switching logic
- **Pro**: Auto-persists to localStorage
- **Con**: Slight overhead for simple boolean toggle (accepted for consistency)

### Alternative Considered: Provide/Inject
- **Why not chosen**: Pinia provides better TypeScript inference, DevTools integration, and testing utilities

## Component Design Patterns

### 1. Bilingual Content Components

**Pattern**: Props-based translation
```typescript
interface BilingualText {
  en: string
  zh: string
}

// Usage in components
const heroTitle: BilingualText = {
  en: 'Backend Developer',
  zh: '後端開發工程師'
}
```

**Rationale**: Keep translations close to components rather than separate i18n files for simpler maintenance in a small portfolio project.

**Trade-offs**:
- **Pro**: Co-located translations with components
- **Pro**: No additional i18n library dependency
- **Pro**: Type-safe with TypeScript interfaces
- **Con**: Doesn't scale well for large applications (accepted for portfolio scope)
- **Con**: No pluralization or advanced i18n features (not needed)

**Alternative Considered**: Vue I18n
- **Why not chosen**: Overkill for two languages and simple content; adds dependency and complexity

### 2. Animation Strategy

**Pattern**: Vue Transition + Intersection Observer composable
```typescript
// useScrollAnimation.ts
export function useScrollAnimation(threshold = 0.1) {
  const isVisible = ref(false)
  const targetRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -100px 0px' }
    )

    if (targetRef.value) observer.observe(targetRef.value)
  })

  return { isVisible, targetRef }
}
```

**Rationale**: Composable pattern for scroll animations provides reusability and testability while maintaining performance.

**Trade-offs**:
- **Pro**: Reusable across components
- **Pro**: Performance-optimized (unobserve after trigger)
- **Pro**: Easy to test and maintain
- **Con**: Requires ref binding in each component (accepted for explicitness)

**Alternative Considered**: Third-party animation library (AOS, GSAP)
- **Why not chosen**: Adds bundle size; native solution is sufficient and more maintainable

### 3. Responsive Design

**Pattern**: CSS Grid/Flexbox with CSS custom properties
```css
:root {
  --primary: #3b82f6;
  --spacing-md: 2rem;
  --radius-sm: 0.5rem;
}

/* Component scoped styles use variables */
.hero-content {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr 1fr;
  }
}
```

**Rationale**: CSS custom properties enable consistent theming across components while scoped styles prevent conflicts.

**Trade-offs**:
- **Pro**: No CSS-in-JS overhead
- **Pro**: Leverages Vue's scoped styles
- **Pro**: Easy to maintain and debug
- **Con**: Less dynamic than CSS-in-JS (not needed for this use case)

## Data Flow

### Language Toggle Flow
```
User clicks LanguageToggle
  → Component calls languageStore.toggleLanguage()
    → Store updates currentLang state
      → All components with computed translations re-render
        → Store saves preference to localStorage
```

### Scroll Animation Flow
```
User scrolls page
  → IntersectionObserver detects element visibility
    → Composable updates isVisible ref
      → Component transition triggers
        → CSS animation plays
          → Observer unobserves element (cleanup)
```

## Performance Considerations

### 1. Code Splitting
**Strategy**: Route-level code splitting (not needed initially since all content is on one page)
**Future**: If additional pages added, use Vue Router's lazy loading

### 2. Animation Performance
**Optimization**:
- Use CSS transforms (GPU-accelerated)
- Unobserve elements after animation triggers
- Throttle scroll event listeners if needed

### 3. Image Optimization
**Current**: No images in static version
**Future**: If images added, use Vite's asset optimization and lazy loading

## Testing Strategy

### Unit Tests (Vitest + Vue Test Utils)
- **LanguageToggle**: Toggle functionality, localStorage persistence
- **Language Store**: State mutations, localStorage integration
- **TechItem**: Progress bar rendering, animation triggers
- **TimelineItem**: Content rendering in both languages
- **useScrollAnimation**: Intersection observer behavior

### E2E Tests (Playwright)
- Language toggle workflow (EN → ZH → verify content changes)
- Scroll through all sections (verify animations trigger)
- Navigation link clicks (verify smooth scroll behavior)
- Responsive layouts (mobile, tablet, desktop viewports)

## Security Considerations

1. **XSS Prevention**: All content is static strings in code; Vue automatically escapes interpolations
2. **localStorage**: Only stores language preference ('en'|'zh'); minimal risk
3. **External Links**: LinkedIn and GitHub links use `target="_blank"` with implicit `rel="noopener"`

## Accessibility

1. **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
2. **Keyboard Navigation**: All interactive elements focusable
3. **ARIA Labels**: Add aria-labels to icon-only buttons (language toggle)
4. **Color Contrast**: Maintain WCAG AA compliance (verify with existing design)
5. **Reduced Motion**: Respect `prefers-reduced-motion` media query

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Migration Path

### Phase 1: Structure (Foundation)
1. Create component files with TypeScript interfaces
2. Set up Pinia language store
3. Create shared composables (useScrollAnimation, useLanguage)
4. Define CSS custom properties in global styles

### Phase 2: Content (Section by Section)
1. Migrate Hero section → test → commit
2. Migrate About section → test → commit
3. Migrate Experience section → test → commit
4. Migrate Tech Stack section → test → commit
5. Migrate Contact section → test → commit

### Phase 3: Interactivity
1. Implement language toggle with store
2. Add scroll animations via composable
3. Port particle effects (optional, evaluate need)
4. Add navigation link active states

### Phase 4: Polish
1. Add component tests
2. Add E2E tests
3. Verify responsive design
4. Accessibility audit
5. Performance audit

## Open Technical Questions

None - all technical decisions are well-defined based on existing static implementation and Vue 3 best practices.

## References

- Vue 3 Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- Pinia Stores: https://pinia.vuejs.org/core-concepts/
- Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Vue Transitions: https://vuejs.org/guide/built-ins/transition.html