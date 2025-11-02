# Proposal: Integrate shadcn-vue Component Library

## Overview

Integrate shadcn-vue, a Vue port of shadcn-ui, to provide a comprehensive set of accessible, customizable, and well-designed UI components for the Ben portfolio website. This integration will enhance UI consistency, improve development velocity, and provide production-ready components built on headless UI primitives.

將 shadcn-vue（shadcn-ui 的 Vue 版本）整合到 Ben 的作品集網站中，提供一套完整的無障礙、可自訂且設計精良的 UI 元件。此整合將提升 UI 一致性、加快開發速度，並提供基於 headless UI 原語的生產就緒元件。

## Motivation

### Current State
- Project uses Tailwind CSS v4 for utility-first styling
- Custom components built with manual Tailwind classes
- Components like StatCard, CodeWindow, TimelineItem use custom styling
- No standardized component library or design system
- Limited accessibility features in custom components

### Problems
1. **Inconsistent UI patterns**: Each component implements its own styling patterns, leading to visual inconsistencies
2. **Accessibility gaps**: Custom components may not follow WCAG guidelines or ARIA best practices
3. **Development overhead**: Building and maintaining custom components requires significant effort
4. **Limited component coverage**: Missing common UI patterns (dialogs, dropdowns, tooltips, etc.)
5. **No design token system**: Hard-coded colors and styles throughout components

### Proposed Solution
Integrate shadcn-vue to provide:
- **Production-ready components**: Button, Card, Badge, Dialog, Dropdown, Input, Select, Tooltip, and 20+ more
- **Accessibility by default**: Built on Reka UI (headless accessible primitives)
- **Tailwind CSS integration**: Components use utility classes, maintaining existing styling approach
- **Type-safe**: Full TypeScript support with proper type definitions
- **Customizable**: Copy-paste components into project for full control
- **Composable**: Follows Vue 3 Composition API patterns

## Goals

### Primary Goals
1. **Install and configure shadcn-vue CLI** with Tailwind v4 compatibility
2. **Add comprehensive component set** (25+ components) for current and future needs
3. **Migrate existing custom components** to use shadcn-vue equivalents where appropriate
4. **Maintain visual consistency** with existing blue-themed design
5. **Ensure accessibility** through ARIA-compliant components

### Secondary Goals
1. **Document component usage** patterns and examples
2. **Set up component organization** in `/src/components/ui/` directory
3. **Configure theme** using default neutral color scheme
4. **Validate compatibility** with existing Tailwind plugins and config
5. **Update project conventions** to include shadcn-vue patterns

### Non-Goals
1. Custom theme creation (using default theme)
2. Migration of all components in one pass (iterative approach)
3. Removing Tailwind CSS or utility-first approach
4. Changing routing or state management patterns
5. Adding new build tools or bundlers

## Scope

### In Scope
- shadcn-vue CLI installation and initialization
- TypeScript path alias configuration for components
- Installation of comprehensive component set (Button, Card, Badge, Dialog, Dropdown Menu, Select, Input, Textarea, Label, Checkbox, Radio Group, Switch, Slider, Tooltip, Popover, Alert, Alert Dialog, Separator, Avatar, Skeleton, Progress, Tabs, Accordion, Collapsible, and more)
- Migration of StatCard → Card + Badge components
- Migration of CodeWindow → Card + custom code styling
- Migration of TimelineItem → Card + Timeline pattern
- Documentation updates in project.md
- Component usage examples

### Out of Scope
- Creating custom shadcn-vue themes
- Building new pages or views
- Changing existing routing structure
- Modifying state management (Pinia stores)
- Updating i18n translations (unless component labels need translation)
- E2E test updates (handled in separate effort)

## Success Criteria

1. **Installation verified**: `npx shadcn-vue@latest init` completes successfully
2. **Components accessible**: All shadcn-vue components importable via `@/components/ui/*`
3. **TypeScript working**: No type errors when importing and using components
4. **Migration complete**: At least 3 existing custom components successfully migrated
5. **Visual consistency**: Migrated components maintain or improve existing design
6. **Accessibility improved**: Components pass basic accessibility checks (keyboard navigation, ARIA attributes)
7. **Build succeeds**: `npm run build` and `npm run type-check` pass without errors
8. **Documentation updated**: project.md reflects new component patterns

## Timeline Estimate

- **Setup and Configuration**: 1-2 hours
- **Component Installation**: 1 hour
- **Component Migration**: 3-4 hours
- **Testing and Validation**: 1-2 hours
- **Documentation**: 1 hour

**Total**: ~7-10 hours of development work

## Dependencies

### Technical Dependencies
- Node.js 20.19.0+ or 22.12.0+ (already satisfied)
- Tailwind CSS v4.1.16 (already installed)
- TypeScript 5.9.0+ (already installed)
- Vite v7.1.11+ (already installed)
- Vue 3.5.22+ (already installed)

### New Dependencies
- `shadcn-vue` CLI (dev dependency)
- `reka-ui` (Reka UI headless components)
- `class-variance-authority` (for component variants)
- `clsx` (for conditional class names)
- `tailwind-merge` (for merging Tailwind classes)
- `radix-vue` icons or `lucide-vue-next` (for icons, if needed)

### Related Specs
- `styling-system` - Tailwind CSS configuration and utilities
- `component-migration` - Component migration patterns and guidelines

## Risks and Mitigations

### Risk 1: Tailwind v4 Compatibility
**Risk**: shadcn-vue may have issues with Tailwind CSS v4 (newer major version)
**Mitigation**:
- shadcn-vue documentation confirms Tailwind v4 support
- Use latest `shadcn-vue` CLI which supports both v3 and v4
- Test component rendering after installation
**Fallback**: Downgrade to Tailwind v3 if critical issues arise

### Risk 2: Component Migration Complexity
**Risk**: Migrating existing components may break layouts or functionality
**Mitigation**:
- Migrate components incrementally, one at a time
- Keep original components until migration is validated
- Use git branches for component migration work
- Test each migrated component thoroughly
**Fallback**: Keep custom components if migration proves too complex

### Risk 3: TypeScript Configuration Conflicts
**Risk**: Path alias configuration might conflict with existing setup
**Mitigation**:
- Project already uses `@/*` alias pointing to `./src/*`
- shadcn-vue uses same convention, should work out of the box
- Verify imports after initialization
**Fallback**: Manual path alias adjustment in tsconfig if needed

### Risk 4: Increased Bundle Size
**Risk**: Adding 25+ components may significantly increase bundle size
**Mitigation**:
- shadcn-vue uses copy-paste approach, only used components are bundled
- Vite tree-shaking will remove unused code
- Monitor build output size after integration
**Fallback**: Remove unused components if bundle size becomes problematic

### Risk 5: Visual Style Conflicts
**Risk**: shadcn-vue default theme may clash with existing blue-themed design
**Mitigation**:
- Use default neutral theme which is generally compatible
- Can override component styles with additional Tailwind classes
- Component props allow customization
**Fallback**: Implement custom theme configuration if needed (out of scope, but possible)

## Alternatives Considered

### Alternative 1: Continue with Custom Components
**Pros**: Full control, no new dependencies, familiar approach
**Cons**: High maintenance burden, no accessibility guarantees, limited component coverage
**Decision**: Rejected - doesn't scale well for complex UI needs

### Alternative 2: Use Headless UI (Radix Vue / Reka UI) Directly
**Pros**: More control, lighter dependency
**Cons**: Requires building all styling from scratch, more development time
**Decision**: Rejected - shadcn-vue provides styled components on top of headless primitives

### Alternative 3: Use Full Component Library (Vuetify, PrimeVue, Element Plus)
**Pros**: Comprehensive component set, mature ecosystems
**Cons**: Opinionated styling, harder to customize, larger bundle sizes, conflicts with Tailwind approach
**Decision**: Rejected - doesn't align with utility-first Tailwind CSS approach

### Alternative 4: Use Nuxt UI or other Tailwind-based Libraries
**Pros**: Built for Tailwind, good integration
**Cons**: Nuxt-specific, may not work well with standard Vue + Vite setup
**Decision**: Rejected - shadcn-vue is framework-agnostic and more suitable

## Open Questions

1. **Icon library choice**: Should we use Radix Icons, Lucide Icons, or continue with custom SVG icons?
   - **Recommendation**: Use Lucide Vue Next for consistency with shadcn-vue ecosystem

2. **Component customization approach**: Should we override component styles directly or create wrapper components?
   - **Recommendation**: Override directly with additional Tailwind classes for simplicity

3. **Testing strategy**: Should we add component tests for shadcn-vue components?
   - **Recommendation**: Test usage in our components, not shadcn-vue components themselves

4. **Dark mode handling**: How should shadcn-vue components handle dark mode with current `media` preference?
   - **Recommendation**: shadcn-vue components support dark mode automatically via Tailwind's `dark:` variants

## Related Changes

- None (first shadcn-vue integration)

## References

- [shadcn-vue Documentation](https://www.shadcn-vue.com/)
- [shadcn-vue Installation Guide (Vite)](https://www.shadcn-vue.com/docs/installation/vite)
- [Reka UI Documentation](https://reka-ui.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- Project spec: `openspec/specs/styling-system/spec.md`
- Project spec: `openspec/specs/component-migration/spec.md`
