# portfolio-content Specification

## Purpose
TBD - created by archiving change import-portfolio-content. Update Purpose after archive.
## Requirements
### Requirement: Display Professional Profile
The system MUST display Ben's professional profile information including name, role, tagline, and call-to-action buttons.

#### Scenario: User views hero section
**Given** the user navigates to the homepage
**When** the page loads
**Then** the system displays:
- Greeting tag "👋 Hello, I'm"
- Name "Ben" as primary heading
- Role "Backend Developer" as subtitle
- Tagline "Specializing in Golang, AWS, and Cloud-based Video Surveillance Solutions"
- "Get in Touch" primary button linking to contact section
- "LinkedIn" secondary button linking to https://www.linkedin.com/in/chihpin/

#### Scenario: User views code window visualization
**Given** the user is viewing the hero section
**When** the page loads
**Then** the system displays a code window with:
- MacOS-style window header (three dots)
- Golang hello world code snippet
- Typing animation effect on initial load
- 3D perspective effect on mouse movement

---

### Requirement: Display About Information
The system MUST display Ben's professional background, experience overview, and key statistics.

#### Scenario: User views about section
**Given** the user navigates to or scrolls to the about section
**When** the section becomes visible
**Then** the system displays:
- Section title "About Me"
- Two paragraphs describing professional background
- Three statistics cards showing:
  - "20+ Years Experience"
  - "3 Major Companies"
  - "50+ Technologies"

#### Scenario: Statistics cards animate on scroll
**Given** the user scrolls to the about section
**When** the statistics cards enter viewport
**Then** the system animates cards with:
- Fade-in effect
- Slide-up translation
- Scale effect on hover

---

### Requirement: Display Professional Experience Timeline
The system MUST display Ben's professional experience in chronological timeline format with company details, roles, descriptions, and technology tags.

#### Scenario: User views experience timeline
**Given** the user navigates to the experience section
**When** the section becomes visible
**Then** the system displays a vertical timeline with three positions:

1. **VIVOTEK - R&D Manager**
   - Date: "Nov 2017 - Present · 8 yrs"
   - Description: Cloud-based video surveillance (Vortex backend) and smart home development
   - Tags: Golang, AWS, Kubernetes, Flutter, React

2. **Infani - Cofounder & CTO**
   - Date: "Jul 2015 - Nov 2017 · 2 yrs 5 mos"
   - Description: Baby monitor service architecture from firmware to cloud
   - Tags: Golang, AWS IoT, React Native, TensorFlow, Docker

3. **VIVOTEK - Deputy Manager**
   - Date: "Jul 2005 - Jul 2015 · 10 yrs 1 mo"
   - Description: IP camera firmware and intelligent video analytics
   - Tags: Embedded Linux, DSP, Video Analytics, RTSP, P2P

#### Scenario: Timeline items have interactive markers
**Given** the user views the timeline
**When** hovering over a timeline item
**Then** the timeline marker changes from solid primary color to gradient (primary → secondary)

---

### Requirement: Display Technology Stack
The system MUST display Ben's technology expertise organized by categories with visual proficiency indicators.

#### Scenario: User views tech stack categories
**Given** the user navigates to the tech stack section
**When** the section becomes visible
**Then** the system displays four categories:

1. **Backend Development**
   - Golang (95% proficiency bar)
   - Express.js (85%)
   - REST/GraphQL (90%)
   - gRPC (80%)

2. **Cloud & DevOps**
   - AWS Services (90%)
   - Kubernetes (85%)
   - Docker (90%)
   - AWS CDK (85%)

3. **Frontend & Mobile**
   - React (85%)
   - Flutter (80%)
   - React Native (75%)
   - TypeScript (85%)

4. **Embedded & IoT**
   - Embedded Linux (95%)
   - MQTT/IoT (90%)
   - WebRTC (85%)
   - RTOS (80%)

#### Scenario: Tech bars animate on scroll
**Given** the user scrolls to the tech stack section
**When** each tech item enters viewport
**Then** the proficiency bar animates from 0% to target percentage with smooth transition

---

### Requirement: Display Contact Information
The system MUST provide contact links for professional networking platforms.

#### Scenario: User views contact section
**Given** the user navigates to the contact section
**When** the section becomes visible
**Then** the system displays:
- Section title "Get in Touch"
- Description text about collaboration
- LinkedIn link to https://www.linkedin.com/in/chihpin/
- GitHub link to https://github.com/yhattm
- Both links open in new tab with proper security attributes

---

### Requirement: Display Footer
The system MUST display copyright and branding information in the footer.

#### Scenario: User views footer
**Given** the user scrolls to bottom of page
**When** the footer becomes visible
**Then** the system displays copyright text: "© 2025 Ben. Built with passion for clean code."

---

### Requirement: Portfolio Content Location
The portfolio content MUST be accessible from the About Me page instead of the home page.

#### Scenario: Portfolio at /about route
**Given** the user wants to view portfolio content
**When** they navigate to the /about route
**Then** they see all portfolio sections
**And** sections include Hero, About, Experience, Tech Stack, Contact, and Footer
**And** the content and functionality remain unchanged

#### Scenario: Home page no longer shows portfolio
**Given** the user navigates to the home route (/)
**When** they view the page
**Then** they see the tools home page with clock
**And** they do not see portfolio content
**And** portfolio is not accessible from home page

### Requirement: Portfolio Section Preservation
All existing portfolio sections MUST remain functional after relocation.

#### Scenario: Hero section on About page
**Given** the user is on the About Me page
**When** they view the Hero section
**Then** all Hero content displays correctly
**And** animations and interactions work as before

#### Scenario: Experience section on About page
**Given** the user is on the About Me page
**When** they scroll to the Experience section
**Then** the timeline displays correctly
**And** all experience entries are visible
**And** interactions work as before

#### Scenario: Tech Stack section on About page
**Given** the user is on the About Me page
**When** they scroll to the Tech Stack section
**Then** all technologies are displayed
**And** categories and items render correctly
**And** animations work as before

#### Scenario: Contact section on About page
**Given** the user is on the About Me page
**When** they scroll to the Contact section
**Then** contact information is displayed
**And** social links work correctly
**And** any form functionality remains operational

### Requirement: Portfolio Navigation Integration
The About Me page MUST integrate with the new navigation system.

#### Scenario: Navigate to About Me from any page
**Given** the user is on any page
**When** they click "About Me" in the navigation
**Then** they navigate to the About Me page
**And** all portfolio content loads
**And** scroll position resets to top

#### Scenario: About Me shows active in navigation
**Given** the user is on the About Me page
**When** they view the navigation menu
**Then** the "About Me" menu item is highlighted as active
**And** other menu items are in default state

### Requirement: Backward Compatibility Redirect
The application MUST redirect old portfolio bookmarks to the About Me page.

#### Scenario: Redirect /portfolio to /about
**Given** a user has bookmarked /portfolio URL
**When** they navigate to /portfolio
**Then** they are automatically redirected to /about
**And** they see all portfolio content
**And** the URL updates to /about

