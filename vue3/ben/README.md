# ben

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Deployment

This project is deployed to GitHub Pages at https://yhattm.github.io/ben

### Deploying to GitHub Pages

The site uses a GitHub Actions workflow for deployment. Follow these steps:

#### 1. Repository Setup (One-time)

Ensure your GitHub repository has the following settings:

1. Go to repository Settings > Pages
2. Set Source to "Deploy from a branch"
3. Select branch: `gh-pages` and folder: `/ (root)`
4. Ensure GitHub Actions has write permissions:
   - Go to Settings > Actions > General
   - Under "Workflow permissions", select "Read and write permissions"

#### 2. Trigger Deployment

Deploy manually using one of these methods:

**Via GitHub UI:**
1. Go to Actions tab in your repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch `main` and click "Run workflow"

**Via GitHub CLI:**
```sh
gh workflow run deploy.yml
```

#### 3. Verify Deployment

After the workflow completes (usually 1-2 minutes):

1. Check the Actions tab for workflow status
2. Visit https://yhattm.github.io/ben
3. Verify all pages load correctly
4. Check that assets (CSS, JS, images) load properly
5. Test navigation between pages

### Troubleshooting Deployment

**Issue: 404 on GitHub Pages**
- Verify GitHub Pages is enabled in repository settings
- Ensure `gh-pages` branch exists and has content
- Check that base path is set to `/ben/` in `vite.config.ts`

**Issue: Assets not loading (404 errors)**
- Verify `base: '/ben/'` is set in `vite.config.ts`
- Check browser console for path errors
- Ensure the build completed successfully

**Issue: Workflow fails**
- Check Actions tab for error messages
- Verify Node.js version matches `package.json` engines requirement
- Ensure dependencies install correctly with `npm ci`

**Issue: Changes not appearing**
- Clear browser cache or try incognito/private mode
- Wait a few minutes for GitHub Pages to update
- Verify the correct commit was deployed (check `gh-pages` branch)
