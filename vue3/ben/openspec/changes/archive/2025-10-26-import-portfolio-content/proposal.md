# Proposal: Import Portfolio Content from Static Webpage

## Status
- **State**: Draft
- **Created**: 2025-10-24
- **Author**: Ben (via Claude Code)

## Summary
Import and migrate existing static HTML/CSS/JS portfolio webpage into the Vue 3 project structure, transforming it into a modern, component-based single-page application while preserving all existing features and design.

## Background
A complete portfolio webpage exists in the parent directory (`../index.html`, `../styles.css`, `../script.js`) with:
- Professional profile and experience showcase
- Bilingual support (English/Chinese) with localStorage persistence
- Interactive animations (typing effect, scroll animations, particle effects)
- Responsive design with modern UI/UX
- Tech stack visualization with progress bars
- Contact links and timeline layout

The current Vue 3 project (`ben/`) has only placeholder content (HelloWorld component). This change will replace the placeholder content with the full portfolio content, leveraging Vue's reactivity and component architecture.

## Motivation
**Why this change?**
1. **Consistency**: Align the Vue 3 project with the existing portfolio content
2. **Maintainability**: Convert plain HTML/JS to Vue components for better code organization
3. **Type Safety**: Leverage TypeScript for better development experience
4. **Scalability**: Component-based architecture allows easier feature additions
5. **Modern Stack**: Use Vue 3 Composition API, Pinia for state management, and Vue Router for navigation

**What problem does it solve?**
- Eliminates code duplication between static HTML and Vue project
- Provides a structured, maintainable codebase using modern frontend practices
- Enables better testing coverage with Vue Test Utils and Vitest
- Improves developer experience with hot reload and TypeScript

## Scope
### In Scope
- Migrate all content sections (Hero, About, Experience, Tech Stack, Contact)
- Implement bilingual language toggle (EN/ZH) with Pinia store
- Port all animations and interactions to Vue components
- Create reusable component library (LanguageToggle, Timeline, TechStack, etc.)
- Migrate CSS to component-scoped styles
- Update routing structure for single-page navigation
- Preserve all existing functionality and visual design

### Out of Scope
- Backend API integration (static content only)
- Additional features beyond current static webpage
- Redesign or UI/UX changes
- SEO optimization (will be addressed separately if needed)
- Analytics integration

## Affected Capabilities
- **NEW**: `portfolio-content` - Professional portfolio content display
- **NEW**: `bilingual-support` - English/Chinese language switching
- **NEW**: `animations` - Interactive UI animations and effects

## Dependencies
### Technical Dependencies
- Vue 3 (existing)
- Pinia (existing) - for language state management
- Vue Router (existing) - for section navigation
- TypeScript (existing)
- Vite (existing)

### Sequencing
No dependencies on other changes. This is a foundational change.

## Migration Strategy
### Approach
1. **Component Extraction**: Break down monolithic HTML into Vue components
2. **Progressive Migration**: Migrate section by section (Hero → About → Experience → Tech → Contact)
3. **Style Isolation**: Convert global CSS to scoped component styles with shared design tokens
4. **State Management**: Use Pinia for language preference and reactive state
5. **Testing**: Write component tests alongside migration

### Risk Mitigation
- **Risk**: Animation performance degradation
  - **Mitigation**: Use Vue's built-in transition system and test on various devices
- **Risk**: CSS conflicts with existing Vue styles
  - **Mitigation**: Use scoped styles and CSS modules where needed
- **Risk**: Lost functionality during migration
  - **Mitigation**: Create checklist of all features; verify each after migration

## Open Questions
None at this time. The static webpage is well-defined and the Vue architecture is established.

## Alternatives Considered
### Alternative 1: Keep Static HTML Separate
**Description**: Maintain separate static HTML and Vue projects
**Pros**: No migration effort, no risk of breaking existing site
**Cons**: Code duplication, inconsistent development experience, harder to maintain
**Decision**: Rejected - doesn't align with goal of using Vue 3 for portfolio

### Alternative 2: Use Vue from CDN on Static HTML
**Description**: Add Vue via CDN to existing HTML without full migration
**Pros**: Minimal changes, keeps existing structure
**Cons**: Doesn't leverage build tools, TypeScript, or component architecture
**Decision**: Rejected - doesn't provide benefits of modern tooling

## Success Criteria
1. All content from `../index.html` appears in Vue application
2. Bilingual toggle works identically to static version
3. All animations and interactions function as before
4. Responsive design maintained across all breakpoints
5. No console errors or warnings
6. Component tests pass with >80% coverage for new components
7. Build succeeds without type errors
8. Visual regression tests pass (manual verification)

## References
- Static files: `../index.html`, `../styles.css`, `../script.js`
- Vue 3 docs: https://vuejs.org/guide/
- Project context: `openspec/project.md`
