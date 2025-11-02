# Design: Transform Portfolio to Useful Tools Application

## Architecture Overview

This design transforms the single-page portfolio application into a multi-page utility application with persistent navigation, theme management, and reorganized content structure.

```
┌─────────────────────────────────────────────────┐
│             App.vue (Root)                      │
│  ┌───────────────────────────────────────────┐  │
│  │      NavigationMenu Component             │  │
│  │   [Home] [Settings] [About] [App Info]    │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │         Router View (Content)             │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Route: /                           │  │  │
│  │  │  ToolsHomeView                      │  │  │
│  │  │  - Current Date/Time Display        │  │  │
│  │  │  - Clock Component                  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Route: /settings                   │  │  │
│  │  │  SettingsView                       │  │  │
│  │  │  - Language Selector                │  │  │
│  │  │  - Theme Mode Selector              │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Route: /about                      │  │  │
│  │  │  AboutView (moved from HomeView)    │  │  │
│  │  │  - All portfolio sections           │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Route: /app-info                   │  │  │
│  │  │  AppInfoView                        │  │  │
│  │  │  - Version, Build Info              │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Component Structure

### New Components

#### 1. NavigationMenu Component
**Location**: `src/components/NavigationMenu.vue`

**Purpose**: Primary navigation across all pages

**Technology Choice**: shadcn-vue NavigationMenu or Tabs component
- **Rationale**: Accessible, keyboard navigable, supports mobile responsive design
- **Alternative Considered**: Custom nav component - rejected due to accessibility concerns

**Props**: None (reads from router state)

**Features**:
- Active route highlighting
- Mobile-responsive (hamburger menu on small screens)
- Supports i18n for menu labels

#### 2. Clock Component
**Location**: `src/components/tools/Clock.vue`

**Purpose**: Display current time with live updates

**Technology**: Vue 3 Composition API with `setInterval` or `@vueuse/core` `useNow()`
- **Rationale**: `useNow()` is more efficient and provides reactive time updates
- **Alternative**: Manual setInterval - requires manual cleanup

**Features**:
- Real-time updates (1-second interval)
- Formatted time display
- Option to show seconds
- Supports 12/24 hour format based on locale

#### 3. DateDisplay Component
**Location**: `src/components/tools/DateDisplay.vue`

**Purpose**: Display current date with formatting

**Features**:
- Formatted date display
- Localized date format (respects i18n)
- Day of week display

### Modified Components

#### NavBar Component
**Current State**: Minimal navigation, language toggle
**Changes**:
- Option 1: Extend with full navigation menu
- Option 2: Replace with new NavigationMenu component
**Recommendation**: Replace with NavigationMenu for cleaner separation of concerns

### Views Structure

```
src/views/
├── ToolsHomeView.vue       (NEW - replaces HomeView at / route)
├── SettingsView.vue        (NEW)
├── AppInfoView.vue         (NEW)
├── AboutView.vue           (RENAMED from HomeView)
└── sections/               (UNCHANGED)
    ├── HeroSection.vue
    ├── AboutSection.vue
    ├── ExperienceSection.vue
    ├── TechStackSection.vue
    ├── ContactSection.vue
    └── FooterSection.vue
```

## State Management

### Theme Store (Pinia)
**Location**: `src/stores/theme.ts`

**State**:
```typescript
{
  mode: 'light' | 'dark' | 'auto',  // User preference
  effectiveTheme: 'light' | 'dark'  // Computed based on mode and system
}
```

**Actions**:
- `setThemeMode(mode)` - Update user preference
- `initializeTheme()` - Load from localStorage and apply
- `syncSystemTheme()` - Watch system preference changes

**Persistence**: localStorage key `theme-mode`

**Technology Choice**: `@vueuse/core` `usePreferredDark()` for system detection
- **Rationale**: Built-in reactivity, automatic cleanup, cross-browser compatible
- **Alternative**: Manual `matchMedia` - requires more boilerplate

### Settings Store (Pinia)
**Location**: `src/stores/settings.ts` (NEW)

**State**:
```typescript
{
  version: string,           // From package.json
  buildDate: string,         // Injected at build time
}
```

**Getters**:
- `appVersion` - Returns formatted version string
- `appMetadata` - Returns all app info

## Routing Strategy

### Route Configuration

```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tools-home',
      component: () => import('../views/ToolsHomeView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/app-info',
      name: 'app-info',
      component: () => import('../views/AppInfoView.vue'),
    },
    // Redirect old home to about for backwards compatibility
    {
      path: '/portfolio',
      redirect: '/about',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Existing scroll behavior
  },
})
```

### Route Guards

**Theme Initialization**: Apply theme before first render
```typescript
router.beforeEach((to, from, next) => {
  const themeStore = useThemeStore()
  if (!themeStore.initialized) {
    themeStore.initializeTheme()
  }
  next()
})
```

## Theme Implementation

### CSS Variables Approach

**Current State**: Tailwind CSS with CSS variables for colors (`:root` and `.dark`)

**Enhancement Strategy**:
1. Add data attribute `data-theme` to `<html>` element
2. Keep existing CSS variable structure
3. Add auto mode support with system detection

**Implementation**:
```typescript
// In theme store
const applyTheme = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', theme)
  // Existing dark class toggle for Tailwind
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Watch for system changes in auto mode
watch(systemPrefersDark, (isDark) => {
  if (themeMode.value === 'auto') {
    applyTheme(isDark ? 'dark' : 'light')
  }
})
```

### Tailwind Dark Mode

**Current**: `dark:` variant support exists
**Enhancement**: Ensure all new components use dark mode classes

**Strategy**: Continue using Tailwind's class-based dark mode with `.dark` on html element

## Data Flow

### Theme Selection Flow

```
User clicks theme button
    ↓
SettingsView emits theme change
    ↓
ThemeStore.setThemeMode(mode)
    ↓
Store updates localStorage
    ↓
Store computes effectiveTheme
    ↓
applyTheme(effectiveTheme)
    ↓
DOM updates (data-theme attribute + dark class)
    ↓
CSS variables + Tailwind classes update UI
```

### Time Display Flow

```
Component mounts
    ↓
useNow() composable initializes
    ↓
Reactive ref updates every second
    ↓
Template displays formatted time
    ↓
Component unmounts
    ↓
useNow() auto-cleanup (interval cleared)
```

## Design Decisions

### Decision 1: Navigation Component Location

**Options**:
1. In App.vue layout
2. In individual views
3. Separate layout component

**Choice**: App.vue layout (Option 1)

**Rationale**:
- Consistent navigation across all pages
- Single source of truth for navigation state
- Easier to maintain and style consistently
- Follows common SPA patterns

### Decision 2: Theme Storage

**Options**:
1. localStorage only
2. Cookies for SSR compatibility
3. Session storage (per-session)

**Choice**: localStorage (Option 1)

**Rationale**:
- Persists across sessions (better UX)
- No SSR requirements (static site)
- Simple API, good browser support
- Aligns with existing language preference storage

### Decision 3: Time Update Mechanism

**Options**:
1. Manual `setInterval`
2. `@vueuse/core` `useNow()`
3. Web Workers for background updates

**Choice**: `@vueuse/core` `useNow()` (Option 2)

**Rationale**:
- Automatic cleanup (no memory leaks)
- Built-in reactivity with Vue 3
- Efficient (shared interval across components)
- Simpler than Web Workers for this use case
- Package already installed

### Decision 4: Navigation Component Library

**Options**:
1. shadcn-vue NavigationMenu
2. shadcn-vue Tabs
3. Custom component with Router Links

**Choice**: shadcn-vue Tabs (Option 2)

**Rationale**:
- Better mobile responsive design
- Simpler API than NavigationMenu
- Clear active state styling
- Integrates well with Vue Router
- Accessible by default

**Alternative**: Custom component for full control - deferred until needed

### Decision 5: App Version Source

**Options**:
1. Read from package.json at runtime
2. Inject at build time via Vite
3. Hardcode version string

**Choice**: Inject at build time (Option 2)

**Rationale**:
- Avoids bundling package.json
- Can include build timestamp
- Vite provides `import.meta.env` for custom vars
- Most accurate for deployed version

**Implementation**:
```typescript
// vite.config.ts
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
})
```

## Performance Considerations

### Code Splitting
- Use lazy loading for all views
- Navigation component loaded eagerly (small footprint)
- Tool components lazy loaded per route

### Bundle Size
- Theme system: ~2KB (mostly reusing existing)
- Navigation: ~5KB (shadcn-vue Tabs)
- Clock components: ~3KB
- Total new code: ~10KB gzipped

### Rendering Performance
- Clock updates: requestAnimationFrame not needed (1s interval sufficient)
- Theme switching: Single DOM update with CSS variables (fast)
- Navigation: No virtualization needed (4 items)

## Accessibility

### Keyboard Navigation
- Tab through navigation items
- Enter/Space to activate
- Arrow keys for navigation menu (if using NavigationMenu)

### Screen Readers
- Proper ARIA labels on navigation
- Live region for clock updates (aria-live="polite")
- Focus management on route changes

### Color Contrast
- Maintain WCAG AA compliance in both themes
- Test all new components in light and dark modes
- Ensure sufficient contrast for time display

## Testing Strategy

### Unit Tests
- Theme store: mode switching, persistence, system detection
- Settings store: version retrieval
- Clock component: time formatting, updates
- Navigation: active state, route changes

### E2E Tests
- Navigate between all pages
- Toggle theme modes and verify persistence
- Verify theme follows system preference in auto mode
- Check language switching works on all pages
- Verify clock updates in real-time

### Visual Regression
- Screenshot tests for each page in light/dark
- Navigation active states
- Mobile responsive layouts

## Migration Path

### Phase 1: Infrastructure
1. Create navigation component
2. Add new routes
3. Set up theme store
4. Implement theme switching

### Phase 2: Content
5. Create ToolsHomeView with Clock
6. Create SettingsView
7. Rename HomeView to AboutView
8. Create AppInfoView

### Phase 3: Polish
9. Add route transitions
10. Update i18n for new pages
11. Add E2E tests
12. Update documentation

### Phase 4: Deployment
13. Update meta tags and title
14. Deploy to GitHub Pages
15. Monitor for issues
16. Collect user feedback

## Open Questions

1. **Clock Format**: Should default format follow browser locale or have explicit setting?
   - **Recommendation**: Follow locale initially, add setting in future iteration

2. **Navigation Persistence**: Should last visited page be remembered?
   - **Recommendation**: No, always start at home. Can add later if desired.

3. **Additional Time Tools**: When to add timezone, stopwatch, timer?
   - **Recommendation**: Defer to future iterations, keep scope minimal

4. **Mobile Navigation**: Hamburger menu or bottom nav bar?
   - **Recommendation**: Tabs component adapts well; evaluate after implementation

5. **Theme Transition**: Smooth animation or instant switch?
   - **Recommendation**: Instant for better performance, smooth animation is subtle improvement for later

## Future Enhancements

- Additional time tools (timezone converter, timer, stopwatch)
- Additional tool categories (text, developer, calculator)
- Customizable home page (widget selection)
- Export/import settings
- Tool favorites/bookmarks
- Recent tools history
- Keyboard shortcuts
- PWA support for offline use