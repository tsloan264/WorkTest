# Enterprise Data & Analytics Project Intake & Requirements Framework

A repeatable intake, requirements, and governance framework for data and
analytics initiatives. It replaces ad-hoc "who do we need to involve?"
conversations with a governed, repeatable process that ensures the right
people are engaged at the right time, eliminates duplicate effort,
establishes clear ownership, and creates a consistent delivery path from
intake to production.

This framework is intentionally tool-agnostic on paper and Microsoft-native
in implementation. You can run it today as a Markdown/Word form, then graduate
it into a Power Apps + Dataverse + Power Automate solution using the technical
specification included here.

## What's in this repo

| Path | Purpose |
| ---- | ------- |
| [`docs/data-analytics-intake-template.md`](docs/data-analytics-intake-template.md) | The complete, annotated intake & requirements template (the "source of truth"). |
| [`docs/blank-intake-form.md`](docs/blank-intake-form.md) | A clean, fillable version of the form for requestors to copy and complete. |
| [`docs/reference/raci-matrix.md`](docs/reference/raci-matrix.md) | The stakeholder RACI model — who is Responsible, Accountable, Consulted, Informed at each phase. |
| [`docs/reference/engagement-decision-matrix.md`](docs/reference/engagement-decision-matrix.md) | The decision logic: which triggers pull in which teams, plus the Work Type Classifier (lead-team ownership). |
| [`docs/reference/phase-gates.md`](docs/reference/phase-gates.md) | The phase-gate model and approval definitions. |
| [`docs/power-platform/technical-spec.md`](docs/power-platform/technical-spec.md) | The implementation design: Dataverse tables, Power Apps screen specs, Power Automate flows, and Power Fx routing logic. |

## How the process works

```
  Intake  ─►  Analysis  ─►  Design  ─►  Development  ─►  Testing  ─►  Deployment  ─►  Production
    │            │            │             │              │             │
   Intake     Governance   Architecture  (Dev work)      UAT        Production
  Approval    Approval     Approval                    Approval      Approval
```

1. **Requestor** submits an intake (the form). They answer business-need and
   data-assessment questions — not technical design questions.
2. **Engagement logic** (Section 15 / the decision matrix) determines which
   teams are automatically pulled in based on the answers.
3. **Work Type Classifier** assigns a single accountable lead team so work
   doesn't bounce between groups.
4. **Phase gates** (Section 16) require explicit approvals to advance, giving
   Governance, Architecture, Security, and IT Controls defined checkpoints.
5. **Stakeholder RACI** keeps everyone clear on their role at each phase.

## Why this framework (vs. a traditional BRD)

A classic Business Requirements Document assumes you already know the solution
and just need to document it. A maturing data organization has a different,
earlier problem: *making sure the right teams are engaged and that work is owned,
governed, and not duplicated.* This framework front-loads that engagement and
governance decisioning, then carries it through delivery with phase gates.

## Getting started (manual / today)

1. Copy [`docs/blank-intake-form.md`](docs/blank-intake-form.md) for each new request.
2. Use [`docs/reference/engagement-decision-matrix.md`](docs/reference/engagement-decision-matrix.md)
   to determine required teams and the lead team.
3. Track approvals using the phase gates in
   [`docs/reference/phase-gates.md`](docs/reference/phase-gates.md).

## Getting started (automated / target state)

Follow [`docs/power-platform/technical-spec.md`](docs/power-platform/technical-spec.md)
to stand up the Dataverse data model, the canvas app, and the Power Automate
flows that automate routing, approvals, document generation, and notifications.
