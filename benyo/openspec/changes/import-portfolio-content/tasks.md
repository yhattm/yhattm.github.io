# Tasks: Import Portfolio Content

## Phase 1: Foundation Setup

### Task 1.1: Create Language Store with Pinia
**Dependencies**: None
**Estimated effort**: 30 minutes
**Deliverable**: `src/stores/language.ts` with full Pinia store implementation

**Steps**:
1. Create `src/stores/language.ts`
2. Define `Language` type and `BilingualText` interface
3. Implement store with currentLang state
4. Add toggleLanguage, setLanguage, t() functions
5. Implement localStorage persistence (save/load)
6. Export store

**Validation**:
- [x] Store compiles without TypeScript errors
- [x] Can toggle between 'en' and 'zh'
- [x] localStorage saves preference
- [x] loadPreference() restores saved language

---

### Task 1.2: Create Scroll Animation Composable
**Dependencies**: None
**Estimated effort**: 30 minutes
**Deliverable**: `src/composables/useScrollAnimation.ts`

**Steps**:
1. Create `src/composables/` directory if not exists
2. Create `useScrollAnimation.ts`
3. Implement IntersectionObserver setup
4. Return `isVisible` ref and `targetRef`
5. Add cleanup on unmount

**Validation**:
- [x] Composable compiles without errors
- [x] Returns correct refs with proper types
- [x] Observer unobserves after trigger
- [x] Works with custom threshold and rootMargin

---

### Task 1.3: Set Up Global CSS Variables
**Dependencies**: None
**Estimated effort**: 20 minutes
**Deliverable**: `src/assets/variables.css` with design tokens

**Steps**:
1. Create `src/assets/variables.css`
2. Define color variables (--primary, --secondary, --dark, etc.)
3. Define spacing variables (--spacing-xs to --spacing-xl)
4. Define radius variables (--radius-sm, --radius-md, --radius-lg)
5. Define transition variables
6. Import in `src/main.ts`

**Validation**:
- [x] Variables file compiles
- [x] Variables accessible in all components
- [x] No CSS syntax errors

---

### Task 1.4: Update App.vue Root Structure
**Dependencies**: Task 1.1 (language store)
**Estimated effort**: 20 minutes
**Deliverable**: Updated `src/App.vue` with language initialization

**Steps**:
1. Import and initialize language store
2. Call `loadPreference()` on mount
3. Update template structure (remove placeholder content)
4. Add RouterView for view components
5. Remove old styles, keep minimal global styles

**Validation**:
- [x] App initializes language preference on load
- [x] RouterView renders correctly
- [x] No console errors

---

## Phase 2: Core Components (Parallel Development Possible)

### Task 2.1: Create LanguageToggle Component
**Dependencies**: Task 1.1
**Estimated effort**: 30 minutes
**Deliverable**: `src/components/LanguageToggle.vue`

**Steps**:
1. Create component file
2. Import language store
3. Implement toggle button with computed text
4. Add fixed positioning CSS
5. Add hover effects and transitions
6. Add ARIA label for accessibility

**Validation**:
- [x] Button displays "中文" when language is 'en'
- [x] Button displays "English" when language is 'zh'
- [x] Click toggles language correctly
- [x] Button stays fixed on scroll
- [x] Hover effect works

---

### Task 2.2: Create NavBar Component
**Dependencies**: Task 1.1
**Estimated effort**: 45 minutes
**Deliverable**: `src/components/NavBar.vue`

**Steps**:
1. Create component with sticky positioning
2. Add navigation links with bilingual text
3. Implement active link highlighting on scroll
4. Add smooth scroll on link click
5. Implement scroll-based opacity change
6. Style with backdrop filter blur

**Validation**:
- [x] Navbar sticks to top on scroll
- [x] Links translate based on language
- [x] Active link highlights current section
- [x] Smooth scroll works on click
- [x] Opacity increases after 100px scroll

---

### Task 2.3: Create CodeWindow Component
**Dependencies**: None (can work in parallel)
**Estimated effort**: 1 hour
**Deliverable**: `src/components/CodeWindow.vue`

**Steps**:
1. Create component with code display structure
2. Add MacOS-style window header (three dots)
3. Implement typing animation with ref
4. Use IntersectionObserver to trigger animation once
5. Implement 3D perspective effect on mouse move
6. Add mouse leave reset

**Validation**:
- [x] Code types out on hero section visible
- [x] Typing animation runs only once
- [x] 3D effect responds to mouse movement
- [x] Resets on mouse leave
- [x] Displays full Golang code snippet

---

### Task 2.4: Create StatCard Component
**Dependencies**: Task 1.1, Task 1.2
**Estimated effort**: 30 minutes
**Deliverable**: `src/components/StatCard.vue`

**Steps**:
1. Create component accepting number and label props
2. Use useScrollAnimation composable
3. Add fade-in and slide-up animation CSS
4. Implement hover scale effect
5. Make responsive

**Validation**:
- [x] Card displays number and label
- [x] Animates on scroll into view
- [x] Scales on hover
- [x] Label translates with language change

---

### Task 2.5: Create TimelineItem Component
**Dependencies**: Task 1.1, Task 1.2
**Estimated effort**: 45 minutes
**Deliverable**: `src/components/TimelineItem.vue`

**Steps**:
1. Create component with timeline structure
2. Accept props: date, company, role, description, tags
3. Use useScrollAnimation composable
4. Add timeline marker with gradient hover effect
5. Style tags as chips
6. Make responsive

**Validation**:
- [x] Displays all timeline information
- [x] Marker changes to gradient on hover
- [x] Animates on scroll
- [x] Bilingual text translates
- [x] Tags display correctly

---

### Task 2.6: Create TechItem Component
**Dependencies**: Task 1.2
**Estimated effort**: 45 minutes
**Deliverable**: `src/components/TechItem.vue`

**Steps**:
1. Create component with icon, name, proficiency props
2. Use useScrollAnimation composable
3. Implement progress bar with animated fill
4. Animate bar from 0% to target on scroll
5. Style with modern design

**Validation**:
- [x] Displays icon, name, and progress bar
- [x] Bar animates from 0% to proficiency value
- [x] Animation triggers on scroll
- [x] Smooth transition effect

---

### Task 2.7: Create TechCategory Component
**Dependencies**: Task 2.6
**Estimated effort**: 30 minutes
**Deliverable**: `src/components/TechCategory.vue`

**Steps**:
1. Create component with title and items props
2. Use language store for title translation
3. Render grid of TechItem components
4. Make grid responsive (1 column mobile, 2 columns desktop)

**Validation**:
- [x] Title translates correctly
- [x] Renders all TechItem children
- [x] Grid layout responsive
- [x] Proper spacing

---

## Phase 3: Section Views

### Task 3.1: Create HeroSection View
**Dependencies**: Task 2.3 (CodeWindow), Task 2.1 (LanguageToggle)
**Estimated effort**: 1 hour
**Deliverable**: `src/views/sections/HeroSection.vue`

**Steps**:
1. Create component with hero content structure
2. Add bilingual greeting, title, subtitle, tagline
3. Add CTA buttons (Get in Touch, LinkedIn)
4. Integrate CodeWindow component
5. Style with grid layout (responsive)
6. Add gradient background

**Validation**:
- [x] All text translates correctly
- [x] CodeWindow displays and animates
- [x] Buttons link correctly
- [x] Responsive layout works
- [x] Matches design from static HTML

---

### Task 3.2: Create AboutSection View
**Dependencies**: Task 2.4 (StatCard)
**Estimated effort**: 45 minutes
**Deliverable**: `src/views/sections/AboutSection.vue`

**Steps**:
1. Create component with section structure
2. Add bilingual section title
3. Add two paragraphs of about text (bilingual)
4. Render three StatCard components
5. Style with flex/grid layout
6. Make responsive

**Validation**:
- [x] Title and paragraphs translate
- [x] Three stat cards display correctly
- [x] Cards animate on scroll
- [x] Layout responsive
- [x] Matches design

---

### Task 3.3: Create ExperienceSection View
**Dependencies**: Task 2.5 (TimelineItem)
**Estimated effort**: 1 hour
**Deliverable**: `src/views/sections/ExperienceSection.vue`

**Steps**:
1. Create component with timeline structure
2. Define experience data array (3 positions)
3. Render TimelineItem for each position
4. Add vertical timeline line CSS
5. Make responsive (timeline adjusts on mobile)

**Validation**:
- [x] All three positions display
- [x] Timeline line connects markers
- [x] Content translates correctly
- [x] Responsive layout works
- [x] Matches design

---

### Task 3.4: Create TechStackSection View
**Dependencies**: Task 2.7 (TechCategory)
**Estimated effort**: 1 hour
**Deliverable**: `src/views/sections/TechStackSection.vue`

**Steps**:
1. Create component with section structure
2. Define 4 tech categories with items and proficiency levels
3. Render TechCategory for each category
4. Add grid layout for categories
5. Make responsive

**Validation**:
- [x] Four categories display correctly
- [x] All tech items show with correct proficiency
- [x] Bars animate on scroll
- [x] Category titles translate
- [x] Grid responsive

---

### Task 3.5: Create ContactSection View
**Dependencies**: Task 1.1 (language store)
**Estimated effort**: 30 minutes
**Deliverable**: `src/views/sections/ContactSection.vue`

**Steps**:
1. Create component with contact structure
2. Add bilingual title and description
3. Add LinkedIn and GitHub links
4. Add icons for links
5. Style link cards with hover effects
6. Add target="_blank" and security attributes

**Validation**:
- [x] Title and description translate
- [x] Links open in new tab
- [x] Hover effects work
- [x] Icons display correctly
- [x] Matches design

---

### Task 3.6: Create FooterSection View
**Dependencies**: Task 1.1 (language store)
**Estimated effort**: 20 minutes
**Deliverable**: `src/views/sections/FooterSection.vue`

**Steps**:
1. Create component with footer structure
2. Add bilingual copyright text
3. Style with centered text and padding
4. Add border top

**Validation**:
- [x] Text translates correctly
- [x] Centered and styled properly
- [x] Matches design

---

## Phase 4: Main View Integration

### Task 4.1: Create HomeView with All Sections
**Dependencies**: Tasks 3.1-3.6
**Estimated effort**: 30 minutes
**Deliverable**: `src/views/HomeView.vue`

**Steps**:
1. Import all section components
2. Render sections in order
3. Add IDs for navigation anchors
4. Remove old placeholder content
5. Ensure proper spacing between sections

**Validation**:
- [x] All sections render in correct order
- [x] Navigation links scroll to correct sections
- [x] IDs match navbar hrefs
- [x] Proper spacing maintained

---

### Task 4.2: Update Router Configuration
**Dependencies**: Task 4.1
**Estimated effort**: 15 minutes
**Deliverable**: `src/router/index.ts` updated

**Steps**:
1. Update route to use new HomeView
2. Remove AboutView route if not needed
3. Configure scroll behavior for smooth scrolling
4. Test route navigation

**Validation**:
- [x] Route loads HomeView correctly
- [x] No 404 errors
- [x] Scroll behavior works

---

## Phase 5: Animations & Interactivity

### Task 5.1: Add Particle Background Effect
**Dependencies**: None (can work in parallel)
**Estimated effort**: 45 minutes
**Deliverable**: `src/composables/useParticles.ts` and integration in App.vue

**Steps**:
1. Create useParticles composable
2. Implement particle creation with random positioning
3. Add CSS keyframe animation
4. Set up 3-second interval
5. Implement cleanup after 15 seconds
6. Integrate in App.vue

**Validation**:
- [ ] Particles spawn every 3 seconds
- [ ] Float animation works
- [ ] Particles remove after 15 seconds
- [ ] No memory leaks
- [ ] Performance remains smooth

---

### Task 5.2: Implement Navbar Scroll Effects
**Dependencies**: Task 2.2 (NavBar component exists)
**Estimated effort**: 30 minutes
**Deliverable**: Updated NavBar.vue with scroll effects

**Steps**:
1. Add scroll event listener
2. Track scroll position
3. Update background opacity and box-shadow based on scroll > 100px
4. Clean up listener on unmount

**Validation**:
- [ ] Navbar becomes more opaque after 100px scroll
- [ ] Box shadow appears
- [ ] Reverses when scrolling back to top
- [ ] No performance issues

---

### Task 5.3: Add Active Navigation Link Highlighting
**Dependencies**: Task 2.2
**Estimated effort**: 45 minutes
**Deliverable**: Updated NavBar.vue with active link logic

**Steps**:
1. Add scroll event listener
2. Get all section positions
3. Calculate which section is currently in view
4. Update active class on corresponding nav link
5. Add CSS for active state

**Validation**:
- [ ] Correct link highlights on scroll
- [ ] Only one link active at a time
- [ ] Smooth transitions between active states
- [ ] Works on page load

---

### Task 5.4: Add Reduced Motion Support
**Dependencies**: Task 1.3 (global CSS)
**Estimated effort**: 20 minutes
**Deliverable**: Updated `src/assets/variables.css` with reduced motion query

**Steps**:
1. Add `@media (prefers-reduced-motion: reduce)` block
2. Set animation-duration to 0.01ms
3. Set transition-duration to 0.01ms
4. Test with OS reduced motion setting

**Validation**:
- [ ] Animations disable when OS preference enabled
- [ ] Functionality remains intact
- [ ] No visual motion occurs
- [ ] Tested on multiple browsers

---

## Phase 6: Testing & Polish

### Task 6.1: Write Unit Tests for Language Store
**Dependencies**: Task 1.1
**Estimated effort**: 45 minutes
**Deliverable**: `src/stores/__tests__/language.spec.ts`

**Steps**:
1. Create test file
2. Test toggleLanguage function
3. Test setLanguage function
4. Test t() translation helper
5. Mock localStorage for persistence tests
6. Test loadPreference function

**Validation**:
- [ ] All store tests pass
- [ ] Coverage > 90% for language store
- [ ] localStorage mocked correctly

---

### Task 6.2: Write Component Tests for Key Components
**Dependencies**: Phase 2 components
**Estimated effort**: 2 hours
**Deliverable**: Test files for LanguageToggle, StatCard, TimelineItem, TechItem

**Steps**:
1. Test LanguageToggle button click and text
2. Test StatCard rendering and props
3. Test TimelineItem rendering and translations
4. Test TechItem progress bar animation trigger
5. Use Vue Test Utils for all tests

**Validation**:
- [ ] All component tests pass
- [ ] Coverage > 80% for tested components
- [ ] Tests verify translations
- [ ] Tests verify animations trigger

---

### Task 6.3: Write E2E Tests for Critical Workflows
**Dependencies**: Phase 4 (full integration)
**Estimated effort**: 1.5 hours
**Deliverable**: `e2e/portfolio.spec.ts`

**Steps**:
1. Test language toggle workflow (EN → ZH → verify content)
2. Test navigation link scrolling to sections
3. Test scroll animations trigger
4. Test responsive layouts on different viewports
5. Test all external links work

**Validation**:
- [ ] E2E tests pass on Chromium
- [ ] Tests cover critical user paths
- [ ] No flaky tests

---

### Task 6.4: Accessibility Audit
**Dependencies**: Phase 4
**Estimated effort**: 1 hour
**Deliverable**: Accessibility improvements and documentation

**Steps**:
1. Check heading hierarchy (h1 → h2 → h3)
2. Verify keyboard navigation works
3. Add ARIA labels where missing
4. Test with screen reader
5. Verify color contrast ratios
6. Document findings and fixes

**Validation**:
- [ ] Proper heading hierarchy
- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels present
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion support verified

---

### Task 6.5: Performance Audit
**Dependencies**: Phase 5 (all animations complete)
**Estimated effort**: 1 hour
**Deliverable**: Performance improvements and metrics

**Steps**:
1. Run Lighthouse audit
2. Check animation frame rates (should be 60fps)
3. Verify IntersectionObserver cleanup
4. Check bundle size
5. Test on slower devices/networks
6. Document performance metrics

**Validation**:
- [ ] Lighthouse score > 90
- [ ] Animations run at 60fps
- [ ] No memory leaks detected
- [ ] Bundle size reasonable (< 500KB)
- [ ] Fast load time on 3G

---

### Task 6.6: Cross-Browser Testing
**Dependencies**: Phase 4
**Estimated effort**: 45 minutes
**Deliverable**: Browser compatibility verification

**Steps**:
1. Test on Chrome (latest)
2. Test on Firefox (latest)
3. Test on Safari (latest)
4. Test on mobile browsers (iOS Safari, Chrome Android)
5. Document any issues and fixes

**Validation**:
- [ ] Works on all major browsers
- [ ] No visual regressions
- [ ] Animations work consistently
- [ ] No console errors

---

### Task 6.7: Final Build and Deployment Test
**Dependencies**: All previous tasks
**Estimated effort**: 30 minutes
**Deliverable**: Production build verification

**Steps**:
1. Run `npm run type-check` (ensure no TypeScript errors)
2. Run `npm run lint` (ensure no linting errors)
3. Run `npm run build` (ensure build succeeds)
4. Run `npm run preview` (test production build locally)
5. Verify all functionality in production build

**Validation**:
- [ ] Type check passes
- [ ] Lint passes
- [ ] Build succeeds without errors
- [ ] Preview works correctly
- [ ] Ready for deployment

---

## Summary

**Total Estimated Effort**: ~18-20 hours

**Parallelizable Tasks**:
- Phase 2 (all component tasks can run in parallel)
- Task 5.1 (particles) can run parallel to other Phase 5 tasks
- Phase 6 tests can run parallel once dependencies complete

**Critical Path**:
1. Phase 1 (foundation) → Phase 2 (components) → Phase 3 (sections) → Phase 4 (integration) → Phase 5 (animations) → Phase 6 (testing)

**Risk Areas**:
- Animation performance (mitigated by GPU-accelerated CSS)
- TypeScript complexity (mitigated by clear interfaces)
- Testing coverage (allocate sufficient time for Phase 6)