# Tasks: Integrate shadcn-vue Component Library

## Overview
This file contains the ordered list of implementation tasks for integrating shadcn-vue into the Ben portfolio website. Tasks are organized in phases with clear validation steps.

## Phase 1: Setup and Configuration

### Task 1.1: Measure baseline bundle size
**Description**: Capture current build metrics before adding shadcn-vue to measure impact.

**Steps**:
1. Run `npm run build` to generate production build
2. Record bundle size from build output (total JS, CSS sizes)
3. Note file sizes in `dist/assets/` directory
4. Save metrics for comparison later

**Validation**:
- ✅ Baseline metrics recorded

**Estimated Time**: 10 minutes

---

### Task 1.2: Initialize shadcn-vue
**Description**: Run the shadcn-vue CLI initialization to set up configuration and utilities.

**Steps**:
1. Run `npx shadcn-vue@latest init`
2. When prompted, select **"Neutral"** as base color
3. Review generated `components.json` file
4. Verify `src/lib/utils.ts` is created with `cn()` function
5. Check `package.json` for new dependencies:
   - `clsx`
   - `tailwind-merge`
   - `class-variance-authority`
   - Reka UI packages (as needed)

**Validation**:
- ✅ `components.json` exists at project root
- ✅ `src/lib/utils.ts` exists and exports `cn()` function
- ✅ Dependencies installed in `package.json`
- ✅ No errors during initialization

**Estimated Time**: 15 minutes

---

### Task 1.3: Verify Tailwind CSS theme configuration
**Description**: Ensure CSS variables for shadcn-vue theme are added to Tailwind CSS.

**Steps**:
1. Open `src/assets/tailwind.css`
2. Verify `@layer base` block exists with `:root` CSS variables
3. Verify `.dark` class exists with dark mode CSS variables
4. Check for color tokens: `--background`, `--foreground`, `--primary`, `--card`, etc.
5. Optionally review `tailwind.config.js` for theme extensions (may be added by CLI)

**Validation**:
- ✅ CSS variables exist in `tailwind.css`
- ✅ Both light (`:root`) and dark (`.dark`) modes defined
- ✅ All required color tokens present

**Estimated Time**: 10 minutes

---

### Task 1.4: Verify TypeScript configuration
**Description**: Confirm TypeScript path aliases are correctly configured for component imports.

**Steps**:
1. Open `tsconfig.app.json`
2. Verify `paths` includes `"@/*": ["./src/*"]`
3. Run `npm run type-check` to ensure no TS errors
4. Test import resolution in IDE (e.g., hover over `@/lib/utils` in a file)

**Validation**:
- ✅ `tsconfig.app.json` has correct path alias
- ✅ `npm run type-check` passes
- ✅ IDE resolves `@/*` imports correctly

**Estimated Time**: 5 minutes

---

### Task 1.5: Verify development build works
**Description**: Test that development server starts successfully after initialization.

**Steps**:
1. Run `npm run dev`
2. Open browser to dev server (typically `http://localhost:5173/ben/`)
3. Verify site loads without errors
4. Check browser console for any errors or warnings
5. Stop dev server

**Validation**:
- ✅ Dev server starts without errors
- ✅ Site renders correctly in browser
- ✅ No console errors related to shadcn-vue setup

**Estimated Time**: 10 minutes

---

## Phase 2: Component Installation

### Task 2.1: Install core form components
**Description**: Add essential form and input components.

**Steps**:
1. Run `npx shadcn-vue@latest add button`
2. Run `npx shadcn-vue@latest add input`
3. Run `npx shadcn-vue@latest add textarea`
4. Run `npx shadcn-vue@latest add label`
5. Run `npx shadcn-vue@latest add checkbox`
6. Run `npx shadcn-vue@latest add radio-group`
7. Run `npx shadcn-vue@latest add switch`
8. Run `npx shadcn-vue@latest add select`
9. Run `npx shadcn-vue@latest add slider`

**Validation**:
- ✅ Components exist in `src/components/ui/button/`, `src/components/ui/input/`, etc.
- ✅ Each component directory has `.vue` files
- ✅ No errors during installation

**Estimated Time**: 15 minutes

---

### Task 2.2: Install layout and card components
**Description**: Add card and layout utility components.

**Steps**:
1. Run `npx shadcn-vue@latest add card`
2. Run `npx shadcn-vue@latest add separator`
3. Run `npx shadcn-vue@latest add aspect-ratio`
4. Run `npx shadcn-vue@latest add scroll-area`

**Validation**:
- ✅ Components exist in `src/components/ui/card/`, `src/components/ui/separator/`, etc.
- ✅ Card includes sub-components (CardHeader, CardContent, CardFooter, etc.)

**Estimated Time**: 10 minutes

---

### Task 2.3: Install overlay and dialog components
**Description**: Add modal, popover, and overlay components.

**Steps**:
1. Run `npx shadcn-vue@latest add dialog`
2. Run `npx shadcn-vue@latest add alert-dialog`
3. Run `npx shadcn-vue@latest add popover`
4. Run `npx shadcn-vue@latest add tooltip`
5. Optionally: `npx shadcn-vue@latest add sheet` (if available)

**Validation**:
- ✅ Components exist in respective `src/components/ui/` subdirectories
- ✅ Dialog and alert-dialog include sub-components (trigger, content, header, etc.)

**Estimated Time**: 10 minutes

---

### Task 2.4: Install feedback and display components
**Description**: Add alert, badge, avatar, and loading components.

**Steps**:
1. Run `npx shadcn-vue@latest add alert`
2. Run `npx shadcn-vue@latest add badge`
3. Run `npx shadcn-vue@latest add avatar`
4. Run `npx shadcn-vue@latest add skeleton`
5. Run `npx shadcn-vue@latest add progress`

**Validation**:
- ✅ Components exist in `src/components/ui/badge/`, `src/components/ui/avatar/`, etc.

**Estimated Time**: 10 minutes

---

### Task 2.5: Install navigation components
**Description**: Add dropdown menu, tabs, accordion, and navigation components.

**Steps**:
1. Run `npx shadcn-vue@latest add dropdown-menu`
2. Run `npx shadcn-vue@latest add tabs`
3. Run `npx shadcn-vue@latest add accordion`
4. Run `npx shadcn-vue@latest add collapsible`
5. Optionally: `npx shadcn-vue@latest add navigation-menu` (if available)

**Validation**:
- ✅ Components exist in respective `src/components/ui/` subdirectories
- ✅ Complex components (dropdown-menu, tabs) include sub-components

**Estimated Time**: 10 minutes

---

### Task 2.6: Verify all components installed
**Description**: Confirm all components are present and importable.

**Steps**:
1. List all directories in `src/components/ui/`
2. Count component directories (should have 20-25+)
3. Create a test file to import all components (optional):
   ```vue
   <script setup lang="ts">
   import { Button } from '@/components/ui/button'
   import { Card } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   // ... import others
   </script>
   ```
4. Run `npm run type-check` to verify all imports resolve
5. Delete test file

**Validation**:
- ✅ 20+ component directories exist
- ✅ TypeScript recognizes all component imports
- ✅ No type errors

**Estimated Time**: 15 minutes

---

## Phase 3: Component Migration

### Task 3.1: Migrate StatCard component
**Description**: Refactor `StatCard.vue` to use shadcn-vue Card component.

**Steps**:
1. Open `src/components/StatCard.vue`
2. Add imports:
   ```typescript
   import { Card, CardContent } from '@/components/ui/card'
   ```
3. Replace root `<div>` with `<Card>`
4. Wrap content with `<CardContent class="pt-6">`
5. Keep existing Tailwind classes for value and label styling
6. Add `hover:shadow-xl transition-shadow` to Card if not present
7. Test component in HomeView or relevant view

**Validation**:
- ✅ Component renders correctly
- ✅ Visual appearance matches or improves original
- ✅ Dark mode works correctly
- ✅ No TypeScript errors

**Estimated Time**: 30 minutes

---

### Task 3.2: Migrate TechCategory component
**Description**: Refactor `TechCategory.vue` to use shadcn-vue Card with header and content.

**Steps**:
1. Open `src/components/TechCategory.vue`
2. Add imports:
   ```typescript
   import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
   ```
3. Replace component structure with:
   ```vue
   <Card>
     <CardHeader>
       <CardTitle>{{ category }}</CardTitle>
     </CardHeader>
     <CardContent>
       <slot />
     </CardContent>
   </Card>
   ```
4. Adjust classes as needed for styling
5. Test component in TechStackSection

**Validation**:
- ✅ Component renders correctly
- ✅ Slotted content (tech items) displays properly
- ✅ Category title is visible and styled
- ✅ No TypeScript errors

**Estimated Time**: 30 minutes

---

### Task 3.3: Migrate TechItem component
**Description**: Simplify `TechItem.vue` to use shadcn-vue Badge or mini Card.

**Steps**:
1. Open `src/components/TechItem.vue`
2. Decide on approach: Badge (simpler) or Card (more structured)
3. If using Badge:
   - Import `Badge` from `@/components/ui/badge`
   - Replace root element with `<Badge>`
   - Use `variant` prop if needed (default, secondary, outline)
4. If using Card:
   - Import `Card` from `@/components/ui/card`
   - Use Card with compact padding
5. Maintain existing props and functionality
6. Test component in TechStackSection

**Validation**:
- ✅ Component renders correctly
- ✅ Styling is appropriate (badge or mini card)
- ✅ Works within TechCategory or grid layout
- ✅ No TypeScript errors

**Estimated Time**: 20 minutes

---

### Task 3.4: Migrate TimelineItem component
**Description**: Refactor `TimelineItem.vue` to use shadcn-vue Card with timeline positioning.

**Steps**:
1. Open `src/components/TimelineItem.vue`
2. Add imports:
   ```typescript
   import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
   ```
3. Replace component structure:
   ```vue
   <Card>
     <CardHeader>
       <CardTitle>{{ title }}</CardTitle>
       <CardDescription>{{ date }}</CardDescription>
     </CardHeader>
     <CardContent v-if="$slots.default">
       <slot />
     </CardContent>
   </Card>
   ```
4. Maintain timeline indicator (dot/line) with custom positioning classes
5. Ensure responsive layout works (mobile vs desktop timeline)
6. Test component in ExperienceSection

**Validation**:
- ✅ Component renders correctly in timeline
- ✅ Timeline indicator is positioned correctly
- ✅ Responsive behavior works
- ✅ Dark mode works
- ✅ No TypeScript errors

**Estimated Time**: 45 minutes

---

### Task 3.5: Migrate CodeWindow component
**Description**: Refactor `CodeWindow.vue` to use shadcn-vue Card with custom code styling.

**Steps**:
1. Open `src/components/CodeWindow.vue`
2. Add imports:
   ```typescript
   import { Card, CardContent } from '@/components/ui/card'
   // Optionally: CardHeader, CardTitle for window controls
   ```
3. Replace root `<div>` with:
   ```vue
   <Card class="bg-gray-900 dark:bg-gray-950 border-gray-800">
     <CardContent class="p-6 font-mono text-sm overflow-x-auto">
       <slot />
     </CardContent>
   </Card>
   ```
4. Optionally add CardHeader with window controls (close/minimize/maximize dots)
5. Maintain code formatting and scrolling behavior
6. Test component in HeroSection or relevant view

**Validation**:
- ✅ Component renders correctly
- ✅ Code content is monospaced and scrollable
- ✅ Dark background is appropriate
- ✅ Optional window controls work (if added)
- ✅ No TypeScript errors

**Estimated Time**: 30 minutes

---

### Task 3.6: Visual regression testing for migrated components
**Description**: Manually test all migrated components across different modes and viewports.

**Steps**:
1. Run `npm run dev`
2. Navigate to pages using migrated components (HomeView, AboutView, etc.)
3. Test each component in:
   - Light mode (default)
   - Dark mode (change system preference or use browser dev tools)
   - Mobile viewport (e.g., 375px)
   - Tablet viewport (e.g., 768px)
   - Desktop viewport (e.g., 1280px+)
4. Check hover states, focus states (use keyboard navigation)
5. Note any visual issues or regressions

**Validation**:
- ✅ All migrated components render correctly in light mode
- ✅ All migrated components render correctly in dark mode
- ✅ Components are responsive across viewport sizes
- ✅ Hover and focus states work as expected
- ✅ No visual regressions compared to original components

**Estimated Time**: 45 minutes

---

## Phase 4: Testing and Validation

### Task 4.1: Run TypeScript type-checking
**Description**: Verify all TypeScript types are correct after integration.

**Steps**:
1. Run `npm run type-check`
2. Review any type errors
3. Fix errors related to component imports, props, or usage
4. Re-run until clean

**Validation**:
- ✅ `npm run type-check` passes with no errors

**Estimated Time**: 15 minutes

---

### Task 4.2: Run unit tests
**Description**: Ensure existing unit tests still pass after component migrations.

**Steps**:
1. Run `npm run test:unit`
2. Review any failing tests
3. Update tests if component structure changed (e.g., new wrapper elements from Card)
4. Ensure tests verify behavior, not implementation details
5. Re-run until all tests pass

**Validation**:
- ✅ All unit tests pass
- ✅ Test updates (if any) are minimal and appropriate

**Estimated Time**: 30 minutes

---

### Task 4.3: Run production build
**Description**: Verify production build succeeds with shadcn-vue components.

**Steps**:
1. Run `npm run build`
2. Verify build completes without errors
3. Review build output for bundle sizes
4. Compare bundle sizes to baseline (from Task 1.1)
5. Note any significant size increases

**Validation**:
- ✅ `npm run build` completes successfully
- ✅ Bundle size increase is reasonable (< 100KB uncompressed, < 30KB gzipped)
- ✅ No build warnings or errors

**Estimated Time**: 15 minutes

---

### Task 4.4: Test production build locally
**Description**: Preview production build to ensure components work in optimized bundle.

**Steps**:
1. Run `npm run preview`
2. Open browser to preview server
3. Navigate through all pages
4. Test migrated components functionality
5. Check browser console for errors
6. Verify dark mode toggle works (system preference)
7. Stop preview server

**Validation**:
- ✅ Production build runs without errors
- ✅ All components render correctly
- ✅ Interactions work (clicks, hovers, navigation)
- ✅ No console errors

**Estimated Time**: 20 minutes

---

### Task 4.5: Accessibility testing
**Description**: Test accessibility of migrated components using keyboard and screen reader.

**Steps**:
1. Test keyboard navigation:
   - Tab through interactive elements (buttons, links, etc.)
   - Verify focus indicators are visible
   - Test Enter/Space on buttons
   - Test Escape on dialogs/popovers (if used)
2. Test screen reader (optional, if available):
   - Use NVDA (Windows), VoiceOver (Mac), or similar
   - Verify component labels are announced
   - Verify ARIA roles and descriptions
3. Check color contrast:
   - Use browser dev tools or online contrast checker
   - Verify text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large)

**Validation**:
- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators are visible
- ✅ Screen reader announces components correctly (if tested)
- ✅ Color contrast meets WCAG AA standards

**Estimated Time**: 30 minutes

---

## Phase 5: Documentation

### Task 5.1: Update project.md with shadcn-vue information
**Description**: Document shadcn-vue integration in project context file.

**Steps**:
1. Open `openspec/project.md`
2. Add shadcn-vue to "UI & Styling" section:
   ```markdown
   - **shadcn-vue** (CLI tool) - Accessible Vue component library built on Reka UI
   - **Reka UI** - Headless accessible UI primitives
   ```
3. Add dependencies section for shadcn-vue utilities:
   ```markdown
   - `clsx` - Conditional class names utility
   - `tailwind-merge` - Tailwind class merging utility
   - `class-variance-authority` - Component variant management
   ```
4. Update "Component Guidelines" section:
   - Mention shadcn-vue components in `/src/components/ui/`
   - Document import patterns
   - Add usage examples
5. Add "shadcn-vue Integration" section under "Architecture Patterns":
   - Copy-paste component model
   - Customization with Tailwind classes
   - Composition patterns (Card sub-components, etc.)
   - Link to shadcn-vue docs

**Validation**:
- ✅ `project.md` mentions shadcn-vue in appropriate sections
- ✅ Component directory structure is documented
- ✅ Usage examples are provided

**Estimated Time**: 30 minutes

---

### Task 5.2: Add component usage examples
**Description**: Create inline documentation or examples for common shadcn-vue usage patterns.

**Steps**:
1. In `project.md` or create separate `docs/shadcn-vue-examples.md` (optional):
2. Add examples for:
   - Importing components: `import { Button } from '@/components/ui/button'`
   - Basic Button usage with variants
   - Card composition (CardHeader, CardTitle, CardContent)
   - Using cn() utility for custom classes
   - Badge variants
3. Add migration notes:
   - How StatCard was migrated (before/after)
   - How to add custom classes to shadcn-vue components
   - When to use shadcn-vue vs custom components

**Validation**:
- ✅ Usage examples are clear and correct
- ✅ Examples cover common patterns used in project

**Estimated Time**: 20 minutes

---

### Task 5.3: Document component customization patterns
**Description**: Explain how to customize shadcn-vue components in the project.

**Steps**:
1. In `project.md`, add section on "Customizing shadcn-vue Components"
2. Document patterns:
   - Adding custom Tailwind classes via `class` prop
   - Using component variants (e.g., Button variant="outline")
   - Composing multiple shadcn-vue components
   - When to extend/wrap shadcn-vue components
3. Add notes on the `cn()` utility and how it merges classes
4. Document dark mode handling (automatic via Tailwind `dark:` variants)

**Validation**:
- ✅ Customization patterns are documented
- ✅ Examples are relevant to project needs

**Estimated Time**: 15 minutes

---

## Phase 6: Finalization

### Task 6.1: Clean up temporary files and code
**Description**: Remove any test files, commented-out code, or temporary changes.

**Steps**:
1. Search for temporary test files or comments
2. Remove any unused imports
3. Remove old component code if migration is complete (e.g., old StatCard implementation)
4. Run linter: `npm run lint` to auto-fix code style
5. Run formatter: `npm run format` to format code

**Validation**:
- ✅ No temporary files remain
- ✅ Code is clean and linted
- ✅ No unused imports or commented code

**Estimated Time**: 15 minutes

---

### Task 6.2: Final build verification
**Description**: One last check that everything builds and runs correctly.

**Steps**:
1. Run `npm run type-check` - should pass
2. Run `npm run lint` - should pass
3. Run `npm run test:unit` - should pass
4. Run `npm run build` - should succeed
5. Run `npm run preview` - should work correctly
6. Manually test key user flows in preview build

**Validation**:
- ✅ All checks pass
- ✅ Build succeeds
- ✅ Preview works correctly

**Estimated Time**: 20 minutes

---

### Task 6.3: Git commit and review
**Description**: Commit changes with clear message for review.

**Steps**:
1. Stage all changes: `git add .`
2. Review staged changes: `git status` and `git diff --cached`
3. Commit with conventional commit message:
   ```
   feat(components): integrate shadcn-vue component library

   - Initialize shadcn-vue with Neutral theme
   - Install 25+ components (Button, Card, Badge, Dialog, etc.)
   - Migrate StatCard, TechCategory, TechItem, TimelineItem, CodeWindow to use shadcn-vue
   - Update project.md with shadcn-vue documentation
   - Verify accessibility, TypeScript, and build integrity

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
4. Optionally create feature branch if not already on one

**Validation**:
- ✅ Changes are committed
- ✅ Commit message is clear and descriptive

**Estimated Time**: 10 minutes

---

## Summary

**Total Estimated Time**: ~7-9 hours

**Phases**:
1. Setup and Configuration: ~1 hour
2. Component Installation: ~1 hour
3. Component Migration: ~2.5 hours
4. Testing and Validation: ~2 hours
5. Documentation: ~1 hour
6. Finalization: ~45 minutes

**Key Milestones**:
- ✅ shadcn-vue initialized and configured
- ✅ Comprehensive component set installed (25+ components)
- ✅ 5 custom components migrated (StatCard, TechCategory, TechItem, TimelineItem, CodeWindow)
- ✅ All tests passing (type-check, unit tests, build)
- ✅ Accessibility verified
- ✅ Documentation updated
- ✅ Changes committed

**Dependencies**:
- Tasks in Phase 2 can be parallelized (component installation is independent)
- Tasks in Phase 3 must be sequential (migrate one component at a time)
- Phase 4 depends on Phase 3 completion
- Phase 5 can overlap with Phase 4 (write docs while testing)

**Parallelizable Work**:
- Component installation (Task 2.1-2.5) can be done in one batch
- Documentation (Phase 5) can start during testing (Phase 4)

**Risk Areas**:
- Task 3.4 (TimelineItem migration) - Medium complexity due to custom positioning
- Task 3.5 (CodeWindow migration) - Medium complexity due to custom styling
- Task 4.2 (Unit tests) - May require test updates if component structure changed significantly