# Enterprise Data & Analytics Project Intake & Requirements Template

> **Purpose:** Ensure the right people are involved at the right time, eliminate
> duplicate efforts, establish clear ownership, and create a repeatable delivery
> process for all data and analytics initiatives.

This is the **annotated source-of-truth template**. Each section includes guidance
(in italics) explaining what it captures and who uses it. For a clean, fillable
copy, use [`blank-intake-form.md`](blank-intake-form.md).

---

## SECTION 1: REQUEST INFORMATION

*Captured by the requestor. Establishes identity, urgency, and the SLA clock.*

| Field | Value |
| ----- | ----- |
| **Request Name** | |
| **Requestor** | |
| **Department** | |
| **Date Submitted** | |
| **Requested Completion Date** | |

**Business Priority**

- ☐ Critical
- ☐ High
- ☐ Medium
- ☐ Low

---

## SECTION 2: BUSINESS NEED

*The most important section. Written in business terms — no solutioning yet.
Reviewed at the Intake gate to confirm the request is worth pursuing.*

### Business Problem Statement
*What problem are we trying to solve?*

> _________________________________________________

### Desired Outcome
*What does success look like? State it as an observable result.*

> _________________________________________________

### Business Benefits
*Select all that apply. Used for prioritization and benefit tracking.*

- ☐ Cost Reduction
- ☐ Time Savings
- ☐ Compliance
- ☐ Improved Reporting
- ☐ Improved Data Quality
- ☐ Automation
- ☐ Customer Experience
- ☐ Risk Reduction
- ☐ Other: ____________________

---

## SECTION 3: SOLUTION TYPE

*Select all that apply. Drives the Work Type Classifier (lead team) and several
engagement triggers.*

- ☐ Dashboard
- ☐ Report
- ☐ Data Pipeline
- ☐ API Integration
- ☐ Data Warehouse Enhancement
- ☐ Data Quality Initiative
- ☐ Data Governance Initiative
- ☐ Master Data Management
- ☐ Predictive Analytics
- ☐ AI / Machine Learning
- ☐ Vendor Integration
- ☐ Other: ____________________

---

## SECTION 4: DATA ASSESSMENT

*Determines whether Data Engineering, Architecture, and Vendor Management must
be engaged. "New data source" is one of the strongest engagement triggers.*

### Existing Data Source?
- ☐ Yes  ☐ No

If yes, identify source(s):
> _________________________________________________

### New Data Source Required?
- ☐ Yes  ☐ No

If yes:

| Field | Value |
| ----- | ----- |
| Source Name | |
| System Owner | |
| Vendor | |

### Data Classification
*Drives Security, Governance, and IT Controls engagement.*

- ☐ Public
- ☐ Internal
- ☐ Confidential
- ☐ Restricted
- ☐ Financial
- ☐ Customer Data
- ☐ Employee Data
- ☐ Regulatory Data

---

## SECTION 5: DATA OWNERSHIP

*Establishes accountability. No initiative advances past Governance approval
without a named Business and Technical Data Owner.*

| Role | Name |
| ---- | ---- |
| **Business Data Owner** | |
| **Technical Data Owner** | |

**Steward Assigned?** ☐ Yes ☐ No — Name: ____________________

---

## SECTION 6: GOVERNANCE REVIEW

*Completed with Data Governance. Confirms definitions, KPIs, quality, and
retention before build begins.*

| Question | Answer |
| -------- | ------ |
| Does data currently have approved definitions? | ☐ Yes ☐ No |
| New business definitions required? | ☐ Yes ☐ No |
| New KPI creation? | ☐ Yes ☐ No |

### Data Quality Requirements
> _________________________________________________

### Data Retention Requirements
> _________________________________________________

---

## SECTION 7: ARCHITECTURE REVIEW

*Completed with Architecture + Data Engineering. Surfaces integration, API,
and database impacts and the associated risks.*

| Question | Answer |
| -------- | ------ |
| New Integration Required? | ☐ Yes ☐ No |
| New API Required? | ☐ Yes ☐ No |
| New Database Objects Required? | ☐ Yes ☐ No |

### Impacted Systems
> _________________________________________________

### Architectural Risks
> _________________________________________________

---

## SECTION 8: SECURITY & COMPLIANCE

*Completed with Security and IT Controls. Any "Yes" on sensitive/regulatory
data mandates a Security Review before Production approval.*

| Question | Answer |
| -------- | ------ |
| Sensitive Data Included? | ☐ Yes ☐ No |
| Security Review Required? | ☐ Yes ☐ No |

**Regulatory Requirements**

- ☐ SOX
- ☐ GDPR
- ☐ HIPAA
- ☐ PCI
- ☐ Internal Controls
- ☐ Other: ____________________

---

## SECTION 9: REPORTING REQUIREMENTS

*Completed with BI Development. Only relevant if a dashboard or report is in
scope.*

| Question | Answer |
| -------- | ------ |
| Dashboard Required? | ☐ Yes ☐ No |
| Report Required? | ☐ Yes ☐ No |

**Intended Audience:** ____________________

### Key Metrics Required
> _________________________________________________

**Refresh Frequency**

- ☐ Real-Time
- ☐ Hourly
- ☐ Daily
- ☐ Weekly
- ☐ Monthly

---

## SECTION 10: DEVELOPMENT REQUIREMENTS

*Scopes the build. Used by the lead team to estimate effort.*

- ☐ Data Modeling
- ☐ ETL/ELT
- ☐ API Development
- ☐ Report Development
- ☐ Dashboard Development
- ☐ Data Validation
- ☐ Automation
- ☐ Documentation

---

## SECTION 11: TESTING REQUIREMENTS

*Defines what "done" means. Acceptance criteria are the basis of UAT approval.*

**Testing Required**

- ☐ Unit Testing
- ☐ System Testing
- ☐ User Acceptance Testing
- ☐ Performance Testing
- ☐ Data Validation

### Acceptance Criteria
1.
2.
3.
4.
5.

---

## SECTION 12: RISKS

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| | | |
| | | |
| | | |

---

## SECTION 13: DEPENDENCIES

| Dependency | Owner | Status |
| ---------- | ----- | ------ |
| | | |
| | | |
| | | |

---

## SECTION 14: STAKEHOLDER MATRIX

*Mark each team's role for this initiative. See
[`reference/raci-matrix.md`](reference/raci-matrix.md) for the default model.*

| Team | Responsible | Accountable | Consulted | Informed |
| ---- | ----------- | ----------- | --------- | -------- |
| Business Stakeholder | | | | |
| Data Governance | | | | |
| Data Engineering | | | | |
| BI Development | | | | |
| Data Analyst | | | | |
| Architect | | | | |
| Security | | | | |
| IT Controls | | | | |
| Vendor Management | | | | |
| PMO | | | | |

---

## SECTION 15: ENGAGEMENT DECISION MATRIX

*Auto-evaluated from the answers above. See
[`reference/engagement-decision-matrix.md`](reference/engagement-decision-matrix.md)
for the full logic.*

| Trigger | Required Teams |
| ------- | -------------- |
| New Data Source | Data Governance, Architecture, Data Engineering |
| New API | Architecture, Data Engineering, Security |
| Dashboard Request | BI Development, Business Analyst |
| New KPI | Data Governance, Business Owner |
| Regulatory Data | Governance, Security, IT Controls |
| Vendor Data | Vendor Management, Governance |
| Customer Data | Security, Governance |
| New Integration | Architecture, Data Engineering |
| New Database Objects | Architecture, Data Engineering |
| Financial Reporting | BI Development, Governance, IT Controls |

---

## SECTION 16: PHASE GATE APPROVALS

*Each gate must be explicitly approved to advance. See
[`reference/phase-gates.md`](reference/phase-gates.md).*

| Gate | Decision | Approver | Date |
| ---- | -------- | -------- | ---- |
| Intake Approval | ☐ Approved ☐ Rejected | | |
| Governance Approval | ☐ Approved ☐ Rejected | | |
| Architecture Approval | ☐ Approved ☐ Rejected | | |
| Development Approval | ☐ Approved ☐ Rejected | | |
| UAT Approval | ☐ Approved ☐ Rejected | | |
| Production Approval | ☐ Approved ☐ Rejected | | |

---

## PROJECT STATUS

- ☐ Intake
- ☐ Analysis
- ☐ Design
- ☐ Development
- ☐ Testing
- ☐ Deployment
- ☐ Production Support
- ☐ Closed
