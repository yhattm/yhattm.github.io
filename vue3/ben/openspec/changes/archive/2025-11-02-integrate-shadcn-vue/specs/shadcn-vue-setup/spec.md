# shadcn-vue-setup Specification

## Purpose
Define requirements for installing and configuring shadcn-vue component library with Reka UI, ensuring compatibility with existing Tailwind CSS v4 setup and Vue 3 + TypeScript + Vite environment.

## ADDED Requirements

### Requirement: shadcn-vue CLI Installation

The system SHALL install and configure shadcn-vue using the official CLI tool to set up the component infrastructure.

#### Scenario: Initialize shadcn-vue in existing project

**GIVEN** the project has Vue 3, Vite, TypeScript, and Tailwind CSS v4 already configured
**WHEN** initializing shadcn-vue
**THEN** the command `npx shadcn-vue@latest init` SHALL be executed
**AND** the CLI SHALL prompt for base color selection
**AND** "Neutral" base color SHALL be selected
**AND** the initialization SHALL complete without errors

#### Scenario: Generate components.json configuration

**GIVEN** shadcn-vue initialization is running
**WHEN** the CLI creates project configuration
**THEN** a `components.json` file SHALL be created at project root
**AND** the configuration SHALL specify:
- `tsx: false` (using .vue files, not .tsx)
- `tailwind.config: "tailwind.config.js"`
- `tailwind.css: "src/assets/tailwind.css"`
- `components: "@/components"`
- `utils: "@/lib/utils"`
**AND** the configuration SHALL use Reka UI as the underlying library

### Requirement: Utility Functions Setup

The system SHALL provide utility functions for managing component class names and styling.

#### Scenario: Create cn() utility function

**GIVEN** shadcn-vue components require class name merging
**WHEN** setting up project utilities
**THEN** a file `src/lib/utils.ts` SHALL be created
**AND** the file SHALL export a `cn()` function
**AND** the `cn()` function SHALL merge class names using `clsx` and `tailwind-merge`
**AND** the function signature SHALL be:
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### Scenario: Install utility dependencies

**GIVEN** the `cn()` utility requires external packages
**WHEN** installing shadcn-vue
**THEN** the following packages SHALL be installed:
- `clsx` (for conditional class names)
- `tailwind-merge` (for merging Tailwind classes without conflicts)
- `class-variance-authority` (for component variant management)

### Requirement: Component Installation

The system SHALL install a comprehensive set of shadcn-vue components for current and future use.

#### Scenario: Install core form and input components

**GIVEN** shadcn-vue is initialized
**WHEN** installing form-related components
**THEN** the following components SHALL be added:
- `button` - Button component with variants
- `input` - Text input component
- `textarea` - Multi-line text input
- `label` - Form label component
- `checkbox` - Checkbox input
- `radio-group` - Radio button group
- `switch` - Toggle switch component
- `select` - Select dropdown component
- `slider` - Range slider component

#### Scenario: Install card and layout components

**GIVEN** shadcn-vue is initialized
**WHEN** installing layout components
**THEN** the following components SHALL be added:
- `card` - Card container with header, content, footer sub-components
- `separator` - Visual separator line
- `aspect-ratio` - Aspect ratio container
- `scroll-area` - Custom scrollable area

#### Scenario: Install overlay and dialog components

**GIVEN** shadcn-vue is initialized
**WHEN** installing overlay components
**THEN** the following components SHALL be added:
- `dialog` - Modal dialog with trigger, content, header, footer
- `alert-dialog` - Confirmation dialog
- `popover` - Popover overlay
- `tooltip` - Tooltip component
- `sheet` - Slide-out panel (if available)

#### Scenario: Install feedback and display components

**GIVEN** shadcn-vue is initialized
**WHEN** installing feedback components
**THEN** the following components SHALL be added:
- `alert` - Alert notification component
- `badge` - Badge/tag component
- `avatar` - User avatar component
- `skeleton` - Loading skeleton component
- `progress` - Progress bar component

#### Scenario: Install navigation and interactive components

**GIVEN** shadcn-vue is initialized
**WHEN** installing navigation components
**THEN** the following components SHALL be added:
- `dropdown-menu` - Dropdown menu with items
- `tabs` - Tab navigation component
- `accordion` - Accordion/collapsible sections
- `collapsible` - Single collapsible section
- `navigation-menu` - Complex navigation menu (if available)

### Requirement: Reka UI Integration

The system SHALL use Reka UI as the headless UI primitive library for shadcn-vue components.

#### Scenario: Install Reka UI dependencies

**GIVEN** shadcn-vue uses Reka UI for accessible primitives
**WHEN** adding components via shadcn-vue CLI
**THEN** required Reka UI packages SHALL be automatically installed
**AND** packages MAY include:
- `@reka-ui/core` or individual Reka UI component packages
- Specific Reka UI primitives as needed per component

#### Scenario: Verify Reka UI accessibility features

**GIVEN** Reka UI provides accessible headless components
**WHEN** using shadcn-vue components
**THEN** components SHALL include:
- Proper ARIA attributes (roles, labels, descriptions)
- Keyboard navigation support (Tab, Arrow keys, Enter, Escape)
- Focus management and focus trapping where appropriate
- Screen reader announcements
**AND** components SHALL follow WAI-ARIA best practices

### Requirement: TypeScript Configuration

The system SHALL ensure TypeScript path aliases are correctly configured for shadcn-vue component imports.

#### Scenario: Verify TypeScript path alias configuration

**GIVEN** the project uses TypeScript with path aliases
**WHEN** importing shadcn-vue components
**THEN** the `tsconfig.app.json` SHALL contain:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
**AND** imports like `import { Button } from '@/components/ui/button'` SHALL resolve correctly
**AND** TypeScript SHALL provide type completion for component props

#### Scenario: Verify component type definitions

**GIVEN** shadcn-vue components are written in TypeScript
**WHEN** importing and using components
**THEN** all component exports SHALL have full type definitions
**AND** component props SHALL be type-checked at compile time
**AND** `vue-tsc` SHALL not report type errors for shadcn-vue components

### Requirement: Tailwind CSS Theme Configuration

The system SHALL configure Tailwind CSS with shadcn-vue color tokens and theme variables.

#### Scenario: Add CSS variable color tokens

**GIVEN** shadcn-vue uses CSS variables for theming
**WHEN** initializing shadcn-vue
**THEN** the `src/assets/tailwind.css` file SHALL be updated to include:
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

#### Scenario: Configure Tailwind theme extension

**GIVEN** shadcn-vue uses CSS variables in Tailwind config
**WHEN** updating `tailwind.config.js`
**THEN** the theme SHALL be extended with color definitions using CSS variables
**AND** the extended theme SHOULD include:
```javascript
extend: {
  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
    },
    // ... other color tokens
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
  },
}
```

### Requirement: Dark Mode Compatibility

The system SHALL ensure shadcn-vue components work correctly with the existing dark mode strategy.

#### Scenario: Verify dark mode CSS variables

**GIVEN** the project uses `darkMode: 'media'` in Tailwind config
**WHEN** user's system preference is dark mode
**THEN** Tailwind SHALL apply `.dark` class styles automatically
**AND** shadcn-vue components SHALL use dark mode CSS variable values
**AND** component appearance SHALL adapt to dark mode correctly

#### Scenario: Test dark mode component rendering

**GIVEN** shadcn-vue components are installed
**WHEN** viewing components in dark mode
**THEN** components SHALL use appropriate dark mode colors
**AND** text SHALL remain readable with sufficient contrast
**AND** borders and backgrounds SHALL be visible
**AND** no visual glitches or color inversions SHALL occur

### Requirement: Build System Validation

The system SHALL verify that shadcn-vue components work correctly with the existing Vite build system.

#### Scenario: Verify development build

**GIVEN** shadcn-vue components are installed
**WHEN** running `npm run dev`
**THEN** the development server SHALL start without errors
**AND** shadcn-vue components SHALL render correctly in the browser
**AND** hot module replacement SHALL work for component changes
**AND** TypeScript errors SHALL be shown in the browser overlay if present

#### Scenario: Verify production build

**GIVEN** shadcn-vue components are installed
**WHEN** running `npm run build`
**THEN** the build SHALL complete without errors
**AND** TypeScript type-checking SHALL pass
**AND** shadcn-vue components SHALL be included in the bundle
**AND** unused components SHALL be tree-shaken (not included)
**AND** the final bundle size SHALL be reasonable (baseline + estimated 50-75KB for 25 components)

#### Scenario: Verify type-checking

**GIVEN** shadcn-vue components are installed
**WHEN** running `npm run type-check`
**THEN** TypeScript SHALL compile without errors
**AND** all component imports SHALL resolve correctly
**AND** component prop types SHALL be validated

### Requirement: Component Import Validation

The system SHALL verify that shadcn-vue components can be imported and used in Vue components.

#### Scenario: Import and use Button component

**GIVEN** the Button component is installed
**WHEN** importing in a Vue component:
```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button>Click me</Button>
</template>
```
**THEN** the component SHALL import without errors
**AND** TypeScript SHALL recognize the Button component
**AND** the button SHALL render correctly in the browser

#### Scenario: Import and use Card components

**GIVEN** the Card component is installed
**WHEN** importing card sub-components:
```vue
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>Content</CardContent>
  </Card>
</template>
```
**THEN** all card components SHALL import without errors
**AND** TypeScript SHALL recognize all card sub-components
**AND** the card SHALL render correctly with proper structure

### Requirement: Documentation Updates

The system SHALL update project documentation to reflect shadcn-vue integration.

#### Scenario: Update project.md with shadcn-vue information

**GIVEN** shadcn-vue is successfully integrated
**WHEN** updating project documentation
**THEN** `openspec/project.md` SHALL be updated to include:
- shadcn-vue in the "UI & Styling" section
- Reka UI as headless UI primitive library
- Component directory structure (`/src/components/ui/`)
- Utility functions (`/src/lib/utils.ts`)
- Usage patterns and examples
- Link to shadcn-vue documentation

#### Scenario: Document component usage patterns

**GIVEN** shadcn-vue components are available
**WHEN** documenting component conventions
**THEN** `openspec/project.md` SHALL include:
- Import patterns (e.g., `import { Button } from '@/components/ui/button'`)
- Component composition patterns (e.g., Card with sub-components)
- Customization approaches (additional Tailwind classes, class props)
- TypeScript usage (typed props, component types)