# Decision Rules — Seed Data

This folder holds the **seed data for the `da_decisionrule` Dataverse table** —
the data-driven engagement logic that the Power Automate "Stakeholder Assignment"
flow (Flow 2) reads to determine required teams and the lead team.

Keeping these rules as data (not hard-coded in a flow) means the engagement model
can change without editing the app or flows — edit a row, re-import, done.

## Files

| File | Use |
| ---- | --- |
| `decision-rules.seed.json` | Canonical source. Best for Power Automate, the Configuration Migration tool, or a custom importer. |
| `decision-rules.seed.csv` | Same rows, flat. Best for a quick **Import from Excel/CSV** into the Dataverse table or for review in a spreadsheet. |

Both files are kept in sync and are derived from
[`../docs/reference/engagement-decision-matrix.md`](../docs/reference/engagement-decision-matrix.md)
(Parts A and B). If you change the matrix, update these; if you change these,
update the matrix.

## Column reference

| Column | Meaning |
| ------ | ------- |
| `da_name` | Human-readable rule name. |
| `da_triggerfield` | Logical name of the `da_projectrequest` field to evaluate (`*` = always). |
| `da_triggervalue` | Value(s) that fire the rule. `*` = always; `\|`-separated = match any (used for multi-choice fields like `da_solutiontype`/`da_classification`). |
| `da_teams` | Teams added to the required set when the rule fires. JSON: array. CSV: `;`-separated. |
| `da_isleadcandidate` | Whether this rule can set the accountable **lead** team. |
| `da_leadteam` | Lead team assigned if this rule wins lead selection. |
| `da_priority` | Lead selection order — **lower wins** (first match). Also the natural evaluation order. |
| `da_active` | Enable/disable the rule without deleting it. |
| `notes` | Rationale (not required in Dataverse; drop the column on import if unused). |

## How the flow consumes these rows

1. **List** active rules ordered by `da_priority` ascending.
2. For each rule, evaluate `da_triggerfield` on the request against
   `da_triggervalue` (treating `*` as always-true and `|` as match-any).
3. On a match: **union** `da_teams` into the required-teams set; if
   `da_isleadcandidate` is true and no lead is set yet, set the lead from
   `da_leadteam`.
4. Write `da_requiredteams` and `da_leadteam` back to the request and upsert the
   `da_stakeholder` rows.

See [`../docs/power-platform/technical-spec.md`](../docs/power-platform/technical-spec.md)
§5 (Flow 2) for the full implementation.

## Import quick-start

**CSV → Dataverse:** in the table's *Import → Import from Excel*, map columns by
name. Convert `;`-separated `da_teams` into the multi-choice values during the
mapping step (or pre-split if your importer requires it).

**JSON → Dataverse:** use the Configuration Migration tool or a one-time flow
with a *Parse JSON* action feeding *Add a new row* per element, splitting
`da_teams` into the choice column.

> The `Baseline` rule (`da_triggerfield = *`) seeds the always-engaged teams
> (Business Stakeholder, PMO). Keep it first (`da_priority = 0`).
