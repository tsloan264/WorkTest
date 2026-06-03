# Stakeholder RACI Model

This is the **default** RACI for data & analytics initiatives. Adjust per
initiative in Section 14 of the intake, but start here so roles are consistent.

**Legend**

- **R — Responsible:** Does the work.
- **A — Accountable:** Owns the outcome; one per row of work (the buck stops here).
- **C — Consulted:** Provides input before decisions/work (two-way).
- **I — Informed:** Kept up to date on progress/decisions (one-way).

## RACI by delivery phase

### Intake & Analysis

| Team | Role |
| ---- | ---- |
| Business Stakeholder | A |
| PMO | R |
| Data Governance | C |
| Lead Delivery Team (per Work Type Classifier) | C |
| Architecture | I |
| Security | I |

### Governance Review

| Team | Role |
| ---- | ---- |
| Data Governance | A/R |
| Business Data Owner | C |
| Technical Data Owner | C |
| Data Engineering | C |
| IT Controls | C (if regulatory/financial) |

### Architecture & Design

| Team | Role |
| ---- | ---- |
| Architecture | A/R |
| Data Engineering | R |
| Security | C |
| Data Governance | C |
| BI Development | C (if reporting in scope) |

### Development

| Team | Role |
| ---- | ---- |
| Lead Delivery Team | A/R |
| Data Engineering | R (pipelines/integration) |
| BI Development | R (dashboards/reports) |
| Data Analyst | C |
| Architecture | C |
| Data Governance | I |

### Testing & UAT

| Team | Role |
| ---- | ---- |
| Business Stakeholder | A (UAT sign-off) |
| Lead Delivery Team | R |
| Data Analyst | C |
| IT Controls | C (if regulatory/financial) |

### Deployment & Production

| Team | Role |
| ---- | ---- |
| Architecture | A |
| Data Engineering | R |
| Security | C |
| IT Controls | C (if regulatory/financial) |
| Business Stakeholder | I |
| PMO | I |

## Full-lifecycle summary

| Team | Intake | Governance | Architecture | Development | Testing | Production |
| ---- | :----: | :--------: | :----------: | :---------: | :-----: | :--------: |
| Business Stakeholder | A | C | I | I | A | I |
| Data Governance | C | A/R | C | I | I | I |
| Data Engineering | I | C | R | R | C | R |
| BI Development | I | I | C | R | R | C |
| Data Analyst | C | I | I | C | C | I |
| Architecture | I | I | A/R | C | I | A |
| Security | I | C | C | I | I | C |
| IT Controls | I | C | I | I | C | C |
| Vendor Management | C | C | I | I | I | I |
| PMO | R | I | I | I | I | I |

> Rule of thumb: exactly **one A per phase**. If two teams both think they're
> accountable, resolve it at the Intake gate — that ambiguity is exactly what
> this framework exists to prevent.
