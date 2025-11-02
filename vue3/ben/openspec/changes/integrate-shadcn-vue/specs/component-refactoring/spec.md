# component-refactoring Specification

## Purpose
Define requirements for migrating existing custom components to use shadcn-vue components, ensuring visual consistency, improved accessibility, and maintainable code while preserving functionality.

## MODIFIED Requirements

This specification modifies the `component-migration` spec by providing specific migration paths for existing components to use shadcn-vue as the foundation.

## ADDED Requirements

### Requirement: StatCard Component Migration

The StatCard component SHALL be refactored to use shadcn-vue Card and Badge components.

#### Scenario: Migrate StatCard to use Card component

**GIVEN** the existing `StatCard.vue` component displays a statistic value and label
**WHEN** refactoring to use shadcn-vue
**THEN** the component SHALL import `Card` and `CardContent` from `@/components/ui/card`
**AND** the component SHALL use `<Card>` as the root element
**AND** the component SHALL use `<CardContent>` for the inner content
**AND** the component SHALL maintain the same props interface:
```typescript
defineProps<{
  value: string | number
  label: string
}>()
```

#### Scenario: Maintain StatCard visual appearance

**GIVEN** the refactored StatCard uses shadcn-vue Card
**WHEN** rendering the component
**THEN** the card SHALL have rounded corners (via Card default styling)
**AND** the card SHALL have appropriate shadow (`shadow-lg` or similar)
**AND** the card SHALL have hover effect (`hover:shadow-xl transition-shadow`)
**AND** the value SHALL use `text-3xl font-bold text-blue-600` classes
**AND** the label SHALL use `text-gray-600 dark:text-gray-400 mt-2` classes
**AND** the dark mode styling SHALL work correctly

#### Scenario: Add optional badge to StatCard

**GIVEN** the StatCard component supports additional metadata
**WHEN** adding badge support
**THEN** the component props MAY include an optional `badge` prop:
```typescript
defineProps<{
  value: string | number
  label: string
  badge?: string
}>()
```
**AND** if `badge` is provided, a `<Badge>` component SHALL be rendered
**AND** the badge SHALL be imported from `@/components/ui/badge`
**AND** the badge SHALL be positioned appropriately (e.g., `mt-4`)

### Requirement: TechCategory Component Migration

The TechCategory component SHALL be refactored to use shadcn-vue Card component.

#### Scenario: Migrate TechCategory to use Card

**GIVEN** the existing `TechCategory.vue` component displays a category of technologies
**WHEN** refactoring to use shadcn-vue
**THEN** the component SHALL import `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@/components/ui/card`
**AND** the component SHALL use proper card structure:
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

#### Scenario: Maintain TechCategory styling

**GIVEN** the refactored TechCategory uses shadcn-vue Card
**WHEN** rendering the component
**THEN** the card SHALL have dark background (`bg-white dark:bg-gray-800`)
**AND** the card SHALL have border (`border border-gray-200 dark:border-gray-700`)
**AND** the card title SHALL be styled appropriately
**AND** the card content area SHALL allow slotted content (tech items)

### Requirement: TechItem Component Migration

The TechItem component SHALL be refactored to use shadcn-vue Badge or simplified Card.

#### Scenario: Migrate TechItem to use Badge

**GIVEN** the existing `TechItem.vue` displays a single technology item
**WHEN** refactoring to use shadcn-vue
**THEN** the component MAY be simplified to use `<Badge>` component
**AND** the badge SHALL import from `@/components/ui/badge`
**AND** the component SHALL maintain its text prop interface
**AND** the badge SHALL support variant prop for styling (default, secondary, outline)

#### Scenario: Alternative TechItem as mini Card

**GIVEN** TechItem needs more structure than a badge
**WHEN** using Card instead of Badge
**THEN** the component SHALL use `Card` with minimal padding
**AND** the card SHALL have compact styling
**AND** the card SHALL maintain hover effects if applicable

### Requirement: TimelineItem Component Migration

The TimelineItem component SHALL be refactored to use shadcn-vue Card with custom timeline styling.

#### Scenario: Migrate TimelineItem to use Card

**GIVEN** the existing `TimelineItem.vue` displays a timeline entry with date, title, and description
**WHEN** refactoring to use shadcn-vue
**THEN** the component SHALL import `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` from `@/components/ui/card`
**AND** the component SHALL use card structure:
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

#### Scenario: Maintain TimelineItem timeline styling

**GIVEN** TimelineItem is part of a vertical timeline
**WHEN** rendering the component
**THEN** the component SHALL maintain timeline indicator (dot or line)
**AND** the timeline indicator SHALL be positioned using custom classes (absolute positioning)
**AND** the card SHALL have appropriate margin and padding for timeline layout
**AND** the component SHALL support optional `icon` or `color` props for timeline dot customization

#### Scenario: TimelineItem responsive behavior

**GIVEN** timeline layout may differ on mobile vs desktop
**WHEN** rendering on different screen sizes
**THEN** the component SHALL use responsive Tailwind classes
**AND** the timeline indicator position MAY adjust for mobile (e.g., `left-0 md:left-[-40px]`)
**AND** the card content SHALL remain readable at all breakpoints

### Requirement: CodeWindow Component Migration

The CodeWindow component SHALL be refactored to use shadcn-vue Card with custom code styling.

#### Scenario: Migrate CodeWindow to use Card

**GIVEN** the existing `CodeWindow.vue` displays formatted code with dark background
**WHEN** refactoring to use shadcn-vue
**THEN** the component SHALL import `Card`, `CardContent` from `@/components/ui/card`
**AND** optionally import `CardHeader`, `CardTitle` for window controls
**AND** the component SHALL use card structure with custom classes:
```vue
<Card class="bg-gray-900 dark:bg-gray-950 border-gray-800">
  <CardContent class="p-6 font-mono text-sm overflow-x-auto">
    <slot />
  </CardContent>
</Card>
```

#### Scenario: Add optional window controls to CodeWindow

**GIVEN** CodeWindow represents a code editor or terminal window
**WHEN** adding window chrome
**THEN** the component MAY include `<CardHeader>` with:
- Window control buttons (close, minimize, maximize icons)
- Optional title or filename
**AND** the header SHALL have appropriate styling (dark theme, subtle border)

#### Scenario: Maintain CodeWindow code styling

**GIVEN** CodeWindow displays code content
**WHEN** rendering code
**THEN** the content area SHALL use monospace font (`font-mono`)
**AND** the content area SHALL support horizontal scrolling (`overflow-x-auto`)
**AND** the background SHALL be dark (`bg-gray-900 dark:bg-gray-950`)
**AND** the text color SHALL provide good contrast on dark background
**AND** syntax highlighting (if any) SHALL continue to work via slotted content

### Requirement: Component Accessibility Improvements

All migrated components SHALL benefit from shadcn-vue's built-in accessibility features.

#### Scenario: Verify Card accessibility attributes

**GIVEN** components use shadcn-vue Card component
**WHEN** rendering cards
**THEN** card elements SHALL have appropriate semantic HTML (if applicable)
**AND** card elements SHALL support keyboard navigation if interactive
**AND** card elements SHALL have sufficient color contrast (WCAG AA)
**AND** focus indicators SHALL be visible when navigating via keyboard

#### Scenario: Verify Badge accessibility

**GIVEN** components use shadcn-vue Badge component
**WHEN** rendering badges
**THEN** badges SHALL use appropriate semantic elements or ARIA roles
**AND** badge text SHALL have sufficient color contrast
**AND** badges SHALL not rely solely on color to convey meaning (use text labels)

### Requirement: Migration Backward Compatibility

Component migrations SHALL maintain backward compatibility with existing component usage.

#### Scenario: Preserve component props interface

**GIVEN** a component is being migrated to use shadcn-vue
**WHEN** updating the component implementation
**THEN** the component's public props interface SHALL remain the same
**OR** new props SHALL be added as optional (with defaults)
**AND** existing prop types SHALL not change in breaking ways
**AND** prop validation SHALL remain consistent

#### Scenario: Preserve component slots

**GIVEN** a component uses slots for content projection
**WHEN** migrating to shadcn-vue
**THEN** existing slots SHALL continue to work
**AND** slot content SHALL render in the same logical position
**AND** named slots SHALL maintain their names

#### Scenario: Preserve component events

**GIVEN** a component emits events
**WHEN** migrating to shadcn-vue
**THEN** existing emits SHALL continue to work
**AND** event payloads SHALL remain the same
**AND** new events MAY be added if needed

### Requirement: Component Testing After Migration

All migrated components SHALL be tested to ensure functionality is preserved.

#### Scenario: Visual regression testing

**GIVEN** a component has been migrated to use shadcn-vue
**WHEN** testing the component
**THEN** the component SHALL be visually inspected in:
- Light mode
- Dark mode
- Different viewport sizes (mobile, tablet, desktop)
- Different states (default, hover, focus if applicable)
**AND** visual appearance SHALL match or improve upon the original

#### Scenario: Functional testing

**GIVEN** a component has been migrated
**WHEN** testing component functionality
**THEN** all existing unit tests SHALL pass (or be updated appropriately)
**AND** component props SHALL work as expected
**AND** component slots SHALL render correctly
**AND** component events SHALL emit correctly (if applicable)

#### Scenario: Accessibility testing

**GIVEN** a component has been migrated
**WHEN** testing accessibility
**THEN** the component SHALL be tested with keyboard navigation
**AND** the component SHALL be tested with a screen reader (manual or automated)
**AND** color contrast SHALL be verified (use browser dev tools or contrast checker)
**AND** any accessibility improvements from shadcn-vue SHALL be verified

### Requirement: Migration Documentation

Component migrations SHALL be documented for future reference and consistency.

#### Scenario: Document migration approach

**GIVEN** a component has been successfully migrated
**WHEN** documenting the migration
**THEN** the migration approach SHALL be noted in code comments (if complex)
**AND** the `openspec/project.md` SHALL be updated with component patterns
**AND** examples of shadcn-vue component usage SHALL be included

#### Scenario: Update component usage examples

**GIVEN** components are migrated to use shadcn-vue
**WHEN** updating documentation
**THEN** usage examples SHALL show new import statements
**AND** usage examples SHALL show typical component composition
**AND** usage examples SHALL show customization patterns (additional classes, variants)

### Requirement: Migration Rollout Strategy

Component migrations SHALL be performed incrementally to minimize risk.

#### Scenario: Migrate components in priority order

**GIVEN** multiple components need migration
**WHEN** planning migration work
**THEN** components SHALL be migrated in the following order:
1. `StatCard.vue` (simplest, low risk)
2. `TechCategory.vue` (simple, straightforward card usage)
3. `TechItem.vue` (simple, badge or mini card)
4. `TimelineItem.vue` (medium complexity, custom positioning)
5. `CodeWindow.vue` (medium complexity, custom styling)
**AND** each component SHALL be tested before moving to the next

#### Scenario: Maintain old components during migration

**GIVEN** a component is being migrated
**WHEN** implementing the new version
**THEN** the old component implementation MAY be preserved temporarily (renamed or in separate file)
**AND** the new implementation SHALL be validated before removing old code
**AND** git commits SHALL clearly show before/after for review

#### Scenario: Rollback plan for migrations

**GIVEN** a component migration causes issues
**WHEN** issues are discovered
**THEN** the migration MAY be rolled back by reverting the git commit
**OR** the old component implementation SHALL be restored if available
**AND** issues SHALL be documented for future migration attempts

### Requirement: Component Customization Patterns

Migrated components SHALL support customization while using shadcn-vue as foundation.

#### Scenario: Add custom classes to shadcn-vue components

**GIVEN** a migrated component uses shadcn-vue components
**WHEN** customizing appearance
**THEN** additional Tailwind utility classes MAY be added via `class` prop
**AND** the `cn()` utility SHALL merge classes correctly (no conflicts)
**AND** custom classes SHALL override shadcn-vue defaults where appropriate

#### Scenario: Use component variants

**GIVEN** shadcn-vue components support variants (e.g., Button has default, destructive, outline variants)
**WHEN** using variants in migrated components
**THEN** variant props SHALL be used to select appropriate styling
**AND** custom variants MAY be added if needed (extend component)

#### Scenario: Compose shadcn-vue components

**GIVEN** shadcn-vue provides composable components (e.g., Card with sub-components)
**WHEN** building migrated components
**THEN** components SHALL compose multiple shadcn-vue components as needed
**AND** composition SHALL follow shadcn-vue patterns (e.g., CardHeader > CardTitle)
**AND** composition SHALL be documented for clarity

## Related Specifications

This specification extends and modifies:
- `component-migration` - Provides specific shadcn-vue migration paths
- `styling-system` - Continues to use Tailwind CSS utilities with shadcn-vue

This specification depends on:
- `shadcn-vue-setup` - Requires shadcn-vue to be installed and configured first