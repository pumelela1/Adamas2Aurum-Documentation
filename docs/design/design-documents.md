---
sidebar_position: 0
---

# Design Overview

This section is the **design truth** before implementation. It captures *why* the system looks the way it does, not just *what* was built (see `implementation/` for code).

## Structure

| Document | Question it answers | Rubric mapping |
|----------|---------------------|----------------|
| [Requirements](requirements.md) | What must the system do? (FR-01…10, NFR-01…07) | Milestone 1 Initial Design |
| [System Architecture](architecture/system-architecture.md) | What pattern (layered client-server) and why? | System Design, Tech Stack |
| [Component Diagram](architecture/component-diagram.md) | What are the runtime components and their contracts? | System Design, API |
| [Database Design](architecture/database-design.md) | What is the 25-table ER and why? | Database Structure |
| [Deployment Diagram](architecture/deployment-diagram.md) | Where does it run (Render / Cloudflare / Aiven / Gitea)? | Deployment |
| [Curation Workflow](../implementation/curation.md) | How does Draft→Publish→Retire satisfy “authoring as curation”? | Sprint 3 Feature |

## Reading Order

1. **Requirements** → 2. **System Architecture** (pattern + data flows) → 3. **Component Diagram** (router boundaries) → 4. **Database Design** (ER) → 5. **Deployment Diagram** (nodes).

All diagrams are **Mermaid** (versioned in git) plus `drawio.png` exports under `architecture/`. Decisions cite `technology-stack.md` and `implementation/curation.md` with `file:line` traceability — see `ai-declaration.md` for review.
