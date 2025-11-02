# Design: Integrate shadcn-vue Component Library

## Architecture Overview

This change introduces shadcn-vue as the primary UI component library for the Ben portfolio website. shadcn-vue follows a "copy-paste" approach where components are added directly to the project's source code rather than being installed as npm package dependencies. This provides maximum flexibility and control.

### Key Architectural Decisions

1. **Copy-Paste Component Model**: Components are copied into `/src/components/ui/` and become part of the project
2. **Reka UI as Headless Foundation**: Use Reka UI (not Radix Vue) for accessible headless primitives
3. **Tailwind CSS Integration**: Components use Tailwind utilities, fully compatible with existing v4 setup
4. **TypeScript First**: All components are fully typed with TypeScript
5. **Composition API**: Components use Vue 3 Composition API with `<script setup>` syntax

## Component Organization

### Directory Structure

```
src/
├── components/
│   ├── ui/                    # shadcn-vue components (NEW)
│   │   ├── button/
│   │   │   └── Button.vue
│   │   ├── card/
│   │   │   ├── Card.vue
│   │   │   ├── CardHeader.vue
│   │   │   ├── CardTitle.vue
│   │   │   ├── CardDescription.vue
│   │   │   ├── CardContent.vue
│   │   │   └── CardFooter.vue
│   │   ├── badge/
│   │   │   └── Badge.vue
│   │   ├── dialog/
│   │   │   ├── Dialog.vue
│   │   │   ├── DialogTrigger.vue
│   │   │   ├── DialogContent.vue
│   │   │   ├── DialogHeader.vue
│   │   │   ├── DialogTitle.vue
│   │   │   ├── DialogDescription.vue
│   │   │   └── DialogFooter.vue
│   │   ├── dropdown-menu/
│   │   ├── select/
│   │   ├── input/
│   │   ├── textarea/
│   │   ├── label/
│   │   ├── checkbox/
│   │   ├── radio-group/
│   │   ├── switch/
│   │   ├── slider/
│   │   ├── tooltip/
│   │   ├── popover/
│   │   ├── alert/
│   │   ├── alert-dialog/
│   │   ├── separator/
│   │   ├── avatar/
│   │   ├── skeleton/
│   │   ├── progress/
│   │   ├── tabs/
│   │   ├── accordion/
│   │   ├── collapsible/
│   │   └── ...
│   ├── NavBar.vue             # Existing custom components
│   ├── LanguageToggle.vue
│   ├── CodeWindow.vue         # Will be refactored
│   ├── StatCard.vue           # Will be refactored
│   ├── TimelineItem.vue       # Will be refactored
│   └── ...
├── lib/                       # Utility functions (NEW)
│   └── utils.ts              # cn() utility for class merging
└── ...
```

### Naming Conventions

- **shadcn-vue components**: PascalCase, follow shadcn-vue naming (e.g., `Button.vue`, `Card.vue`)
- **Component subdirectories**: kebab-case (e.g., `dropdown-menu/`, `alert-dialog/`)
- **Custom components**: Continue existing PascalCase convention (e.g., `NavBar.vue`, `StatCard.vue`)

## Technical Integration

### 1. CLI Tool Integration

```bash
# Initialize shadcn-vue in existing project
npx shadcn-vue@latest init

# Add individual components
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add badge
# ... and 20+ more
```

The CLI will:
- Create `components.json` configuration file
- Add `lib/utils.ts` with `cn()` helper function
- Install required npm dependencies (reka-ui, class-variance-authority, clsx, tailwind-merge)
- Update TypeScript paths if needed
- Copy component files into project

### 2. TypeScript Configuration

**Already configured** - Project has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

This allows imports like:
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
```

### 3. Vite Configuration

**Already configured** - Project has:
```typescript
{
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}
```

No changes needed. Vite already resolves `@/` alias correctly.

### 4. Tailwind CSS Integration

**Already configured** - Project uses Tailwind v4 with:
- `@import "tailwindcss";` in `src/assets/tailwind.css`
- `@tailwindcss/postcss` plugin (v4 compatible)
- Existing plugins: typography, forms, container-queries

shadcn-vue components will work seamlessly with this setup. The components use standard Tailwind utility classes.

**Color Theme Configuration**:
shadcn-vue uses CSS variables for theming. During initialization, the CLI will add color variables to `tailwind.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more color tokens ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode color tokens ... */
  }
}
```

**Decision**: Use default neutral color scheme. This provides good contrast and works well with existing blue accent colors.

### 5. Component Utilities

**New file**: `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This utility function is used throughout shadcn-vue components to merge Tailwind classes intelligently, handling conflicts and conditional classes.

## Component Migration Strategy

### Migration Approach

**Iterative, component-by-component migration**:

1. **Identify custom component for migration**
2. **Map to shadcn-vue equivalent(s)**
3. **Create new implementation using shadcn-vue**
4. **Validate visual appearance and functionality**
5. **Replace old component with new implementation**
6. **Remove old component code**

### Component Mapping

| Custom Component | shadcn-vue Equivalent | Migration Complexity |
|------------------|----------------------|---------------------|
| `StatCard.vue` | `Card` + `Badge` + custom content | Low - Direct mapping |
| `TimelineItem.vue` | `Card` + custom timeline layout | Medium - Custom positioning needed |
| `CodeWindow.vue` | `Card` + custom code styling | Medium - Keep code highlighting logic |
| `TechCategory.vue` | `Card` + `Badge` | Low - Simple card with badges |
| `TechItem.vue` | `Card` or `Badge` | Low - Minimal custom logic |

### Example Migration: StatCard

**Before** (custom component with Tailwind utilities):
```vue
<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div class="text-3xl font-bold text-blue-600">{{ value }}</div>
    <div class="text-gray-600 dark:text-gray-400 mt-2">{{ label }}</div>
  </div>
</template>
```

**After** (using shadcn-vue):
```vue
<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineProps<{
  value: string | number
  label: string
  badge?: string
}>()
</script>

<template>
  <Card class="hover:shadow-xl transition-shadow">
    <CardContent class="pt-6">
      <div class="text-3xl font-bold text-blue-600">{{ value }}</div>
      <div class="text-gray-600 dark:text-gray-400 mt-2">{{ label }}</div>
      <Badge v-if="badge" class="mt-4">{{ badge }}</Badge>
    </CardContent>
  </Card>
</template>
```

**Benefits**:
- Better accessibility (Card component has proper ARIA attributes)
- Consistent styling with other cards across the app
- Easier to extend with CardHeader, CardFooter if needed
- Less custom CSS to maintain

### Example Migration: CodeWindow

**Before** (custom component):
```vue
<template>
  <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 font-mono text-sm overflow-x-auto">
    <slot />
  </div>
</template>
```

**After** (using shadcn-vue):
```vue
<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
</script>

<template>
  <Card class="bg-gray-900 dark:bg-gray-950 border-gray-800">
    <CardContent class="p-6 font-mono text-sm overflow-x-auto">
      <slot />
    </CardContent>
  </Card>
</template>
```

**Benefits**:
- Reuses Card component structure
- Can easily add CardHeader with window controls or title
- Maintains custom code styling while using standard component base

## Accessibility Considerations

### Built-in Accessibility Features

shadcn-vue components (via Reka UI) provide:

1. **Keyboard Navigation**: All interactive components support keyboard navigation (Tab, Arrow keys, Enter, Escape)
2. **ARIA Attributes**: Proper ARIA roles, labels, and descriptions
3. **Focus Management**: Correct focus trapping and restoration in dialogs, popovers
4. **Screen Reader Support**: Semantic HTML and ARIA attributes for screen readers
5. **Disabled States**: Proper handling of disabled states (visual + functional)

### Accessibility Testing

After migration, validate:
- ✅ Keyboard navigation works for all interactive elements
- ✅ Focus indicators are visible
- ✅ Screen reader announces components correctly
- ✅ Color contrast meets WCAG AA standards
- ✅ Interactive elements have accessible names

## Performance Considerations

### Bundle Size Impact

**Mitigation strategies**:
1. **Tree Shaking**: Only used components are included in build (Vite handles this)
2. **Copy-Paste Model**: No entire library imported, only individual components
3. **Lazy Loading**: Can lazy-load heavy components (Dialog, Popover) if needed
4. **CSS Purging**: Tailwind purges unused utility classes in production

**Expected Impact**:
- Base shadcn-vue utilities (cn function, dependencies): ~5-10KB
- Each simple component (Button, Badge): ~1-2KB
- Each complex component (Dialog, Dropdown): ~3-5KB
- Comprehensive set (25 components): ~50-75KB total (before gzip)
- After gzip: ~15-25KB estimated

**Baseline**: Current build size should be measured before integration for comparison.

### Runtime Performance

shadcn-vue components are lightweight and performant:
- Use Vue 3 Composition API (optimal reactivity)
- Minimal JavaScript logic (most styling via CSS)
- No heavy runtime dependencies
- Reka UI primitives are optimized for performance

## Dark Mode Strategy

### Current Setup
Project uses `darkMode: 'media'` in Tailwind config, which automatically applies dark mode based on user's system preference (`prefers-color-scheme: dark`).

### shadcn-vue Dark Mode
shadcn-vue components support dark mode through:
1. **CSS Variables**: Dark mode color tokens defined in `.dark` class
2. **Tailwind dark: variants**: Components use `dark:` prefixes for dark mode styles

### Integration
**No changes needed**. The `media` strategy works with shadcn-vue:
- When system preference is dark, Tailwind applies `dark:` classes
- shadcn-vue components respond to `dark:` classes
- CSS variables can be scoped to `.dark` for dark mode colors

**Future Enhancement** (out of scope):
Could switch to `class` strategy and add manual dark mode toggle if desired.

## Testing Strategy

### Unit Testing
- **Do NOT test shadcn-vue components themselves** (they are already tested)
- **DO test our custom components that use shadcn-vue components**
- Test props, events, slots, and custom logic
- Use Vue Test Utils with Vitest

Example:
```typescript
import { mount } from '@vue/test-utils'
import StatCard from '@/components/StatCard.vue'

describe('StatCard', () => {
  it('renders value and label', () => {
    const wrapper = mount(StatCard, {
      props: { value: '10+', label: 'Years of Experience' }
    })
    expect(wrapper.text()).toContain('10+')
    expect(wrapper.text()).toContain('Years of Experience')
  })
})
```

### Visual Testing
- Manual visual testing in development mode
- Check responsive behavior at different breakpoints
- Verify dark mode appearance
- Validate hover and focus states

### E2E Testing
- E2E tests (Playwright) should continue to work without changes
- May need minor selector updates if component structure changes
- Test user workflows, not component internals

## Rollout Plan

### Phase 1: Setup and Installation (Low Risk)
1. Run `npx shadcn-vue@latest init`
2. Verify `components.json` configuration
3. Install comprehensive component set (25+ components)
4. Verify TypeScript compilation succeeds
5. Verify development build works (`npm run dev`)

### Phase 2: Component Migration (Medium Risk)
1. Migrate `StatCard.vue` (simplest)
2. Migrate `TechCategory.vue` and `TechItem.vue`
3. Migrate `TimelineItem.vue`
4. Migrate `CodeWindow.vue`
5. Test each migration in isolation

### Phase 3: Validation and Documentation (Low Risk)
1. Run full build and type-check
2. Visual regression testing
3. Accessibility testing
4. Update `project.md` with shadcn-vue patterns
5. Add component usage examples

### Rollback Strategy
If issues arise:
1. **Partial rollback**: Keep shadcn-vue installed but revert individual component migrations
2. **Full rollback**: Remove shadcn-vue dependencies and restore original components from git
3. **Git branches**: Perform work on feature branch, only merge when validated

## Future Enhancements (Out of Scope)

1. **Custom Theme**: Create custom blue-themed color palette
2. **Additional Components**: Add more shadcn-vue components as needed (Command, Menubar, Sheet, Toast, etc.)
3. **Component Documentation**: Create Storybook or similar for component showcase
4. **Design Tokens**: Expand CSS variables for comprehensive theming
5. **Icon Library**: Integrate Lucide Vue Next for consistent iconography
6. **Form Validation**: Add form components with validation (Input, Textarea, Select with form helpers)

## Conclusion

This design provides a solid foundation for integrating shadcn-vue into the Ben portfolio website. The copy-paste model ensures flexibility, Tailwind CSS integration maintains consistency with existing styling approach, and the iterative migration strategy minimizes risk.

Key benefits:
- ✅ Production-ready, accessible components
- ✅ Seamless Tailwind CSS integration
- ✅ Full TypeScript support
- ✅ Maximum customization flexibility
- ✅ Minimal bundle size impact
- ✅ Improved development velocity