# deployment Specification

## Purpose
TBD - created by archiving change add-github-pages-deployment. Update Purpose after archive.
## Requirements
### Requirement: GitHub Actions Deployment Workflow
The system SHALL provide a GitHub Actions workflow that builds and deploys the application to GitHub Pages.

#### Scenario: Manual deployment trigger
- **WHEN** a user triggers the workflow manually via GitHub Actions UI or CLI
- **THEN** the workflow builds the application and deploys it to the gh-pages branch

#### Scenario: Build with correct base path
- **WHEN** the workflow builds the application
- **THEN** the build output SHALL be configured with base path `/ben/` for correct asset loading

#### Scenario: Deployment to gh-pages branch
- **WHEN** the build completes successfully
- **THEN** the workflow SHALL deploy the dist folder to the gh-pages branch with appropriate permissions

#### Scenario: Workflow failure notification
- **WHEN** the deployment workflow fails at any step
- **THEN** the workflow SHALL report the failure with clear error messages in the GitHub Actions log

### Requirement: Vite Base Path Configuration
The Vite build configuration SHALL be updated to support GitHub Pages subdirectory deployment.

#### Scenario: Base path for subdirectory hosting
- **WHEN** the application is built for production
- **THEN** all asset paths SHALL be prefixed with `/ben/` to match the deployment URL

#### Scenario: Development environment unchanged
- **WHEN** the application runs in development mode
- **THEN** the base path SHALL NOT be applied to allow local development at root path

### Requirement: Deployment Documentation
The project SHALL provide clear documentation for deploying to GitHub Pages.

#### Scenario: README deployment instructions
- **WHEN** a developer reads the README
- **THEN** they SHALL find instructions for triggering the deployment workflow and verifying the deployment

#### Scenario: Repository setup requirements
- **WHEN** setting up the repository for the first time
- **THEN** documentation SHALL specify required GitHub Pages settings and permissions

### Requirement: Deployment Verification
The deployment process SHALL include mechanisms to verify successful deployment.

#### Scenario: GitHub Pages configuration check
- **WHEN** GitHub Pages is accessed after deployment
- **THEN** the site SHALL be accessible at https://yhattm.github.io/ben with all assets loading correctly

#### Scenario: Build artifact validation
- **WHEN** the build completes
- **THEN** the workflow SHALL verify that index.html and required assets exist in the dist folder before deployment

