# Component Migration

## Overview

Defines the requirements for migrating all Vue components from custom CSS to Tailwind CSS utility classes.

## ADDED Requirements

### Requirement: Component Template Migration

All Vue component templates SHALL use Tailwind utility classes instead of custom CSS classes.

#### Scenario: Migrating layout utilities

**GIVEN** a component uses custom layout CSS (flexbox, grid, spacing)
**WHEN** migrating to Tailwind
**THEN** Tailwind utility classes SHALL replace custom classes:
- Flexbox: `flex`, `flex-col`, `flex-row`, `items-center`, `justify-between`, etc.
- Grid: `grid`, `grid-cols-*`, `gap-*`, etc.
- Spacing: `p-*`, `m-*`, `px-*`, `py-*`, `space-*`, etc.
- Sizing: `w-*`, `h-*`, `min-h-*`, `max-w-*`, etc.

#### Scenario: Migrating color and background utilities

**GIVEN** a component uses custom color CSS
**WHEN** migrating to Tailwind
**THEN** Tailwind color utilities SHALL replace custom color classes:
- Text colors: `text-gray-900`, `text-blue-600`, etc.
- Background colors: `bg-white`, `bg-gray-100`, `bg-gradient-to-br`, etc.
- Border colors: `border-gray-300`, etc.

#### Scenario: Migrating typography utilities

**GIVEN** a component uses custom typography CSS
**WHEN** migrating to Tailwind
**THEN** Tailwind typography utilities SHALL replace custom classes:
- Font size: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.
- Font weight: `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- Line height: `leading-tight`, `leading-normal`, `leading-relaxed`
- Text alignment: `text-left`, `text-center`, `text-right`

#### Scenario: Migrating interactive states

**GIVEN** a component has hover, focus, or active states
**WHEN** migrating to Tailwind
**THEN** state variants SHALL be used:
- Hover: `hover:bg-blue-700`, `hover:text-gray-900`, etc.
- Focus: `focus:outline-none`, `focus:ring-2`, `focus:ring-blue-500`, etc.
- Active: `active:bg-blue-800`, etc.

### Requirement: Responsive Component Behavior

All components SHALL implement responsive behavior using Tailwind's responsive utilities.

#### Scenario: Mobile-first responsive design

**GIVEN** a component requires different layouts for different screen sizes
**WHEN** applying responsive styles
**THEN** the mobile layout SHALL be the base (no prefix)
**AND** larger screens SHALL use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)

#### Scenario: Navigation responsive behavior

**GIVEN** the NavBar component needs different layouts for mobile and desktop
**WHEN** migrating to Tailwind
**THEN** mobile menu SHALL use base classes
**AND** desktop menu SHALL use `md:` or `lg:` prefixed classes for horizontal layout

### Requirement: Dark Mode Component Support

All components SHALL support dark mode using Tailwind's dark variant.

#### Scenario: Dark mode color adaptation

**GIVEN** a component needs different colors in dark mode
**WHEN** applying dark mode styles
**THEN** the `dark:` variant prefix SHALL be used:
- Dark backgrounds: `dark:bg-gray-900`, `dark:bg-gray-800`, etc.
- Dark text: `dark:text-gray-100`, `dark:text-white`, etc.
- Dark borders: `dark:border-gray-700`, etc.

### Requirement: Animation and Transition Migration

All existing animations SHALL be reimplemented using Tailwind utilities and transitions.

#### Scenario: Simple transitions

**GIVEN** a component uses CSS transitions
**WHEN** migrating to Tailwind
**THEN** Tailwind transition utilities SHALL be used:
- `transition`, `transition-all`, `transition-colors`, `transition-transform`
- Duration: `duration-150`, `duration-300`, `duration-500`
- Easing: `ease-in`, `ease-out`, `ease-in-out`

#### Scenario: Complex animations

**GIVEN** a component uses complex CSS animations or keyframes
**WHEN** migrating to Tailwind
**THEN** Tailwind's animation utilities SHALL be used where possible:
- `animate-spin`, `animate-pulse`, `animate-bounce`, etc.
**OR** custom animations MAY be defined in Tailwind config if needed

### Requirement: Scoped Style Removal

All Vue component scoped style blocks SHALL be removed.

#### Scenario: Removing scoped styles from components

**GIVEN** a Vue component has a `<style scoped>` block
**WHEN** migrating to Tailwind
**THEN** the entire `<style scoped>` block SHALL be removed from the `.vue` file
**AND** all styling SHALL be moved to Tailwind utility classes in the template
**EXCEPT** for rare edge cases requiring custom CSS (which SHALL be documented)

### Requirement: Component-Specific Requirements

Critical components SHALL maintain their existing functionality while using Tailwind classes.

#### Scenario: HeroSection migration

**GIVEN** HeroSection uses custom gradient backgrounds and complex layout
**WHEN** migrating to Tailwind
**THEN** it SHALL use:
- Gradient utilities: `bg-gradient-to-b`, `from-gray-900`, `to-gray-800`
- Grid layout: `grid`, `grid-cols-1`, `md:grid-cols-2`
- Alignment: `min-h-screen`, `flex`, `items-center`

#### Scenario: NavBar migration

**GIVEN** NavBar has sticky positioning and responsive menu
**WHEN** migrating to Tailwind
**THEN** it SHALL use:
- Position: `sticky`, `top-0`, `z-50`
- Responsive menu: `hidden`, `md:flex`
- Flexbox: `flex`, `items-center`, `justify-between`

#### Scenario: CodeWindow migration

**GIVEN** CodeWindow component has custom styling for code display
**WHEN** migrating to Tailwind
**THEN** it SHALL use:
- Background: `bg-gray-900`, `dark:bg-gray-950`
- Typography: `font-mono`, `text-sm`
- Spacing: `p-6`, `space-y-2`

#### Scenario: Timeline and card components migration

**GIVEN** TimelineItem, StatCard, TechItem components use custom card styling
**WHEN** migrating to Tailwind
**THEN** they SHALL use:
- Card container: `bg-white`, `dark:bg-gray-800`, `rounded-lg`, `shadow-lg`
- Borders: `border`, `border-gray-200`, `dark:border-gray-700`
- Padding: `p-6`, `p-4`
- Hover effects: `hover:shadow-xl`, `hover:scale-105`, `transition-transform`

### Requirement: Form and Interactive Elements

Forms and interactive elements SHALL use Tailwind Forms plugin styling.

#### Scenario: Contact links and buttons

**GIVEN** contact section has links and call-to-action buttons
**WHEN** migrating to Tailwind
**THEN** buttons SHALL use:
- Primary: `bg-blue-600`, `hover:bg-blue-700`, `text-white`, `font-semibold`, `py-2`, `px-4`, `rounded`
- Secondary: `bg-gray-200`, `hover:bg-gray-300`, `text-gray-900`
- Link: `text-blue-600`, `hover:text-blue-800`, `underline`

#### Scenario: Form elements (future)

**GIVEN** the Forms plugin is installed
**WHEN** adding form elements in the future
**THEN** form inputs SHALL automatically inherit Tailwind Forms styling
**AND** custom form styles SHALL use Tailwind utilities

### Requirement: Typography Plugin Integration

Long-form content SHALL use Tailwind Typography plugin when applicable.

#### Scenario: Prose content styling

**GIVEN** a component displays long-form text content
**WHEN** applying typography styles
**THEN** the `prose` class MAY be used for automatic typography styling
**AND** responsive typography SHALL use `prose-sm`, `prose-lg`, etc.
**AND** dark mode SHALL use `dark:prose-invert`

## MODIFIED Requirements

### Animations (from existing animations spec)

**MODIFICATION**: Animation implementations SHALL be updated to use Tailwind utilities where possible.

#### Updated Scenario: Fade-in animations

**GIVEN** components use fade-in animations on scroll
**WHEN** reimplementing with Tailwind
**THEN** animations SHALL use:
- Opacity: `opacity-0`, `opacity-100`
- Transitions: `transition-opacity`, `duration-500`
- Transform: `translate-y-4`, `translate-y-0`
**AND** animation triggers SHALL remain JavaScript-based (Intersection Observer)

## REMOVED Requirements

None - Component migration adds new requirements without removing existing ones.

## Related Capabilities

- **styling-system**: Provides Tailwind configuration and build integration required for component migration
- **animations**: Existing animation requirements reimplemented using Tailwind utilities
- **bilingual-support**: Component migration must preserve i18n functionality
- **portfolio-content**: Component migration must preserve all content and structure