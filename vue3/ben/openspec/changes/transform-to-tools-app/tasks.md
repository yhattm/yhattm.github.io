# Tasks: Transform Portfolio to Useful Tools Application

## Phase 1: Theme Infrastructure (Foundation)

### Task 1.1: Create Theme Store
Create a Pinia store for theme management with support for light, dark, and auto modes.

**Files**:
- Create `src/stores/theme.ts`

**Acceptance Criteria**:
- Store has `mode` state ('light' | 'dark' | 'auto')
- Store has `effectiveTheme` computed property
- `setThemeMode(mode)` action updates and persists preference
- `initializeTheme()` action loads from localStorage
- localStorage key is `theme-mode`

**Dependencies**: None

**Validation**: Unit test theme store state and actions

---

### Task 1.2: Implement System Theme Detection
Add system preference detection using @vueuse/core for auto theme mode.

**Files**:
- Modify `src/stores/theme.ts`

**Acceptance Criteria**:
- Uses `usePreferredDark()` from @vueuse/core
- Auto mode watches system preference changes
- Theme updates when system preference changes
- No memory leaks on component unmount

**Dependencies**: Task 1.1

**Validation**: Test auto mode with system preference toggle

---

### Task 1.3: Apply Theme to DOM
Implement theme application logic that updates HTML element attributes and classes.

**Files**:
- Modify `src/stores/theme.ts`
- Modify `src/App.vue` (initialize theme on mount)

**Acceptance Criteria**:
- Sets `data-theme` attribute on `<html>` element
- Adds/removes `.dark` class for Tailwind compatibility
- Theme applies before first render (no flash)
- Theme switches instantly without page reload

**Dependencies**: Task 1.2

**Validation**: Manually verify theme switching and no FOUC (flash of unstyled content)

---

### Task 1.4: Add i18n Translations for New Pages
Add English and Chinese translations for all new UI text.

**Files**:
- Modify `src/locales/en.json`
- Modify `src/locales/zh.json`

**Acceptance Criteria**:
- Add translations for: Home, Settings, About Me, App Info
- Add translations for: Theme Mode (Light, Dark, Auto), Language, Appearance
- Add translations for app description and headings
- Translations are idiomatic in both languages

**Dependencies**: None (can be done in parallel)

**Validation**: Review translations with native speakers if possible

---

## Phase 2: Navigation System

### Task 2.1: Create Navigation Menu Component
Build a navigation component using shadcn-vue Tabs for page navigation.

**Files**:
- Create `src/components/NavigationMenu.vue`

**Acceptance Criteria**:
- Uses shadcn-vue Tabs component
- Shows 4 tabs: Home, Settings, About Me, App Info
- Integrates with Vue Router
- Active tab highlights current route
- Supports keyboard navigation
- Labels use i18n translations

**Dependencies**: Task 1.4

**Validation**: Navigate between pages and verify active state

---

### Task 2.2: Make Navigation Responsive
Adapt navigation for mobile devices with appropriate layout.

**Files**:
- Modify `src/components/NavigationMenu.vue`

**Acceptance Criteria**:
- Navigation stacks vertically or adapts on screens < 768px
- All navigation items remain accessible on mobile
- Touch-friendly tap targets (min 44x44px)
- No horizontal scrolling required

**Dependencies**: Task 2.1

**Validation**: Test on mobile viewport and actual mobile device

---

### Task 2.3: Integrate Navigation into App Layout
Add navigation menu to the main application layout.

**Files**:
- Modify `src/App.vue`

**Acceptance Criteria**:
- Navigation appears above router-view on all pages
- Navigation is sticky or fixed at top
- Proper spacing between navigation and content
- Navigation renders before route loads

**Dependencies**: Task 2.1

**Validation**: Navigate through all pages and verify consistent navigation

---

## Phase 3: Routing and Pages

### Task 3.1: Update Router Configuration
Add new routes for Tools Home, Settings, About Me, and App Info pages.

**Files**:
- Modify `src/router/index.ts`

**Acceptance Criteria**:
- `/` route points to ToolsHomeView
- `/settings` route points to SettingsView
- `/about` route points to AboutView (renamed from HomeView)
- `/app-info` route points to AppInfoView
- `/portfolio` redirects to `/about`
- All routes use lazy loading
- Scroll behavior preserved

**Dependencies**: None

**Validation**: Run `npm run type-check` and verify no errors

---

### Task 3.2: Rename and Move Portfolio Content
Rename HomeView to AboutView and update all portfolio sections to use new route.

**Files**:
- Rename `src/views/HomeView.vue` to `src/views/AboutView.vue`
- Update `src/router/index.ts` (done in Task 3.1)

**Acceptance Criteria**:
- File renamed without breaking git history (use `git mv`)
- All portfolio sections remain in AboutView
- No code changes needed in section components
- All imports updated

**Dependencies**: Task 3.1

**Validation**: View /about page and verify all sections display correctly

---

### Task 3.3: Create Tools Home View
Build the new home page with current date and time display.

**Files**:
- Create `src/views/ToolsHomeView.vue`
- Create `src/components/tools/Clock.vue`
- Create `src/components/tools/DateDisplay.vue`

**Acceptance Criteria**:
- ToolsHomeView displays Clock and DateDisplay components
- Clock shows current time with live updates (1s interval)
- DateDisplay shows current date with day of week
- Time format follows locale (12h for en, 24h for zh)
- Date format follows locale
- No memory leaks (interval cleaned up on unmount)
- Uses `useNow()` from @vueuse/core

**Dependencies**: Task 1.4, Task 3.1

**Validation**: Open home page, verify time updates every second, navigate away and check console for cleanup

---

### Task 3.4: Create Settings View
Build the settings page with language and theme controls.

**Files**:
- Create `src/views/SettingsView.vue`

**Acceptance Criteria**:
- Settings page has two sections: Appearance and Language
- Appearance section has theme mode selector (Light, Dark, Auto)
- Language section has language selector (English, Chinese)
- Selectors use shadcn-vue Select or RadioGroup components
- Current selections are visually indicated
- Changes apply immediately
- Uses theme store and language store

**Dependencies**: Task 1.1, Task 1.4, Task 3.1

**Validation**: Change theme and language, verify immediate updates and persistence

---

### Task 3.5: Create App Info View
Build the app info page displaying version and metadata.

**Files**:
- Create `src/views/AppInfoView.vue`

**Acceptance Criteria**:
- Displays application version from package.json
- Displays build timestamp
- Lists key technologies and versions
- Includes app description (i18n)
- Includes developer credits with link to About Me
- Clean, organized layout with sections
- Responsive on mobile

**Dependencies**: Task 1.4, Task 3.1

**Validation**: View app info page and verify all information displays correctly

---

### Task 3.6: Configure Build-time Version Injection
Set up Vite to inject version and build date at build time.

**Files**:
- Modify `vite.config.ts`
- Create `src/env.d.ts` (TypeScript declarations)

**Acceptance Criteria**:
- `__APP_VERSION__` global defined from package.json
- `__BUILD_DATE__` global defined from build timestamp
- TypeScript definitions for globals
- No runtime access to package.json needed

**Dependencies**: Task 3.5

**Validation**: Build app and verify version shows correctly on App Info page

---

## Phase 4: Styling and Polish

### Task 4.1: Theme All New Components
Ensure all new components properly support light and dark themes.

**Files**:
- Review all new components (Tasks 2.1, 3.3, 3.4, 3.5)

**Acceptance Criteria**:
- All components use Tailwind dark: variants
- Text has sufficient contrast in both themes (WCAG AA)
- No hard-coded colors that don't respect theme
- Interactive elements show clear hover/focus states in both themes

**Dependencies**: Task 1.3, Tasks 2.1-3.5

**Validation**: View each page in light and dark theme, check contrast ratios

---

### Task 4.2: Add Smooth Transitions
Add subtle transitions for theme changes and page navigation.

**Files**:
- Modify `src/App.vue` or create CSS utility classes

**Acceptance Criteria**:
- Theme transitions are smooth (background, text color)
- Page transitions are subtle (fade or slide)
- Transitions don't delay interactivity
- Reduced motion preference respected

**Dependencies**: Task 4.1

**Validation**: Toggle theme and navigate pages, verify smooth animations

---

### Task 4.3: Accessibility Audit
Review and fix any accessibility issues in new components.

**Files**:
- Review all new components

**Acceptance Criteria**:
- All interactive elements have focus indicators
- Keyboard navigation works throughout
- ARIA labels present where needed
- Screen reader announcements are appropriate
- Color contrast meets WCAG AA
- Live regions used for dynamic content (clock)

**Dependencies**: All previous tasks

**Validation**: Test with keyboard only, test with screen reader (VoiceOver/NVDA)

---

## Phase 5: Testing

### Task 5.1: Write Unit Tests for Theme Store
Test theme store functionality including persistence and system detection.

**Files**:
- Create `src/stores/__tests__/theme.spec.ts`

**Acceptance Criteria**:
- Test setThemeMode updates state and localStorage
- Test initializeTheme loads from localStorage
- Test auto mode respects system preference
- Test default theme for new users
- All tests pass

**Dependencies**: Task 1.3

**Validation**: Run `npm run test:unit` and verify all tests pass

---

### Task 5.2: Write Unit Tests for Clock Components
Test clock and date display components.

**Files**:
- Create `src/components/tools/__tests__/Clock.spec.ts`
- Create `src/components/tools/__tests__/DateDisplay.spec.ts`

**Acceptance Criteria**:
- Test clock updates time display
- Test date displays correct format
- Test locale changes update format
- Test interval cleanup on unmount
- All tests pass

**Dependencies**: Task 3.3

**Validation**: Run `npm run test:unit` and verify all tests pass

---

### Task 5.3: Write E2E Tests for Navigation
Test user navigation flows and page transitions.

**Files**:
- Create `e2e/navigation.spec.ts`

**Acceptance Criteria**:
- Test navigating to all pages
- Test active nav item highlighting
- Test navigation on mobile viewport
- Test keyboard navigation
- All tests pass

**Dependencies**: Task 2.3

**Validation**: Run `npm run test:e2e` and verify all tests pass

---

### Task 5.4: Write E2E Tests for Theme Switching
Test theme mode selection and persistence.

**Files**:
- Create `e2e/theme.spec.ts`

**Acceptance Criteria**:
- Test switching to light theme
- Test switching to dark theme
- Test switching to auto theme
- Test theme persists after reload
- Test auto theme follows system preference
- All tests pass

**Dependencies**: Task 3.4

**Validation**: Run `npm run test:e2e` and verify all tests pass

---

### Task 5.5: Write E2E Tests for Settings
Test settings page functionality.

**Files**:
- Create `e2e/settings.spec.ts`

**Acceptance Criteria**:
- Test changing language updates UI
- Test language persists after reload
- Test changing theme updates UI
- Test settings are keyboard accessible
- All tests pass

**Dependencies**: Task 3.4

**Validation**: Run `npm run test:e2e` and verify all tests pass

---

## Phase 6: Documentation and Deployment

### Task 6.1: Update project.md
Update OpenSpec project.md to reflect new architecture and purpose.

**Files**:
- Modify `openspec/project.md`

**Acceptance Criteria**:
- Update purpose to reflect tools application
- Update project structure section
- Document new views and components
- Update tech stack if any new dependencies added
- Document theme management system

**Dependencies**: All implementation tasks complete

**Validation**: Review with project team

---

### Task 6.2: Update README
Update README.md with new project description and features.

**Files**:
- Modify `README.md` (if exists, or create)

**Acceptance Criteria**:
- Describe project as useful tools application
- List key features (time/date tools, theme modes, portfolio)
- Update screenshots if applicable
- Document how to use settings
- Update development instructions if needed

**Dependencies**: Task 6.1

**Validation**: Review README for clarity and completeness

---

### Task 6.3: Update Meta Tags and Page Titles
Update HTML meta tags and titles to reflect new application purpose.

**Files**:
- Modify `index.html`
- Modify page title management in router or views

**Acceptance Criteria**:
- Update meta description to describe tools app
- Update Open Graph tags if present
- Add/update page titles for each route
- Titles use i18n translations

**Dependencies**: Task 3.1

**Validation**: View source and verify meta tags, check page titles in browser tabs

---

### Task 6.4: Build and Deploy
Build the application and deploy to GitHub Pages.

**Files**: N/A (deployment task)

**Acceptance Criteria**:
- Run `npm run build` with no errors
- Run `npm run type-check` with no errors
- Run `npm run lint` with no errors
- Deploy to GitHub Pages
- Verify deployed version works correctly
- Test all features in production

**Dependencies**: All tasks complete

**Validation**: Test production site thoroughly, check all routes work

---

### Task 6.5: Monitor and Fix Issues
Monitor deployed application for any issues and address them.

**Files**: Various (as needed)

**Acceptance Criteria**:
- Check browser console for errors
- Verify analytics/monitoring if configured
- Address any user-reported issues
- Fix any bugs discovered in production

**Dependencies**: Task 6.4

**Validation**: No critical errors in production, user feedback is positive

---

## Summary

**Total Tasks**: 32
**Estimated Effort**: 3-5 days for experienced developer
**Phases**: 6 (Infrastructure, Navigation, Pages, Polish, Testing, Deployment)

**Parallel Work Opportunities**:
- Tasks 1.4 (i18n) can be done anytime early
- Phase 5 (Testing) tasks can be done as corresponding features complete
- Task 6.1-6.3 (Documentation) can overlap with testing phase

**Critical Path**:
Phase 1 (Theme) → Phase 2 (Navigation) → Phase 3 (Pages) → Phase 4 (Polish) → Phase 5 (Testing) → Phase 6 (Deployment)

**Risk Areas**:
- Theme switching may have edge cases with complex components
- System theme detection may have browser compatibility issues
- Time updates could cause performance issues if not properly cleaned up
- Accessibility compliance requires thorough testing