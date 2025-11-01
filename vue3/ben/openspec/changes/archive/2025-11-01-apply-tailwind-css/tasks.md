# Tasks: Apply Tailwind CSS

## Overview

This document outlines the implementation tasks for migrating from custom CSS to Tailwind CSS. Tasks are ordered to deliver incremental user-visible progress.

## Phase 1: Setup and Configuration

### 1. Install Tailwind CSS dependencies

**Goal**: Install all required Tailwind packages and plugins.

**Actions**:
- Run `npm install -D tailwindcss @tailwindcss/typography @tailwindcss/forms @tailwindcss/container-queries autoprefixer`
- Verify installation in `package.json`

**Validation**:
- [x] All packages appear in `devDependencies`
- [x] `npm list tailwindcss` shows correct version

**Dependencies**: None

---

### 2. Create Tailwind configuration file

**Goal**: Set up Tailwind configuration with content paths and plugins.

**Actions**:
- Create `tailwind.config.js` at project root
- Configure content paths: `['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']`
- Add plugins: typography, forms, container-queries
- Set dark mode to 'media'

**Validation**:
- [x] `tailwind.config.js` exists and is valid JavaScript
- [x] Content paths include all Vue files
- [x] All three plugins are registered

**Dependencies**: Task 1 (dependencies installed)

---

### 3. Create PostCSS configuration file

**Goal**: Configure PostCSS to process Tailwind CSS.

**Actions**:
- Create `postcss.config.js` at project root
- Add `tailwindcss` and `autoprefixer` plugins

**Validation**:
- [x] `postcss.config.js` exists and is valid JavaScript
- [x] Both plugins are configured

**Dependencies**: Task 1 (dependencies installed)

---

### 4. Create Tailwind CSS entry file

**Goal**: Import Tailwind directives into the application.

**Actions**:
- Create `src/assets/tailwind.css`
- Add Tailwind directives: `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`
- Update `src/main.ts` to import `./assets/tailwind.css`
- Remove imports for `base.css` and `main.css` from `src/main.ts`

**Validation**:
- [x] `src/assets/tailwind.css` exists with all three directives
- [x] `src/main.ts` imports Tailwind CSS
- [x] Old CSS imports removed from `src/main.ts`

**Dependencies**: Task 2 (Tailwind config exists)

---

### 5. Verify Tailwind build integration

**Goal**: Ensure Tailwind CSS compiles correctly in development.

**Actions**:
- Run `npm run dev`
- Open browser and verify Tailwind styles are loading (check DevTools)
- Check for any build errors or warnings

**Validation**:
- [x] Dev server starts without errors
- [x] Tailwind CSS appears in browser DevTools
- [x] No console errors related to CSS

**Dependencies**: Tasks 1-4 (setup complete)

---

## Phase 2: Component Migration

### 6. Migrate App.vue

**Goal**: Convert root application component to Tailwind.

**Actions**:
- Replace `<style>` block in `App.vue` with Tailwind utility classes
- Update template classes for layout (`max-w-*`, `mx-auto`, `p-*`)
- Update link styles with Tailwind utilities
- Remove `<style>` block entirely

**Validation**:
- [x] App layout renders correctly
- [x] Skip link styling works
- [x] Responsive layout preserved
- [x] No `<style>` block remains

**Dependencies**: Task 5 (Tailwind verified)

**User-visible**: Application basic layout uses Tailwind

---

### 7. Migrate NavBar component

**Goal**: Convert navigation bar to Tailwind with responsive behavior.

**Actions**:
- Replace custom classes with Tailwind utilities
- Use `sticky`, `top-0`, `z-50` for positioning
- Implement responsive menu with `hidden`, `md:flex`
- Use flexbox utilities for layout
- Remove `<style scoped>` block

**Validation**:
- [x] NavBar renders correctly on mobile and desktop
- [x] Sticky positioning works
- [x] Menu toggle functionality preserved
- [x] Dark mode colors work
- [x] No `<style>` block remains

**Dependencies**: Task 6 (App.vue migrated)

**User-visible**: Navigation bar styled with Tailwind

---

### 8. Migrate LanguageToggle component

**Goal**: Convert language toggle button to Tailwind.

**Actions**:
- Replace button styles with Tailwind utilities
- Use `bg-*`, `hover:bg-*`, `text-*`, `rounded`, `p-*`
- Add transition classes
- Remove `<style scoped>` block

**Validation**:
- [x] Toggle button renders correctly
- [x] Hover and active states work
- [x] Language switching functionality preserved
- [x] No `<style>` block remains

**Dependencies**: Task 7 (NavBar migrated - language toggle often in nav)

**User-visible**: Language toggle button styled with Tailwind

---

### 9. Migrate HeroSection

**Goal**: Convert hero section to Tailwind with gradient background.

**Actions**:
- Replace gradient background with `bg-gradient-to-b`, `from-*`, `to-*`
- Use grid layout utilities: `grid`, `grid-cols-1`, `md:grid-cols-2`
- Apply spacing with `p-*`, `gap-*`
- Migrate typography with `text-*`, `font-*`, `leading-*`
- Remove `<style scoped>` block

**Validation**:
- [x] Hero section layout works on all screen sizes
- [x] Gradient background renders correctly
- [x] Typography scales properly
- [x] CTA buttons styled correctly
- [x] No `<style>` block remains

**Dependencies**: Task 6 (App.vue provides container)

**User-visible**: Hero section fully styled with Tailwind

---

### 10. Migrate AboutSection

**Goal**: Convert about section to Tailwind.

**Actions**:
- Replace section spacing with Tailwind utilities
- Migrate text styles with typography utilities
- Apply container and layout classes
- Remove `<style scoped>` block

**Validation**:
- [x] Section spacing correct
- [x] Typography renders properly
- [x] Content remains readable
- [x] No `<style>` block remains

**Dependencies**: Task 9 (previous section)

**User-visible**: About section styled with Tailwind

---

### 11. Migrate StatCard component

**Goal**: Convert stat card to Tailwind card styling.

**Actions**:
- Use card utilities: `bg-white`, `dark:bg-gray-800`, `rounded-lg`, `shadow-lg`
- Add borders with `border`, `border-gray-200`
- Apply padding with `p-*`
- Add hover effects: `hover:shadow-xl`, `transition-shadow`
- Remove `<style scoped>` block

**Validation**:
- [x] Cards render correctly
- [x] Shadow and border styling works
- [x] Hover effects smooth
- [x] Dark mode colors correct
- [x] No `<style>` block remains

**Dependencies**: Task 10 (used in AboutSection)

**User-visible**: Stat cards styled with Tailwind

---

### 12. Migrate TimelineItem component

**Goal**: Convert timeline item to Tailwind.

**Actions**:
- Migrate timeline layout with flexbox/grid utilities
- Style timeline marker with `rounded-full`, `bg-*`
- Apply card styling to content
- Add spacing utilities
- Remove `<style scoped>` block

**Validation**:
- [x] Timeline layout correct
- [x] Timeline markers styled properly
- [x] Content cards render correctly
- [x] Responsive behavior works
- [x] No `<style>` block remains

**Dependencies**: Task 11 (card styling pattern established)

**User-visible**: Timeline items styled with Tailwind

---

### 13. Migrate ExperienceSection

**Goal**: Convert experience section to Tailwind.

**Actions**:
- Migrate section layout and spacing
- Ensure TimelineItem components render correctly
- Apply section title styles
- Remove `<style scoped>` block

**Validation**:
- [x] Section layout correct
- [x] Timeline displays properly
- [x] Spacing consistent with other sections
- [x] No `<style>` block remains

**Dependencies**: Task 12 (TimelineItem migrated)

**User-visible**: Experience section styled with Tailwind

---

### 14. Migrate TechItem component

**Goal**: Convert technology item to Tailwind.

**Actions**:
- Style tech icon with `text-*`, `bg-*`, `rounded`
- Migrate progress bar with `w-full`, `bg-gray-200`, `rounded`
- Add progress fill with `bg-blue-600`, transition classes
- Apply hover and visibility effects
- Remove `<style scoped>` block

**Validation**:
- [x] Tech items render correctly
- [x] Icons and names displayed properly
- [x] Progress bars animated
- [x] Visibility animation works
- [x] No `<style>` block remains

**Dependencies**: Task 11 (card styling pattern)

**User-visible**: Technology items styled with Tailwind

---

### 15. Migrate TechCategory component

**Goal**: Convert tech category grouping to Tailwind.

**Actions**:
- Migrate category header styles
- Apply grid layout for tech items
- Add spacing utilities
- Remove `<style scoped>` block

**Validation**:
- [x] Categories render correctly
- [x] Grid layout works responsively
- [x] Spacing between items correct
- [x] No `<style>` block remains

**Dependencies**: Task 14 (TechItem migrated)

**User-visible**: Technology categories styled with Tailwind

---

### 16. Migrate TechStackSection

**Goal**: Convert tech stack section to Tailwind.

**Actions**:
- Migrate section layout and spacing
- Ensure TechCategory components render correctly
- Apply section title styles
- Remove `<style scoped>` block

**Validation**:
- [x] Section layout correct
- [x] All tech categories display properly
- [x] Spacing consistent
- [x] No `<style>` block remains

**Dependencies**: Task 15 (TechCategory migrated)

**User-visible**: Tech stack section styled with Tailwind

---

### 17. Migrate CodeWindow component

**Goal**: Convert code window to Tailwind with monospace styling.

**Actions**:
- Style container with `bg-gray-900`, `dark:bg-gray-950`, `rounded-lg`
- Add window chrome (dots) with `rounded-full`, `bg-*`
- Use `font-mono`, `text-sm` for code content
- Apply padding and spacing
- Remove `<style scoped>` block

**Validation**:
- [x] Code window renders correctly
- [x] Monospace font applied
- [x] Window chrome styled properly
- [x] Dark mode works
- [x] No `<style>` block remains

**Dependencies**: Task 9 (used in HeroSection)

**User-visible**: Code window styled with Tailwind

---

### 18. Migrate ContactSection

**Goal**: Convert contact section to Tailwind.

**Actions**:
- Migrate section layout and spacing
- Style contact links with `text-blue-600`, `hover:text-blue-800`
- Apply button styles if present
- Remove `<style scoped>` block

**Validation**:
- [x] Section layout correct
- [x] Contact links styled and hoverable
- [x] Spacing consistent
- [x] No `<style>` block remains

**Dependencies**: Task 16 (previous section)

**User-visible**: Contact section styled with Tailwind

---

### 19. Migrate FooterSection

**Goal**: Convert footer to Tailwind.

**Actions**:
- Migrate footer layout with flexbox utilities
- Style footer text with text utilities
- Apply background and border classes
- Add padding and spacing
- Remove `<style scoped>` block

**Validation**:
- [x] Footer renders correctly
- [x] Layout responsive
- [x] Links styled properly
- [x] No `<style>` block remains

**Dependencies**: Task 18 (previous section)

**User-visible**: Footer styled with Tailwind

---

### 20. Migrate remaining icon components

**Goal**: Convert icon components to Tailwind (if they have styles).

**Actions**:
- Check `src/components/icons/*.vue` for `<style>` blocks
- Migrate any custom styles to Tailwind utilities
- Remove `<style>` blocks if present

**Validation**:
- [x] All icons render correctly
- [x] No `<style>` blocks remain in icon components

**Dependencies**: None (can be done in parallel)

**User-visible**: Icons styled with Tailwind (if applicable)

---

### 21. Migrate AboutView (if different from AboutSection)

**Goal**: Convert AboutView page to Tailwind.

**Actions**:
- Check if AboutView exists and has separate styling
- Migrate any custom styles to Tailwind utilities
- Remove `<style>` block

**Validation**:
- [x] AboutView renders correctly
- [x] No `<style>` block remains

**Dependencies**: Task 10 (AboutSection migrated)

**User-visible**: About page styled with Tailwind

---

## Phase 3: Cleanup and Verification

### 22. Remove old CSS files

**Goal**: Delete all custom CSS files no longer needed.

**Actions**:
- Delete `src/assets/base.css`
- Delete `src/assets/main.css`
- Delete `src/assets/variables.css`
- Keep only `src/assets/tailwind.css`

**Validation**:
- [x] Old CSS files deleted
- [x] `git status` shows deletions
- [x] Application still renders correctly without old files

**Dependencies**: Tasks 6-21 (all components migrated)

**User-visible**: Codebase cleaner with only Tailwind CSS

---

### 23. Verify responsive design

**Goal**: Test all components across different screen sizes.

**Actions**:
- Test mobile viewport (375px, 414px)
- Test tablet viewport (768px, 1024px)
- Test desktop viewport (1280px, 1920px)
- Verify all sections, components, navigation, and content

**Validation**:
- [x] Mobile layout works correctly
- [x] Tablet layout works correctly
- [x] Desktop layout works correctly
- [x] No horizontal scrolling on mobile
- [x] All interactive elements accessible

**Dependencies**: Tasks 6-21 (all components migrated)

---

### 24. Verify dark mode functionality

**Goal**: Test dark mode across all components.

**Actions**:
- Switch system to dark mode
- Verify all sections render correctly
- Check color contrast and readability
- Test interactive states (hover, focus)

**Validation**:
- [x] Dark mode colors correct across all components
- [x] Text readable in dark mode
- [x] Hover and focus states work
- [x] No visual glitches

**Dependencies**: Tasks 6-21 (all components migrated)

---

### 25. Run type checking

**Goal**: Ensure TypeScript types still valid after migration.

**Actions**:
- Run `npm run type-check`
- Fix any type errors if present

**Validation**:
- [x] Type checking passes with no errors
- [x] No new TypeScript warnings

**Dependencies**: Tasks 6-21 (all components migrated)

---

### 26. Run linting

**Goal**: Ensure code quality standards maintained.

**Actions**:
- Run `npm run lint`
- Fix any linting errors or warnings

**Validation**:
- [x] Linting passes with no errors
- [x] No new linting warnings

**Dependencies**: Tasks 6-21 (all components migrated)

---

### 27. Run unit tests

**Goal**: Verify all unit tests pass after migration.

**Actions**:
- Run `npm run test:unit`
- Fix any failing tests
- Update tests if needed for new class names

**Validation**:
- [x] All unit tests pass
- [x] No test failures or errors

**Dependencies**: Tasks 6-21 (all components migrated)

---

### 28. Run end-to-end tests

**Goal**: Verify E2E tests pass after migration.

**Actions**:
- Run `npm run test:e2e`
- Fix any failing tests
- Update selectors if needed for new class names

**Validation**:
- [x] All E2E tests pass
- [x] No test failures or errors

**Dependencies**: Tasks 6-21 (all components migrated)

---

### 29. Verify production build

**Goal**: Ensure production build succeeds and CSS is optimized.

**Actions**:
- Run `npm run build`
- Check build output size
- Verify CSS bundle size < 50KB
- Run `npm run preview` and test locally

**Validation**:
- [x] Build completes without errors
- [x] CSS bundle size reasonable (< 50KB)
- [x] Preview works correctly
- [x] No console errors in preview

**Dependencies**: Tasks 6-28 (all migration and testing complete)

---

### 30. Visual QA and polish

**Goal**: Final visual quality assurance and polish.

**Actions**:
- Review all pages and sections visually
- Check animations and transitions
- Verify spacing consistency
- Test all interactive elements
- Make any final adjustments

**Validation**:
- [x] Visual appearance meets or exceeds original design
- [x] All animations smooth
- [x] Spacing consistent throughout
- [x] No visual bugs or glitches

**Dependencies**: Task 29 (production build verified)

**User-visible**: Final polished Tailwind-based portfolio

---

## Summary

**Total Tasks**: 30
**Phases**: 3 (Setup, Migration, Verification)

**Parallelizable Tasks**:
- Task 20 (icons) can run parallel to other component migrations
- Tasks 23-24 (responsive/dark mode testing) can run in parallel
- Tasks 25-28 (type-check, lint, tests) can run in parallel

**Critical Path**:
1. Setup (Tasks 1-5) →
2. App/Nav migration (Tasks 6-8) →
3. Section migrations (Tasks 9-19) →
4. Cleanup and verification (Tasks 22-30)

**Estimated Duration**: 10-12 hours total