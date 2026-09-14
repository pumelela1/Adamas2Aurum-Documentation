---
sidebar_position: 5
---

# CI/CD Pipeline

## Overview

All CI runs on **self-hosted Gitea Actions** (GitHub Actions-compatible YAML) — no Codecov/Coveralls, no SonarQube server, badges committed to repo.

Workflows in `.gitea/workflows/`:

| Workflow | Trigger | Node | Purpose |
|----------|---------|------|---------|
| `ci.yml` | `push: [main,dev]`, `pull_request: [main]` | 20 | Tests + coverage + badges + artifact, fails below 70% |
| `test.yml` | `push`, `pull_request: [dev,main]` | 20 | Quick unit tests (`npm test`) |
| `format-check.yml` | `push, pull_request: [main]` | 24 | `prettier --check .` |

## `ci.yml` — Coverage Badges Pipeline

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - Checkout (fetch-depth 0, token GITEA_TOKEN)
      - Setup Node 20 cache npm
      - Install: npm ci && npm ci --prefix app/src/backend
      - Run Tests: id: tests, continue-on-error: true, run: npm run test:ci  # --ci --coverage, threshold 70% global
      - Generate Coverage Badges: if: always(), mkdir -p badges && npm run badges || npx jest-coverage-badges --input coverage/coverage-summary.json --output badges
      - Generate Test Badge: if: always(), curl https://img.shields.io/badge/tests-${{steps.tests.outcome=='success'?'passing-brightgreen':'failing-red'}} -o badges/badge-tests.svg
      - Commit Push: if: always(), git config gitea-actions, git add badges/, commit "chore: update coverage badges [skip ci]" && git push
      - Upload Artifact: if: always(), uses: actions/upload-artifact@v4, path: coverage/lcov-report/, name: coverage-report, retention-days: 14
      - Check Outcome: if: always(), exit 1 if steps.tests.outcome == 'failure'
```

- **`package.json:69` `test:ci`**: `node --experimental-vm-modules node_modules/.bin/jest --ci --coverage` (207 tests, `All 83.43%`).
- **`package.json:44` `coverageThreshold`**: `global branches/functions/lines/statements 70%` — pipeline exits non-zero if breached.
- **`badges` script**: `jest-coverage-badges --input coverage/coverage-summary.json --output badges` → `badge-statements/branches/functions/lines.svg` (Shields.io).
- **Test badge**: Shields URL `https://img.shields.io/badge/tests-passing-brightgreen` vs `failing-red` based on `steps.tests.outcome` (requires `continue-on-error`).
- **`[skip ci]`** prevents infinite loop (Gitea skips CI for that commit).
- **Artifacts**: `coverage/lcov-report/` (HTML) downloadable 14 days.

## Local Equivalent

```bash
npm run test:ci        # same as CI
npm run badges         # generates 4 coverage SVGs to badges/
curl -s https://img.shields.io/badge/tests-passing-brightgreen -o badges/badge-tests.svg
```

## Badges in README

`Adamas2Aurum/README.md:3` renders 5 relative SVGs:

```markdown
![Tests](badges/badge-tests.svg)
![Statements](badges/badge-statements.svg)
![Branches](badges/badge-branches.svg)
![Functions](badges/badge-functions.svg)
![Lines](badges/badge-lines.svg)
```

Self-contained — no third-party hosting beyond Shields fetch at generation time.

## SonarQube Placeholder

`sonar-project.properties` at repo root is a placeholder (`sonar.projectKey`, `sonar.javascript.lcov.reportPaths=coverage/lcov.info`). If SonarQube is added later, point `sonar.host.url`/`login` and run `npx sonar-scanner`.
