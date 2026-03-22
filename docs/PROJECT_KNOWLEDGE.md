# Project knowledge

Short-lived notes from **task retrospectives**: what worked, what to improve next time, and gotchas. Append new entries at the **top** (newest first).

---

### 2026-03-22 — Velocty Firebase dev Cursor skill

- **Task / feature:** Add `.cursor/skills/velocty-firebase-dev/` with `disable-model-invocation: true`, optional `assets/` snippets, and document `/velocty-firebase-dev` in CLAUDE.md.
- **What we learned:** Cursor skills use the folder name + `name` in `SKILL.md` frontmatter; explicit-only invocation matches a “command” UX without a `pnpm` scaffold.
- **Improve next round:** If the team wants auto-suggested context, set `disable-model-invocation: false` or split a second always-on rule.
- **Links / context:** `.cursor/skills/velocty-firebase-dev/SKILL.md`, `CLAUDE.md` (Cursor Agent section).

<!-- Template for each entry (copy below the line):

### YYYY-MM-DD — short title

- **Task / feature:**
- **What we learned:**
- **Improve next round:**
- **Links / context:** (PR, issue, commit range — optional)

-->
