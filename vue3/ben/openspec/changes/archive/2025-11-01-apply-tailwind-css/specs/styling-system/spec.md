# Styling System

## Overview

Defines the Tailwind CSS-based styling system for the Ben portfolio project, including configuration, build integration, and usage patterns.

## ADDED Requirements

### Requirement: Tailwind CSS Installation and Configuration

The system SHALL install Tailwind CSS and required plugins to support utility-first styling.

#### Scenario: Installing Tailwind CSS dependencies

**GIVEN** the project uses npm for package management
**WHEN** installing Tailwind CSS
**THEN** the following dependencies SHALL be added to `package.json`:
- `tailwindcss` ^3.4.0
- `@tailwindcss/typography` ^0.5.0
- `@tailwindcss/forms` ^0.5.0
- `@tailwindcss/container-queries` ^0.1.0
- `autoprefixer` ^10.4.0

#### Scenario: Configuring Tailwind CSS

**GIVEN** Tailwind CSS is installed
**WHEN** creating the Tailwind configuration
**THEN** `tailwind.config.js` SHALL be created at project root with:
- Content paths: `['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']`
- Plugins: typography, forms, container-queries
- Default theme (no custom theme configuration)
- Dark mode: 'media' (uses prefers-color-scheme)

#### Scenario: Configuring PostCSS

**GIVEN** Tailwind CSS requires PostCSS processing
**WHEN** configuring the build system
**THEN** `postcss.config.js` SHALL be created at project root with:
- `tailwindcss` plugin
- `autoprefixer` plugin

### Requirement: Tailwind CSS Import

The application SHALL import Tailwind CSS directives to enable utility classes.

#### Scenario: Adding Tailwind directives

**GIVEN** the application uses Vite as build tool
**WHEN** setting up Tailwind CSS
**THEN** a CSS file SHALL be created at `src/assets/tailwind.css` containing:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Scenario: Importing Tailwind CSS in application

**GIVEN** Tailwind CSS directives are defined
**WHEN** initializing the Vue application
**THEN** `src/main.ts` SHALL import `./assets/tailwind.css` as the first CSS import
**AND** all other CSS imports (`base.css`, `main.css`) SHALL be removed

### Requirement: Custom CSS Removal

The system SHALL remove all custom CSS files to fully adopt Tailwind utility-first approach.

#### Scenario: Removing base CSS files

**GIVEN** the project has custom CSS files
**WHEN** migrating to Tailwind CSS
**THEN** the following files SHALL be deleted:
- `src/assets/base.css`
- `src/assets/main.css`
- `src/assets/variables.css`

#### Scenario: Removing component scoped styles

**GIVEN** Vue components have `<style scoped>` blocks
**WHEN** migrating to Tailwind CSS
**THEN** all `<style>` blocks SHALL be removed from `.vue` files
**AND** styling SHALL be applied via Tailwind utility classes in templates

### Requirement: Build Integration

The build system SHALL process Tailwind CSS correctly for development and production.

#### Scenario: Development build with Tailwind

**GIVEN** Tailwind CSS is configured
**WHEN** running `npm run dev`
**THEN** Vite SHALL compile Tailwind CSS with all utilities available
**AND** hot module replacement SHALL work for CSS changes

#### Scenario: Production build optimization

**GIVEN** Tailwind CSS is configured
**WHEN** running `npm run build`
**THEN** unused CSS classes SHALL be purged based on content paths
**AND** the final CSS bundle SHALL be minified
**AND** the CSS bundle size SHALL be < 50KB after purging

### Requirement: Responsive Design with Tailwind

The system SHALL use Tailwind's responsive utilities for all breakpoint-based styling.

#### Scenario: Using Tailwind breakpoints

**GIVEN** components require responsive behavior
**WHEN** applying responsive styles
**THEN** Tailwind's responsive prefixes SHALL be used (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
**AND** mobile-first approach SHALL be followed (base styles for mobile, then larger breakpoints)

### Requirement: Dark Mode Support

The system SHALL support dark mode using Tailwind's dark variant.

#### Scenario: Applying dark mode styles

**GIVEN** the application supports dark mode
**WHEN** users prefer dark color scheme (via `prefers-color-scheme: dark`)
**THEN** components SHALL use `dark:` variant classes for dark mode styling
**AND** dark mode SHALL work automatically based on system preference

## MODIFIED Requirements

None - This is a new styling system capability.

## REMOVED Requirements

None - This is a new capability addition.

## Related Capabilities

- **component-migration**: Component templates must use utility classes defined by this styling system
- **animations**: Existing animation requirements should be reimplemented using Tailwind utilities
- **bilingual-support**: Styling system must not interfere with i18n functionality