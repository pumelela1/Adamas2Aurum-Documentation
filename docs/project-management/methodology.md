---
sidebar_position: 7
---

# Project Methodology

## Choice & Motivation

We chose **Scrum** (timeboxed sprints) over pure Kanban because rubric milestones (1–4) are date-fixed (see `project-plan.md` Gantt). Sprints map 1:1 to milestones, giving clear `Sprint Review → Stakeholder feedback → Backlog grooming` cycles. Kanban (Taiga board `To Do → In Progress → In Review → Done`) runs *inside* each sprint for WIP limits and subtasks — see `work-tracker.md`.

Alternative **Lean** was rejected: too fluid for graded milestones; **Waterfall** rejected: no iterative stakeholder feedback (required for “authoring as curation”).

## Evidence — Used

- **Cadence:** 3–4 meetings/week (Mon planning, Wed standup, Fri review/retro) — `meetings.md` logs 17, `sprints/sprint-1-meeting-1.md:39` agreement.
- **Artefacts:** `product-backlog.md` prioritised (MoSCoW), `sprint board` per sprint, `burndown.md` mermaid charts (Sprint 1 38 pts → 0, Sprint 2 42 → 0, Sprint 3 28 → 0).
- **Roles:** Scrum Master Busisiwe, PO proxy (Heritage stakeholder), Dev per story `user-stories.md`.
- **Retros:** Scope cut `movementTrust` 5→3 pts Sprint 2 Day 10, curation split US2-10 → 4 stories Sprint 3 after stakeholder “authoring as curation”.

## Velocity

Sprint 1 1.8 pt/day, Sprint 2 2.1, Sprint 3 2.3 — improvement via `jest` harness reuse. No carry-over; US3 stretch deferred to `product-backlog.md:17` To Do.

See `project-plan.md` for Gantt + risks, `burndown.md` for charts.
