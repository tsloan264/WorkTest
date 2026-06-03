# Phase Gate Model

Initiatives advance through eight statuses, controlled by six approval gates.
A gate is a **hard stop**: work on the next phase does not begin until the gate
is approved. Each gate has a defined approver, entry criteria, and exit criteria.

```
Intake ─►[Intake Gate]─► Analysis ─►[Governance Gate]─► Design ─►[Architecture Gate]─►
Development ─►[Development Gate]─► Testing ─►[UAT Gate]─► Deployment ─►[Production Gate]─►
Production Support ─► Closed
```

| Status | Description |
| ------ | ----------- |
| Intake | Request submitted, awaiting triage. |
| Analysis | Business need validated; teams engaged; requirements being gathered. |
| Design | Governance + architecture design in progress. |
| Development | Build underway. |
| Testing | Unit/system/UAT/performance testing. |
| Deployment | Promotion to production. |
| Production Support | Live; in hypercare/support. |
| Closed | Benefits realized; documentation complete. |

---

## The six gates

### 1. Intake Approval
- **Approver:** PMO / Intake Owner (with Business Sponsor)
- **Entry:** Sections 1–4 complete.
- **Exit criteria:** Problem and outcome are clear; not a duplicate of existing
  work or an in-flight request; priority assigned; required teams determined via
  the [decision matrix](engagement-decision-matrix.md).
- **Advances to:** Analysis.

### 2. Governance Approval
- **Approver:** Data Governance Lead
- **Entry:** Sections 4–6 complete; Business + Technical Data Owners named.
- **Exit criteria:** Data ownership confirmed; definitions/KPIs approved or
  scheduled; data quality and retention requirements defined; classification
  validated.
- **Advances to:** Design.

### 3. Architecture Approval
- **Approver:** Lead Architect
- **Entry:** Section 7 complete; impacted systems identified.
- **Exit criteria:** Integration/API/database approach agreed; architectural
  risks documented with mitigations; aligns with reference architecture and
  standards.
- **Advances to:** Development.

### 4. Development Approval
- **Approver:** Lead Delivery Team Manager
- **Entry:** Sections 10–11 complete; acceptance criteria defined.
- **Exit criteria:** Build complete; unit/system tests passing; documentation
  drafted; ready for UAT.
- **Advances to:** Testing.

### 5. UAT Approval
- **Approver:** Business Stakeholder
- **Entry:** Build deployed to a test environment; acceptance criteria testable.
- **Exit criteria:** All acceptance criteria met; business sign-off recorded;
  IT Controls sign-off if regulatory/financial.
- **Advances to:** Deployment.

### 6. Production Approval
- **Approver:** Architecture (with Security + IT Controls as required)
- **Entry:** UAT approved; deployment plan ready.
- **Exit criteria:** Security review complete (if mandated); change approved;
  monitoring/support in place.
- **Advances to:** Production Support → Closed.

---

## Gate decision log (per initiative)

| Gate | Decision | Approver | Date | Notes |
| ---- | -------- | -------- | ---- | ----- |
| Intake | ☐ Approved ☐ Rejected | | | |
| Governance | ☐ Approved ☐ Rejected | | | |
| Architecture | ☐ Approved ☐ Rejected | | | |
| Development | ☐ Approved ☐ Rejected | | | |
| UAT | ☐ Approved ☐ Rejected | | | |
| Production | ☐ Approved ☐ Rejected | | | |

> **Rejected** at any gate routes the initiative back to the prior phase with
> documented reasons, or to Closed if withdrawn. Conditional approvals should be
> recorded in Notes with the condition and owner.
