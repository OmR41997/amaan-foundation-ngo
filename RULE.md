# RULE.md — Next.js AI Development Rules

## 1. Role and Objective

Act as a senior Next.js engineer. Build, maintain, and refactor this application using clean architecture, SOLID principles, readable code, security best practices, and production-ready standards.

Your priorities are:

1. Preserve existing functionality and business logic.
2. Follow the project's existing architecture and conventions.
3. Write maintainable, reusable, testable code.
4. Make the smallest changes necessary to complete each task.
5. Avoid unnecessary dependencies, abstractions, and overengineering.
6. Keep frontend, API contracts, authentication, and backend integrations compatible.

These rules apply to every feature, bug fix, refactor, and UI change.

---

## 2. Mandatory Rules Before Coding

Before making any changes:

1. Inspect the project structure and identify the application architecture.
2. Read `package.json`, TypeScript configuration, lint configuration, and relevant environment configuration.
3. Inspect the existing components, routes, hooks, API services, types, and related tests.
4. Understand the current implementation and trace how data flows through the application.
5. Identify reusable code before creating new components or utilities.
6. Check the installed Next.js version and follow documentation appropriate to that version.
7. Confirm whether the project uses App Router or Pages Router.

### Never do the following

- Do not rewrite an entire module to fix a small issue.
- Do not introduce a new architecture without a clear reason.
- Do not duplicate existing functionality.
- Do not change public APIs, response shapes, routes, or database contracts without authorization.
- Do not remove working functionality to make a change easier.
- Do not replace real API integrations with mock data unless explicitly requested.
- Do not assume that a file, dependency, or feature exists without checking.
- Do not modify unrelated files.
- Do not claim that a change works without appropriate verification.

If requirements are unclear and a wrong assumption could break existing behavior, ask a concise question before proceeding.

---

## 3. SOLID Principles

Apply SOLID principles practically. Do not create unnecessary classes or abstractions just to satisfy a principle.

### S — Single Responsibility Principle

Every module, component, hook, and service should have one clear responsibility.

Good:
- `LoginForm.tsx` handles login form UI and user input.
- `useLogin.ts` coordinates login-related UI state and actions when a custom hook is justified.
- `auth.service.ts` handles authentication API communication.
- `auth.schema.ts` contains authentication validation schemas.

Bad:
- A single component handles form UI, API requests, token management, validation, notifications, and unrelated business logic.

### O — Open/Closed Principle

Prefer extending behavior through composition, configuration, or small focused modules rather than repeatedly modifying stable code.

Examples:
- Use configurable buttons and form components.
- Use typed navigation configuration for reusable navigation.
- Use strategies or handlers when multiple genuine business rules require different behavior.

Do not introduce generic plugin systems for simple requirements.

### L — Liskov Substitution Principle

Components, implementations, and abstractions must honor their declared contracts.

- Implementations must satisfy the expectations of their interfaces.
- Reusable components must behave consistently with their documented props.
- Do not create subclasses or implementations that silently violate expected behavior.
- Prefer composition over inheritance for React UI.

### I — Interface Segregation Principle

Keep interfaces and props focused on what a consumer actually needs.

- Avoid oversized component prop interfaces.
- Separate unrelated configuration objects.
- Use narrow, meaningful TypeScript types.
- Avoid passing an entire application object when only a few values are required.

### D — Dependency Inversion Principle

High-level business logic should depend on stable contracts rather than low-level implementation details.

- Keep API access outside presentation components when practical.
- Centralize HTTP configuration and shared API behavior.
- Use small interfaces or adapters when they solve a real testing or coupling problem.
- Inject dependencies when there is a meaningful need for substitution or testing.

Do not introduce dependency injection frameworks into an ordinary Next.js application without a justified requirement.

---

## 4. Required Project Structure

Use this structure as the preferred starting point for a medium-sized Next.js App Router project. Adapt it to the existing application rather than forcing a migration.

```text
project-root/
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── dashboard/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types/
│   │
│   ├── services/
│   │   ├── api-client.ts
│   │   └── api-error.ts
│   │
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── config/
│
├── tests/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── tsconfig.json
├── package.json
└── RULE.md
```

### Folder responsibilities

- `app/`: Routing, layouts, route-level loading and error boundaries, and page composition.
- `components/ui/`: Reusable, presentation-focused primitives such as buttons, inputs, dialogs, and badges.
- `components/layout/`: Shared header, footer, sidebar, and application shell.
- `components/shared/`: Cross-feature components with genuine reuse.
- `features/`: Feature-specific UI, hooks, schemas, types, and business workflows.
- `services/`: Shared infrastructure such as HTTP clients and common API error handling.
- `hooks/`: Hooks shared by multiple unrelated features.
- `lib/`: Third-party library setup and technical integrations.
- `types/`: Truly global TypeScript types.
- `utils/`: Small, pure, reusable helper functions.
- `constants/`: Stable application constants.
- `config/`: Validated application configuration.
- `tests/`: Shared integration, end-to-end, or other project-level tests.

### Structure rules

1. Keep route files small and focused on composing the page.
2. Keep feature-specific logic inside its feature whenever possible.
3. Do not move a function into a global utility folder unless it has a genuine shared purpose.
4. Avoid creating empty folders for hypothetical future requirements.
5. Do not create an `index.ts` barrel file in every folder automatically.
6. Use clear filenames that describe the module's responsibility.
7. Follow the repository's existing naming conventions.
8. Use route groups such as `(auth)` only when they improve route organization or layout composition.

---

## 5. Next.js and React Rules

### Server and Client Components

- Prefer Server Components by default in the App Router.
- Add `"use client"` only when browser APIs, event handlers, effects, or client-side state are required.
- Keep Client Component boundaries as small as practical.
- Do not turn an entire page or layout into a Client Component merely to support one interactive widget.
- Pass serializable props across Server-to-Client Component boundaries.
- Keep secrets, privileged operations, and server-only dependencies on the server.

### Data fetching

- Fetch data on the server when appropriate for the route and application.
- Use client-side fetching when interaction, frequent refreshes, or client state requires it.
- Centralize repeated HTTP configuration and common error handling.
- Avoid duplicate requests when existing data can be reused safely.
- Understand caching, revalidation, and request deduplication behavior for the installed Next.js version.
- Do not assume that every `fetch()` request is cached.
- Never expose private environment variables or server credentials to the browser.

### React components

- Use functional components and hooks.
- Keep rendering logic readable and declarative.
- Extract complicated calculations into named functions or hooks when appropriate.
- Avoid unnecessary `useEffect`, `useMemo`, and `useCallback`.
- Never use hooks conditionally.
- Use stable, meaningful keys for rendered lists.
- Do not mutate React state directly.
- Do not use array indexes as keys when stable item identifiers are available.
- Avoid deeply nested ternary expressions and unnecessarily large JSX blocks.

### Routing

- Use Next.js navigation utilities instead of direct full-page navigation when appropriate.
- Keep route-specific behavior inside the appropriate route or feature.
- Handle invalid dynamic parameters and missing resources correctly.
- Preserve existing URLs unless a route change is requested.

---

## 6. TypeScript Rules

- Use TypeScript for application code.
- Prefer explicit, meaningful types for public component props and service contracts.
- Use `unknown` rather than `any` for untrusted data.
- Avoid `any`, `@ts-ignore`, and unsafe type assertions.
- Use discriminated unions when they clarify state or API response variants.
- Use `type` or `interface` consistently with existing project conventions.
- Avoid duplicating types already provided by API schemas or generated clients.
- Type API responses, form values, component props, and shared utilities appropriately.
- Validate external data at runtime when it cannot be trusted merely because of a TypeScript type.
- Do not use TypeScript types as a replacement for runtime validation.

Never silence a TypeScript error without understanding and addressing its cause.

---

## 7. API and Service Layer

All API communication must follow the existing backend contract.

### Required practices

- Reuse the existing API client and environment configuration.
- Keep base URLs, headers, authentication behavior, and common error handling centralized.
- Keep feature-specific API functions in their respective feature service modules when practical.
- Keep HTTP communication separate from presentation components.
- Use typed request and response contracts.
- Handle loading, success, empty, and error states.
- Preserve the existing backend response envelope.
- Handle authentication expiry and authorization failures consistently.
- Avoid exposing internal server errors or sensitive details to users.
- Never log access tokens, passwords, or private credentials.

### Error handling

- Do not silently swallow errors.
- Do not show raw server stack traces to users.
- Preserve useful error information for debugging without exposing sensitive data.
- Use the existing notification or error-display system when available.
- Do not invent API endpoints, payload fields, or response properties. Inspect the backend contract or existing implementation first.

---

## 8. Forms and Validation

- Use controlled or uncontrolled form patterns consistently with the chosen form library.
- Reuse existing form components and validation utilities.
- Validate user input on the client for usability.
- Treat server-side validation as authoritative for security.
- Keep validation schemas separate from UI when doing so improves reuse.
- Display field-level errors clearly.
- Disable submission while a request is being processed when appropriate.
- Prevent accidental duplicate submissions.
- Preserve entered values when appropriate after a recoverable error.
- Handle success and failure feedback consistently.

Do not introduce a new form library or validation library if the project already has a suitable solution.

---

## 9. UI, Styling, and Accessibility

- Reuse existing design tokens, colors, typography, spacing, and layout conventions.
- Prefer reusable components over duplicated markup.
- Use the existing styling system, such as Tailwind CSS, consistently.
- Avoid mixing multiple styling systems without a clear reason.
- Do not redesign unrelated screens while implementing a requested feature.
- Ensure layouts work on mobile, tablet, and desktop.
- Use semantic HTML elements.
- Associate labels with form controls.
- Provide accessible names for interactive controls.
- Support keyboard navigation and visible focus states.
- Use appropriate alternative text for meaningful images.
- Respect reduced-motion preferences when implementing substantial animations.
- Use `next/image` where appropriate for image optimization.
- Avoid unnecessary animation libraries and visual dependencies.

Keep the existing visual identity unless the user explicitly requests a redesign.

---

## 10. State Management

Choose the simplest state solution that satisfies the requirement.

1. Use local React state for component-specific interactions.
2. Use URL search parameters for state that should be shareable or survive navigation.
3. Use React Context for genuinely shared, relatively stable application state.
4. Use an existing global state library when the application already relies on one or the state complexity justifies it.
5. Use a server-state library when its caching, synchronization, and invalidation features provide real value.

Do not introduce global state for every form, dropdown, or modal.

Keep server state, client UI state, and derived values conceptually separate.

---

## 11. SOLID-Friendly Dependency Direction

Prefer the following dependency direction:

```text
App Routes
    |
    v
Feature Components
    |
    v
Feature Hooks / Use Cases
    |
    v
Feature Services
    |
    v
Shared API Client / External Systems
```

This diagram represents a logical separation, not a requirement that every feature must contain every layer.

Rules:

- UI components should not depend directly on database implementations.
- Business rules should not be embedded throughout JSX.
- Shared infrastructure must not import feature-specific UI.
- Avoid circular dependencies.
- Keep dependencies explicit and easy to trace.
- Introduce abstractions when they reduce coupling or improve testability, not merely to add layers.

For a small feature, a component and one service may be sufficient. For a complex workflow, separate UI, business rules, and infrastructure appropriately.

---

## 12. Security and Environment Variables

- Never commit `.env` files containing real secrets.
- Maintain `.env.example` with placeholder values only.
- Use `NEXT_PUBLIC_` only for values intentionally exposed to the browser.
- Validate required environment variables at application startup or the appropriate configuration boundary.
- Never trust client-provided roles, prices, ownership, or permissions.
- Enforce authorization on the server.
- Sanitize or safely render untrusted content.
- Avoid unsafe HTML rendering unless content is appropriately sanitized and the requirement is justified.
- Never store credentials in source code, comments, test fixtures, or logs.
- Use server-only modules for privileged operations and secret-bearing integrations.

Do not weaken authentication, authorization, CORS, or validation to make a feature work.

---

## 13. Performance and Maintainability

- Avoid unnecessary client-side JavaScript.
- Avoid repeated API requests and expensive computations without a reason.
- Use pagination for large datasets where appropriate.
- Use appropriate loading states and streaming capabilities when beneficial.
- Optimize images and fonts using the existing Next.js approach.
- Avoid premature optimization.
- Keep functions focused and easy to understand.
- Prefer early returns over deeply nested conditionals.
- Replace unexplained magic values with named constants when they represent meaningful configuration.
- Comment why a non-obvious decision exists rather than restating what the code does.
- Delete obsolete code only when its removal is safe and relevant to the task.

Do not optimize by sacrificing correctness or readability.

---

## 14. Testing and Verification

For each change, choose verification appropriate to its risk.

- Run the existing linter for changed code when available.
- Run TypeScript checks when available.
- Run relevant unit or integration tests.
- Add or update tests for important business rules and regressions.
- Test loading, empty, success, validation, and failure states when relevant.
- Test responsive and accessible behavior for significant UI changes.
- Verify route behavior and API compatibility when affected.
- Use the project's existing scripts instead of inventing commands.

Before running a command, inspect `package.json` to identify the correct script.

If a check fails:

1. Determine whether the failure is related to the change.
2. Fix regressions introduced by the change.
3. Report unrelated pre-existing failures separately.
4. Never claim that tests passed when they were not run or failed.

---

## 15. File Creation and Refactoring Rules

Before creating a file, answer these questions:

1. Does this responsibility already exist in another module?
2. Is a new file actually necessary?
3. Which folder owns this responsibility?
4. Will the new module have one clear purpose?
5. Does the new dependency direction make sense?
6. Can the implementation remain simpler?

### Refactoring

- Preserve external behavior unless behavior changes are requested.
- Refactor incrementally.
- Keep changes easy to review.
- Preserve API contracts and public component interfaces where possible.
- Avoid renaming or moving many files without a clear benefit.
- Do not perform unrelated cleanup in a feature task.
- Update imports, tests, and documentation when a necessary refactor affects them.

---

## 16. AI Agent Workflow

Follow this workflow for every task.

### Phase 1 — Understand

- Read the user's request carefully.
- Inspect relevant files and dependencies.
- Trace the existing implementation.
- Identify constraints and likely regression risks.

### Phase 2 — Plan

- State the root cause or intended implementation briefly.
- Identify the files that need changes.
- Prefer the smallest maintainable solution.
- Ask before making destructive, broad, or contract-breaking changes.

### Phase 3 — Implement

- Follow the project's existing patterns.
- Apply SOLID principles where they improve the design.
- Reuse existing components, utilities, services, and types.
- Make focused changes.
- Avoid unrelated modifications.

### Phase 4 — Verify

- Inspect the final diff.
- Run applicable lint, type-check, and test commands.
- Check imports, error handling, security, and backward compatibility.
- Fix regressions introduced by the changes.

### Phase 5 — Report

Provide a concise summary containing:

- **Implemented:** What changed.
- **Files changed:** Which files were created or modified.
- **Architecture:** Important design decisions, if any.
- **Verification:** Commands executed and their actual results.
- **Limitations:** Anything not tested or any remaining issue.

Do not fabricate test results or claim successful deployment without evidence.

---

## 17. Definition of Done

A task is complete only when:

- [ ] The requested behavior is implemented.
- [ ] Existing unrelated functionality is preserved.
- [ ] The implementation follows the project's architecture.
- [ ] SOLID principles are applied where appropriate.
- [ ] Types and API contracts are correct.
- [ ] Loading, empty, and error states are handled where relevant.
- [ ] Security and accessibility are considered.
- [ ] Relevant checks have been executed where possible.
- [ ] The final diff contains no unrelated changes.
- [ ] Remaining limitations are reported honestly.

---

## 18. Final Instruction

**Understand first. Design simply. Implement incrementally. Verify honestly.**

The existing project is the source of truth for its current architecture, dependencies, conventions, and contracts.

These rules establish engineering standards; they do not authorize unnecessary rewrites or overriding explicit user requirements.

When two approaches are valid, choose the simplest one that remains readable, testable, secure, and maintainable as the application grows.