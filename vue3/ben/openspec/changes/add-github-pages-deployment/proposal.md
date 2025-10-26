# Proposal: Add GitHub Pages Deployment

## Why

The personal portfolio site (ben) is currently built locally but has no automated deployment mechanism to publish it to GitHub Pages at https://yhattm.github.io/ben. Manual deployment is error-prone and requires remembering the correct build configuration and deployment steps. Automated deployment ensures consistency, reduces deployment friction, and makes the site accessible to its target audience (recruiters, employers, collaborators).

## What Changes

- Add GitHub Actions workflow (`.github/workflows/deploy.yml`) with manual trigger (workflow_dispatch) for controlled deployments
- Configure Vite build with base path `/ben/` to ensure correct asset paths for subdirectory hosting
- Add deployment capability specification to track GitHub Pages deployment requirements
- Configure GitHub Pages to serve from `gh-pages` branch
- Add deployment documentation and troubleshooting guides

## Impact

- **Affected specs**: New `deployment` capability will be added
- **Affected code**:
  - `vite.config.ts` - Add base path configuration
  - `.github/workflows/deploy.yml` - New GitHub Actions workflow file
  - `package.json` - May add deployment helper scripts if needed
  - `README.md` - Add deployment instructions
- **User impact**: Site will be publicly accessible at https://yhattm.github.io/ben
- **Breaking changes**: None (this is a new capability)
- **Dependencies**:
  - Requires GitHub Pages to be enabled in repository settings
  - Requires write permissions for GitHub Actions to push to gh-pages branch
