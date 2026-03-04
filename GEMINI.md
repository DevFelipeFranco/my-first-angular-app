# GEMINI.md - Dokqet (Legal Management Platform)

This file provides instructional context for Gemini CLI when working on this project.

## Project Overview

**Dokqet** is a legal management platform designed for lawyers and law firms. It is built using modern **Angular 21** features, including standalone components and Signals for state management. The application features a dashboard, client management, case tracking, and an admin interface for user management.

### Main Technologies
- **Angular 21**: Framework for building the frontend.
- **Angular SSR**: Server-Side Rendering enabled for performance and SEO.
- **Tailwind CSS 3**: Utility-first CSS framework for styling.
- **Vitest**: Modern testing framework replacing Karma/Jasmine.
- **Angular Signals**: Primary mechanism for reactive state management (see `AuthService`).
- **Express**: Used as the backend server for SSR.

### Architecture
- `src/app/pages/`: Contains the main page components (Smart Components).
- `src/app/components/ui/`: Reusable, presentation-only components (Dumb Components).
- `src/app/components/layout/`: Structural layout components like `SidebarComponent` and `BreadcrumbsComponent`.
- `src/app/services/`: Core business logic and state management (e.g., `AuthService`).
- `src/app/auth/`: Authentication guards and related logic.
- `src/app/app.routes.ts`: Central routing configuration using `AppLayoutComponent` as a shell for protected routes.

## Building and Running

| Action | Command |
| :--- | :--- |
| **Start Dev Server** | `npm start` (runs `ng serve`) |
| **Build for Production** | `npm run build` (runs `ng build`) |
| **Run Unit Tests** | `npm test` (runs `vitest`) |
| **Run SSR Server** | `npm run serve:ssr:my-first-angular-app` |

## Development Conventions

### Coding Style
- **Standalone Components**: All new components MUST be `standalone: true`. The project does not use traditional `NgModules`.
- **Reactive State with Signals**: Use Angular `signals`, `computed`, and `effect` for state management instead of complex RxJS flows when possible. See `AuthService` for implementation patterns.
- **Naming Convention**: Follow the standard Angular naming: `feature.type.ts` (e.g., `user-profile.component.ts`).
- **Styling**: Prefer Tailwind utility classes. Avoid writing custom CSS in `.css` files unless absolutely necessary.
- **Typescript**: Use strict typing. Avoid `any`. Define interfaces for all data models in `src/app/services/` or a dedicated `models` folder.

### Testing Practices
- **Vitest**: Use Vitest for all unit tests. Look at `app.spec.ts` for reference.
- **Testing Signals**: Ensure tests account for signal updates and computed values.

### Contribution Guidelines
- **UI Components**: Place reusable UI elements (inputs, buttons, cards) in `src/app/components/ui/`.
- **Routing**: Add new protected pages under the `AppLayoutComponent` children in `app.routes.ts` to ensure they get the sidebar and breadcrumb navigation.
- **Auth**: Use the `authGuard` for any route that requires a logged-in session.
