---
sidebar_position: 8
---

# Work Tracker — Taiga

Tool: **Taiga** Kanban (`https://taiga.sdp.ms.wits.ac.za/project/adamas2aurum`, Wits SSO) — chosen over Notion for subtask support and simplicity (`technology-stack.md`).

## Board Columns

`Backlog → In Progress → In Review → Done` — mirrors Git flow `feat/* → dev`.

## Snapshot (14 Sep 2026)

| Column | Count | Example |
|--------|-------|---------|
| Backlog | 28 | US3-06 Procedural placement (5), US3-04 Trust engine (5) |
| In Progress | 6 | Sprint 3 docs, `frontend-deploy.yml` secrets |
| In Review | 12 | PR #12 `feat/curation-workflow`, PR #13 `feat/ci-badges` |
| Done | 46 | US-01…US2-10, curation, `ci.yml` 83.4% |

*Total 92 cards; 46 Done Sprint 1–3, 12 in Done Sprint 3 alone (`product-backlog.md`).*

## Evidence — Used (not just Exists)

- `meetings.md:9` and every `sprints/sprint-*.md` logs “Board workflow” move on merge.
- `git log --grep=Closes` links commits to Taiga issues (e.g., `feat/curation-workflow Closes #10`).
- Burndown derived from Taiga point export (`burndown.md`).

## Policy

One branch per story, one card per story, subtasks for granular work (e.g., curation split into schema/campaigns/analytics/console). Reviewer moves `In Review → Done` after CI green.
