# Apply Tailwind CSS

## Summary

Migrate the Ben portfolio project from custom CSS to Tailwind CSS utility-first framework. This change will replace existing custom CSS files and component styles with Tailwind utility classes, providing a more maintainable and scalable styling approach.

## Motivation

**Current State**:
- Custom CSS files (`base.css`, `main.css`, `variables.css`) with manual maintenance
- Scoped component styles scattered across Vue files
- Custom color palette and spacing system
- Manual responsive design breakpoints

**Desired State**:
- Tailwind CSS utility-first styling system
- Consistent design tokens through Tailwind's default theme
- Simplified responsive design with Tailwind's breakpoint utilities
- Enhanced typography, forms, and container query support through official plugins

**Benefits**:
- **Developer Experience**: Faster development with utility classes, no context switching between HTML and CSS files
- **Maintainability**: Reduced CSS file count and clearer component styling
- **Consistency**: Tailwind's default design system enforces consistent spacing, colors, and typography
- **Performance**: PurgeCSS integration removes unused styles in production builds
- **Ecosystem**: Access to Tailwind's extensive plugin ecosystem and community resources

## Scope

### In Scope
- Install Tailwind CSS and required plugins (typography, forms, container-queries)
- Configure Tailwind with PostCSS and Vite integration
- Remove existing custom CSS files (`base.css`, `main.css`, `variables.css`)
- Migrate all Vue component styles to Tailwind utility classes
- Update all component templates to use Tailwind classes
- Configure Tailwind content paths for proper purging
- Update development and build processes to support Tailwind

### Out of Scope
- Customizing Tailwind theme to match existing design tokens (using default theme per user preference)
- Adding new UI components or features
- Changing component architecture or logic
- Performance optimization beyond Tailwind's built-in features

## Impact Assessment

### Components Affected
- All Vue components with scoped styles (22+ components)
- Main application entry point (`App.vue`)
- All section components (`HeroSection.vue`, `AboutSection.vue`, etc.)
- All UI components (`NavBar.vue`, `CodeWindow.vue`, `TechItem.vue`, etc.)

### Files Modified
- Remove: `src/assets/base.css`, `src/assets/main.css`, `src/assets/variables.css`
- Modify: All `.vue` files with `<style>` blocks
- Add: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/main.ts` (remove CSS imports, add Tailwind CSS import)
- Modify: `package.json` (add Tailwind dependencies)

### Breaking Changes
- **Visual Appearance**: UI will adopt Tailwind's default design system (colors, spacing, typography)
  - Current custom color palette (`--vt-c-*`, `--color-*`) will be replaced
  - Font sizes and spacing may differ from current implementation
  - Dark mode will use Tailwind's `dark:` variant system instead of CSS custom properties
- **CSS Class Names**: All custom CSS classes will be removed
- **Styling Approach**: No more scoped CSS or CSS modules, only utility classes

### Migration Risk
- **Medium Risk**: Full CSS replacement requires careful migration of all components
- **Mitigation**: Systematic component-by-component migration with visual verification
- **Rollback Plan**: Git commit history allows reverting if issues arise

## Dependencies

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+ (already satisfied)
- Vite build tool (already installed)
- PostCSS support (built into Vite)

### New Dependencies
- `tailwindcss` ^3.4.0 - Core Tailwind CSS framework
- `@tailwindcss/typography` ^0.5.0 - Typography plugin for prose content
- `@tailwindcss/forms` ^0.5.0 - Better form element styling
- `@tailwindcss/container-queries` ^0.1.0 - Container query support
- `autoprefixer` ^10.4.0 - PostCSS plugin for vendor prefixes

### Existing Dependencies (No Changes Required)
- Vue 3, TypeScript, Vite, ESLint, Prettier all compatible with Tailwind

## Timeline

### Estimated Effort
- **Configuration & Setup**: 1 hour (install packages, configure files)
- **Component Migration**: 6-8 hours (migrate 22+ components systematically)
- **Testing & Verification**: 2-3 hours (visual QA, responsive testing)
- **Total**: ~10-12 hours

### Phases
1. **Phase 1: Setup** (Dependencies, configuration files)
2. **Phase 2: Migration** (Component-by-component CSS replacement)
3. **Phase 3: Verification** (Visual testing, cleanup)

## Alternatives Considered

### Alternative 1: Keep Custom CSS
- **Pros**: No migration effort, existing design preserved
- **Cons**: Manual maintenance, no utility-first benefits, slower development
- **Decision**: Rejected - User explicitly requested Tailwind CSS

### Alternative 2: Hybrid Approach
- **Pros**: Gradual migration, lower risk
- **Cons**: Mixed styling paradigms, increased complexity, longer timeline
- **Decision**: Rejected - User chose full migration for clean approach

### Alternative 3: Other CSS Frameworks (UnoCSS, WindiCSS)
- **Pros**: Similar utility-first approach, potentially faster build times
- **Cons**: Smaller ecosystems, less community support
- **Decision**: Rejected - Tailwind has best ecosystem and documentation

## Success Criteria

### Functional Requirements
- [ ] All components render correctly with Tailwind styles
- [ ] Responsive design works across all breakpoints (mobile, tablet, desktop)
- [ ] Dark mode functionality preserved using Tailwind's dark variant
- [ ] All interactive states (hover, focus, active) work properly
- [ ] Build process completes successfully with Tailwind integration

### Technical Requirements
- [ ] No custom CSS files remaining in `src/assets/`
- [ ] All component `<style>` blocks removed (except for rare edge cases)
- [ ] Tailwind content purging configured correctly
- [ ] Production build size remains reasonable (< 50KB CSS after purge)
- [ ] No console errors or warnings related to styling

### Quality Requirements
- [ ] Visual appearance matches or improves upon original design
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Unit tests pass (`npm run test:unit`)
- [ ] E2E tests pass (`npm run test:e2e`)

## Related Changes

This change is standalone but may inform future changes:
- Future typography improvements could leverage `@tailwindcss/typography`
- Future form additions would benefit from `@tailwindcss/forms`
- Container queries support enables advanced responsive patterns

## Notes

- User preference: Full migration with Tailwind default theme (no custom theme configuration)
- Plugins selected: Typography, Forms, Container Queries
- Visual appearance will change to match Tailwind's design system
- This is a significant refactoring but provides long-term maintainability benefits