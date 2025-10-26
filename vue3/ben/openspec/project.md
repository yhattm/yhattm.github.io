# Project Context

## Purpose
Personal website/portfolio project (ben) hosted on GitHub Pages. Built with modern Vue 3 ecosystem for showcasing personal work and information.

個人網站/作品集專案 (ben)，託管於 GitHub Pages。使用現代化的 Vue 3 生態系統來展示個人作品和資訊。

## Tech Stack

### Core Framework
- **Vue 3** (v3.5.22) - Progressive JavaScript framework
- **TypeScript** (v5.9.0) - Type-safe JavaScript
- **Vite** (v7.1.11) - Next generation frontend build tool

### State Management & Routing
- **Pinia** (v3.0.3) - Official Vue state management
- **Vue Router** (v4.6.3) - Official Vue routing

### Development Tools
- **Node.js** (v20.19.0+ or v22.12.0+) - JavaScript runtime
- **ESLint** (v9.37.0) - Code linting
- **Prettier** (v3.6.2) - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

### Testing
- **Vitest** (v3.2.4) - Unit testing framework
- **Playwright** (v1.56.1) - End-to-end testing
- **Vue Test Utils** (v2.4.6) - Vue component testing utilities

### Development Environment
- **Docker DevContainer** - Node.js & TypeScript container
- **GitHub CLI** - GitHub integration
- **Claude Code** - AI-assisted development

## Project Conventions

### Code Style
**Prettier Configuration**:
- No semicolons (`"semi": false`)
- Single quotes (`"singleQuote": true`)
- 100 character line width (`"printWidth": 100`)

**ESLint Configuration**:
- Vue 3 essential rules
- TypeScript recommended rules
- Vitest plugin for test files
- Playwright plugin for e2e tests
- Prettier integration (skip formatting conflicts)

**Naming Conventions**:
- Components: PascalCase (e.g., `HelloWorld.vue`, `TheWelcome.vue`)
- Files: kebab-case for utilities, PascalCase for components
- Variables/Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase with `I` prefix for interfaces (if needed)

**TypeScript**:
- Strict mode enabled
- Use explicit types where type inference isn't clear
- Prefer interfaces over types for object shapes
- Use type imports when importing only types

### Architecture Patterns

**Project Structure**:
```
src/
├── assets/       # Static assets (CSS, images, fonts)
├── components/   # Reusable Vue components
│   ├── __tests__/  # Component unit tests
│   └── icons/      # Icon components
├── router/       # Vue Router configuration
├── stores/       # Pinia stores (state management)
├── views/        # Page-level components (routes)
├── App.vue       # Root component
└── main.ts       # Application entry point

e2e/              # Playwright end-to-end tests
public/           # Static public assets
```

**Component Guidelines**:
- Use Vue 3 Composition API (prefer `<script setup>` syntax)
- Keep components small and focused (single responsibility)
- Co-locate component tests in `__tests__` directories
- Use Pinia stores for shared state
- Use props for parent-to-child communication
- Use events/emits for child-to-parent communication

**State Management**:
- Use Pinia stores for application-wide state
- Keep stores focused on specific domains (e.g., user, cart, counter)
- Use composition-style stores (setup function pattern)

**Routing**:
- Define routes in `src/router/index.ts`
- Use route-level code splitting for better performance
- Page components live in `src/views/`

### Testing Strategy

**Unit Testing (Vitest)**:
- Test files located in `src/components/__tests__/`
- File naming: `ComponentName.spec.ts`
- Use Vue Test Utils for component testing
- Run with: `npm run test:unit`
- Focus on component logic, computed properties, and methods

**End-to-End Testing (Playwright)**:
- Test files located in `e2e/`
- File naming: `feature.spec.ts`
- Run with: `npm run test:e2e`
- Test user workflows and critical paths
- Supports Chromium, Firefox, and WebKit

**Testing Best Practices**:
- Write tests alongside new features
- Aim for meaningful test coverage (not just high percentages)
- Test behavior, not implementation details
- Use descriptive test names
- Mock external dependencies

### Git Workflow

**Branch Strategy**:
- Main branch: `main` (default and production branch)
- Feature branches: `feature/description` or `feat/description`
- Bug fixes: `fix/description`
- Keep branches short-lived and focused

**Commit Conventions**:
- Follow conventional commits format: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Write clear, concise commit messages in English
- Include context in commit body when needed
- Use present tense ("add feature" not "added feature")

**Example Commits**:
```
feat(router): add new about page route
fix(components): correct button styling on mobile
docs(readme): update installation instructions
test(stores): add unit tests for counter store
chore(deps): update vue to 3.5.22
```

### Build & Development

**Development**:
```bash
npm run dev          # Start dev server with hot reload (--host enabled)
npm run build        # Type-check and build for production
npm run preview      # Preview production build locally
```

**Code Quality**:
```bash
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## Domain Context

This is a **personal portfolio/website project** for Ben, a Backend Developer with extensive experience in:
- Video surveillance systems (Vortex platform at VIVOTEK)
- IoT and smart home products
- Cloud infrastructure (AWS, serverless)
- Mobile and embedded systems

The website serves as a professional presence to showcase:
- Personal profile and professional experience
- Technical skills and project portfolio
- Contact information and social links (LinkedIn)

**Target Audience**: Recruiters, potential employers, collaborators, and professional contacts

## Important Constraints

### Technical Constraints
- **Node.js Version**: Must use Node.js 20.19.0+ or 22.12.0+
- **Browser Compatibility**: Modern browsers with ES6+ support
- **Build Output**: Static files for GitHub Pages hosting
- **No Backend**: Pure frontend application (static site)

### Development Constraints
- Development in Docker DevContainer environment
- Requires Docker-in-Docker support for containerized workflows
- Claude Code integration for AI-assisted development

### Hosting Constraints
- GitHub Pages hosting (static files only)
- Repository: `yhattm.github.io`
- Subdirectory: `/ben`
- Base path configuration may be needed for routing

## External Dependencies

### Development Services
- **GitHub Pages** - Static site hosting
- **GitHub CLI** - GitHub integration for PRs, issues
- **Claude Code** - AI-assisted development tool
- **OpenSpec** - Change proposal and specification management

### CDN & External Resources
- Vue DevTools (browser extension) - Development debugging
- Vite development server - Hot module replacement
- npm registry - Package management

### Build Pipeline
- Vite build system - Asset bundling and optimization
- TypeScript compiler - Type checking and transpilation
- ESLint & Prettier - Code quality and formatting

### Browser APIs (Potential Usage)
- Local Storage - Client-side data persistence
- History API - Vue Router navigation
- Fetch API - HTTP requests (if needed)
- WebSockets - Real-time features (if needed in future)
