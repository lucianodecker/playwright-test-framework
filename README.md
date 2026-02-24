# Playwright Test Automation Framework

![GitHub Actions](https://github.com/lucianodecker/playwright-test-framework/actions/workflows/playwright.yml/badge.svg)

End-to-end test automation framework built with **Playwright** and **TypeScript**. Covers a complete e-commerce purchase flow, automated WCAG 2.2 accessibility compliance scanning, and a CI/CD pipeline with GitHub Actions.

**System Under Test:** [SauceDemo](https://www.saucedemo.com) — a sample e-commerce application by Sauce Labs.

---

## ✨ Highlights

- **28 automated tests** across 6 test suites (Login, Inventory, Cart, Checkout, Accessibility, Visual)
- **Page Object Model** with abstract base class and composition-based components
- **WCAG 2.2 accessibility scanning** with known violation tracking and canary tests
- **Storage State authentication** — login once, reuse across all tests
- **CI/CD pipeline** with GitHub Actions, secrets management, and artifact retention
- **Automated A11y reporting** — structured JSON reports generated on every violation
- **Cross-browser testing** on Chromium, Firefox, and WebKit
- **Visual Regression testing** with baseline screenshot comparison

---

## 🛠️ Tech Stack

![Playwright](https://img.shields.io/badge/-Playwright-%232EAD33?style=flat-square&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-%233178C6?style=flat-square&logo=typescript&logoColor=white)
![axe-core](https://img.shields.io/badge/-axe--core-%23542784?style=flat-square&logo=deque&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-%232088FF?style=flat-square&logo=github-actions&logoColor=white)
![dotenv](https://img.shields.io/badge/-dotenv-%23ECD53F?style=flat-square&logo=dotenv&logoColor=black)
| Technology | Purpose |
|---|---|
| Playwright | Browser automation & test runner |
| TypeScript | Type-safe test code |
| axe-core | Automated WCAG 2.2 accessibility scanning |
| GitHub Actions | CI/CD pipeline with secrets management |
| dotenv | Environment variable management |
---

## 📁 Project Structure

```
├── .auth/                          # Storage State (gitignored)
├── .github/workflows/
│   └── playwright.yml              # CI/CD pipeline
├── src/
│   ├── components/
│   │   └── HeaderComponent.ts      # Shared UI component (Composition)
│   ├── fixtures/
│   │   └── fixtures.ts             # Custom test fixtures with DI
│   ├── pages/
│   │   ├── BasePage.ts             # Abstract base class
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutStepOnePage.ts
│   │   ├── CheckoutStepTwoPage.ts
│   │   └── CheckoutCompletePage.ts
│   └── services/
│       └── pricing.service.ts      # Business logic extraction
├── tests/
│   ├── auth.setup.ts               # One-time authentication setup
│   ├── accessibility/
│   │   └── a11y.spec.ts            # WCAG 2.2 compliance tests
│   ├── e2e/
│   │   ├── login.spec.ts
│   │   ├── inventory.spec.ts
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   └── visual/
│       └── visual.spec.ts          # Visual regression tests
├── .env.example
└── playwright.config.ts
```

---

## 🏗️ Architecture Decisions

### Page Object Model with Abstract Base Class

Every page extends `BasePage`, which enforces a `path` property and provides shared navigation via `goto()`. This guarantees consistent navigation behavior across all pages and eliminates duplicated setup code.

### Composition over Inheritance

Shared UI elements like the site header are extracted into reusable components (`HeaderComponent`) rather than placed in a base class. Pages compose their components:

```typescript
public readonly header: HeaderComponent;

constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
}
```

This avoids deep inheritance chains and keeps each class focused on a single responsibility.

### Storage State Authentication

Tests reuse a saved browser state instead of logging in before every test. A dedicated `auth.setup.ts` runs once, saves the authenticated state, and all subsequent tests load it. Login-specific tests run in a separate Playwright project without stored state to ensure correct isolation.

### Known Violations Tracking with Canary Tests

Accessibility violations that cannot be fixed (e.g., third-party components) are documented in a `KNOWN_VIOLATIONS` registry with rule ID, reason, WCAG criterion, discovery date, and ticket URL. A canary test verifies each known violation still exists — if the upstream bug gets fixed, the canary fails, signaling the team to clean up the registry. This prevents stale documentation and ensures audit compliance.

```typescript
const KNOWN_VIOLATIONS: readonly KnownViolation[] = [
    {
        ruleId: 'select-name',
        reason: 'Third-party app - cannot fix.',
        wcagCriterion: 'wcag2a, wcag412',
        foundDate: '18.02.2026',
        ticketUrl: '',
    },
];
```

### Automated A11y Report Generation

When violations are detected, a structured JSON report is written to `test-results/a11y-reports/`. Each report entry includes rule ID, severity, description, help URL, WCAG tags, affected HTML elements, and status (`KNOWN` or `NEW`). Reports are uploaded as CI artifacts for audit trails.

### Environment Variables & Secrets Management

Credentials are never hardcoded. Locally, they are loaded from `.env` via `dotenv`. In CI, they are injected through GitHub Actions repository secrets at job level. A fail-fast validation throws immediately if required variables are missing — tests never run with undefined credentials.

---

## 📋 Test Coverage

| Suite | Tests | Scope |
|---|---|---|
| Login | 4 | Valid/invalid credentials, empty fields, error messages |
| Inventory | 5 | Product display, sorting, add/remove cart items |
| Cart | 6 | Navigation, product details, price validation, multi-item |
| Checkout | 7 | Form validation, complete purchase flow, cancel navigation |
| Accessibility | 3 | WCAG 2.2 scans (login + inventory), canary test |
| Visual | 3 | Baseline screenshot comparison (login, inventory, cart) |
| **Total** | **28** | **+ 1 auth setup** |

---

## ♿ WCAG Compliance

This framework scans against the following WCAG standards:

| Standard | Tags | Status |
|---|---|---|
| WCAG 2.0 Level A & AA | `wcag2a`, `wcag2aa` | ✅ Scanned |
| WCAG 2.1 Level A & AA | `wcag21a`, `wcag21aa` | ✅ Scanned (current EU standard via EN 301 549) |
| WCAG 2.2 Level AA | `wcag22aa` | ✅ Scanned (upcoming EU standard) |

Automated scanning catches approximately 30–40% of WCAG issues (technical violations like missing labels, contrast, ARIA). Manual testing is required for complete compliance coverage.

---

## 🚀 CI/CD Pipeline

The GitHub Actions pipeline runs on every push and pull request to `main`:

1. **Install** — deterministic `npm ci` from lockfile
2. **Test** — full E2E and accessibility suite
3. **Artifacts** — Playwright HTML report + A11y JSON reports (60-day retention)

> **Note:** Visual regression tests run locally only — CI environments have different font rendering and subpixel antialiasing, which produces false positives.

Credentials are managed through GitHub repository secrets. The pipeline uses `ubuntu-latest` with a single worker for deterministic test execution.

---

## 🚦 Getting Started

### Prerequisites

- Node.js (LTS)
- npm

### Installation

```bash
git clone https://github.com/lucianodecker/playwright-test-framework.git
cd playwright-test-framework
npm ci
npx playwright install --with-deps
```

### Environment Setup

```bash
cp .env.example .env
```

Fill in the values in `.env`:

```
BASE_URL=https://www.saucedemo.com
STANDARD_USER=<your_username>
STANDARD_PASSWORD=<your_password>
```

Credentials are available on the [SauceDemo login page](https://www.saucedemo.com).

### Run Tests

```bash
# Run all tests
npx playwright test

# Run with HTML report
npx playwright test --reporter=html

# Run specific project
npx playwright test --project=chromium
npx playwright test --project=chromium-no-auth

# Run specific test file
npx playwright test tests/e2e/checkout.spec.ts

# List all tests without running
npx playwright test --list
```
