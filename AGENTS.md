# Taskly Agent Instructions

## Expo version rule

Expo has changed. Before writing code that touches Expo, Expo Router, React Native APIs, native config, or package versions, read the exact versioned docs at:

https://docs.expo.dev/versions/v54.0.0/

This project currently uses Expo SDK `~54.0.34`, React Native `0.81.5`, React `19.1.0`, Expo Router `~6.0.23`, typed routes, and React Compiler. Install Expo SDK packages with `npx expo install` so versions stay compatible with SDK 54.

## Project shape

- `app/` owns file-based routing only. Keep route files thin and have them export screens from `src/layouts` when possible.
- `app/index.tsx` exports `SplashScreen`.
- `app/(auth)/_layout.tsx` defines a headerless `Stack` for `onboarding` and `login`.
- `app/(auth)/onboarding.tsx` exports `OnboardingScreen`.
- `app/(auth)/login.tsx` exports `LoginScreen`.
- `src/layouts/` contains feature layout folders and barrel exports.
- `mockdata/` contains local JSON fixtures for auth/demo data and exports them from `mockdata/index.tsx`.

## Current app flow

- `SplashScreen` waits 2.5 seconds, then `router.replace('/onboarding')`.
- `OnboardingScreen` sends the user to `router.replace('/login')`.
- `LoginScreen` checks three mock data groups in this order: admins, staff/users, clients.
- Successful login navigates to `router.replace('/(tabs)')`. `app/(tabs)` has been restored as a minimal `Tabs` navigator (Home + Profile placeholders); expand it as real features are built rather than treating it as deleted.
- Admin users are shown the `AdminHomeScreen` inside the Home tab. The `AdminHomeScreen` navigation uses a sub-header with an active tab title and a hamburger menu modal (instead of a horizontal scrollable tab bar) to switch between different administration views (Overview, Jobs, Earnings, AI Performance, Users).

## Auth and mock data

- Admin records live in `mockdata/admin.json` and may be matched by email or username.
- Staff records live in `mockdata/user.json` and are exported as `mockUsersData`.
- Client records live in `mockdata/client.json` and are exported as `mockClientsData`.
- All three mock fixtures include a `password` field (demo value `Taskly@123` on every record) that `LoginScreen` compares against. Keep fixtures and login logic in sync if either changes.
- Do not treat mock credentials as production auth. Keep this code clearly demo/local unless a real auth layer is added.

## Coding conventions

- Use TypeScript and keep `strict` mode clean.
- Use Tailwind CSS styling via NativeWind utility classes (`className`, `contentContainerClassName`) instead of vanilla `StyleSheet`.
- Prefer React Native primitives and Expo Router APIs already used in the app.
- Preserve the route/layout split: navigation files in `app/`, screen implementation in `src/layouts/.../screen` or feature-specific modules.
- Keep barrel exports in each layout folder and `src/layouts/index.tsx` updated when adding screens.
- Use UTF-8 when editing files. Several Vietnamese UI strings are present; fix mojibake when touching nearby text rather than spreading corrupted text.
- Avoid unrelated template-code restoration. The starter `components`, `hooks`, `constants`, and tab routes are currently deleted in the working tree.
- Admin views: Use the Hamburger Menu Modal navigation system inside `AdminHomeScreen` to switch between administrative views (Overview, Jobs, Earnings, AI Performance, Users) rather than horizontal scrollbars or separate bottom tabs.
- Modular architecture:
  - Divide domain logic and UI by role/feature modules under `src` (e.g., `src/admin`, `src/client`, `src/session`, `src/layouts`).
  - Keep domain-specific layouts inside the respective feature module (e.g., `src/admin/adminHomeLayout/`), whereas general/shared layouts (onboarding, auth, tabs, splash) reside in the global `src/layouts/` directory.
  - Keep screen-specific subcomponents inside a local `components/` folder of that screen's module (e.g., `src/admin/adminHomeLayout/components/`) to avoid polluting global directory spaces. If a component is shared across multiple modules/screens, store it in the global `src/components/` directory.
  - Keep screen-specific or module-specific custom hooks inside a local `hooks/` folder within that module (e.g., `src/admin/hooks/`) to avoid polluting global hooks. If a custom hook is shared across multiple modules/screens, store it in the global `src/hooks/` directory.
  - Expose each module's entry points and public APIs via barrel exports (`index.ts` / `index.tsx`) at the folder boundaries.

## Commands

- Start development: `npm start` or `npx expo start`
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`
- Lint: `npm run lint`

Run `npm run lint` after code changes when practical. If you add dependencies, prefer `npx expo install <package>` for Expo/RN packages.

## Git safety

The working tree may already contain user changes. Do not revert deleted template files or unrelated package changes unless the user explicitly asks for that.
