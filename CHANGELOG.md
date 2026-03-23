# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1] - 2026-03-21

### Added
- **Coaching Enhancements:** Adjusted testing text placeholders for the Coaching dashboard UI.
- **Security:** Hardened `.gitignore` by explicitly excluding `.env` files to prevent credential leakage.

### Fixed
- **UI Contrast Bug:** Completely resolved dark-theme legibility issues. Swept the codebase (Home, Sign-in, and Footer components) to replace visually inaccessible `.text-muted` elements with `.text-white-50`.

## [0.2.0] - 2026-03-05

### Added
- **Feature Suites:** Scaffolded base features and implemented initial views for application slices via team collaboration (`Events`, `Nutrition`, `Gyms` merges).

## [0.1.0] - 2026-02-28

### Added
- **Authentication System:** Integrated backend API connection for `/api/auth/sign-in` and `/api/auth/sign-up` using `UserService`.
- **Token Management:** Created `AuthService` to extract, store, and manage JWT session tokens in `localStorage` securely.

## [0.0.1] - 2026-02-28

### Added
- **Core Architecture:** Set up standard Angular project skeleton.
- **Base UI:** Built `MainComponent` layout shell, `HeaderComponent` (navbar), and `FooterComponent` with initial dark theme styling.
- **Sign-in View:** Constructed the visual login screen.
- **Routing:** Configured basic unauthenticated routing routing mapping to the main shell.
- **Dependencies:** Reeled in Bootstrap 5 and Bootstrap Icons globally into `angular.json`.
