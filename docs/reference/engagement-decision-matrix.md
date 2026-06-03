# Engagement Decision Matrix & Work Type Classifier

This is the **decision logic** that turns intake answers into (a) the set of
teams that must be engaged and (b) the single lead team accountable for delivery.
It is the brain of the framework — implemented manually today, automated via
Power Automate in the target state (see
[`../power-platform/technical-spec.md`](../power-platform/technical-spec.md)).

---

## Part A — Engagement Triggers

Each trigger is derived from a specific intake answer. When the condition is
true, the listed teams are automatically added to the initiative. Teams are
**additive** — evaluate every trigger and take the union of all required teams.

| # | Trigger | Source Field | Required Teams |
| - | ------- | ------------ | -------------- |
| 1 | New Data Source | §4 New Data Source = Yes | Data Governance, Architecture, Data Engineering |
| 2 | New API | §7 New API = Yes | Architecture, Data Engineering, Security |
| 3 | Dashboard Request | §3 Dashboard / §9 Dashboard = Yes | BI Development, Data Analyst |
| 4 | New KPI | §6 New KPI = Yes | Data Governance, Business Data Owner |
| 5 | New Metric Definition | §6 New definitions = Yes | Data Governance |
| 6 | Regulatory Data | §4 Regulatory / §8 Regulatory = Yes | Data Governance, Security, IT Controls |
| 7 | Vendor Data | §4 Vendor present / §3 Vendor Integration | Vendor Management, Data Governance |
| 8 | Customer Data | §4 Customer Data = Yes | Security, Data Governance |
| 9 | Employee Data | §4 Employee Data = Yes | Security, Data Governance, IT Controls |
| 10 | New Integration | §7 New Integration = Yes | Architecture, Data Engineering |
| 11 | New Database Objects | §7 New DB Objects = Yes | Architecture, Data Engineering |
| 12 | Financial Reporting | §3/§9 reporting + §4 Financial | BI Development, Data Governance, IT Controls |
| 13 | Sensitive Data | §8 Sensitive Data = Yes | Security |
| 14 | AI / ML | §3 AI/ML or Predictive Analytics | Architecture, BI Development, Data Governance |

**Always engaged (baseline):** Business Stakeholder, PMO.

### Worked example

A request for a **customer-churn dashboard** that needs a **new Snowflake
source** and creates a **new "Churn Rate" KPI** on **customer data**:

- Trigger 1 (new source) → Data Governance, Architecture, Data Engineering
- Trigger 3 (dashboard) → BI Development, Data Analyst
- Trigger 4 (new KPI) → Data Governance, Business Data Owner
- Trigger 8 (customer data) → Security, Data Governance

**Union of required teams:** Business Stakeholder, PMO, Data Governance,
Architecture, Data Engineering, BI Development, Data Analyst, Security,
Business Data Owner.

---

## Part B — Work Type Classifier (Lead-Team Ownership)

The engagement triggers say *who is involved*. The classifier says *who is
accountable* — the single lead team that owns delivery so work doesn't bounce
between groups. Evaluate top-to-bottom; the **first matching row wins** as the
primary lead. Secondary teams remain engaged via Part A.

| Priority | Request Characteristic | Lead Team | Supporting Teams |
| :------: | ---------------------- | --------- | ---------------- |
| 1 | AI / ML / Predictive Analytics | Architecture | BI Development, Data Governance |
| 2 | New Integration / API | Architecture | Data Engineering |
| 3 | Data Pipeline / ETL / New Data Source | Data Engineering | Architecture, Data Governance |
| 4 | Data Quality Initiative | Data Governance | Data Engineering |
| 5 | KPI / Metric Definition / Governance Initiative | Data Governance | Business Data Owner |
| 6 | Dashboard / Report (existing data) | BI Development | Data Analyst |
| 7 | Ad-hoc Data Analysis | Data Analyst | BI Development |

> **Tie-breaking principle:** infrastructure/architecture concerns outrank
> presentation concerns. A dashboard that *also* needs a new pipeline is led by
> Data Engineering (row 3), with BI Development as a supporting team — because the
> pipeline is the riskier, more foundational work.

---

## Part C — Mandatory Review Gates by Data Sensitivity

Independent of the lead team, these reviews become **required gates** (cannot be
waived) when the condition is true:

| Condition | Mandatory Gate |
| --------- | -------------- |
| Sensitive / Customer / Employee / Restricted data | Security Review before Production approval |
| Regulatory data (SOX, GDPR, HIPAA, PCI) | IT Controls sign-off at Governance and Production gates |
| Financial reporting | IT Controls sign-off (SOX scope) |
| New KPI or metric definition | Data Governance definition approval before Development |

---

## Part D — Decision Pseudocode

```text
required_teams = { "Business Stakeholder", "PMO" }

# Part A — additive engagement
if NewDataSource:        required_teams += { Governance, Architecture, DataEngineering }
if NewAPI:               required_teams += { Architecture, DataEngineering, Security }
if Dashboard:            required_teams += { BIDevelopment, DataAnalyst }
if NewKPI:               required_teams += { Governance, BusinessDataOwner }
if RegulatoryData:       required_teams += { Governance, Security, ITControls }
if VendorData:           required_teams += { VendorManagement, Governance }
if CustomerData:         required_teams += { Security, Governance }
if EmployeeData:         required_teams += { Security, Governance, ITControls }
if NewIntegration:       required_teams += { Architecture, DataEngineering }
if NewDatabaseObjects:   required_teams += { Architecture, DataEngineering }
if FinancialReporting:   required_teams += { BIDevelopment, Governance, ITControls }
if SensitiveData:        required_teams += { Security }
if AI_ML:                required_teams += { Architecture, BIDevelopment, Governance }

# Part B — single accountable lead (first match wins)
lead_team = first_match([
  (AI_ML or Predictive,                 Architecture),
  (NewIntegration or NewAPI,            Architecture),
  (DataPipeline or ETL or NewDataSource,DataEngineering),
  (DataQuality,                         Governance),
  (NewKPI or GovernanceInitiative,      Governance),
  (Dashboard or Report,                 BIDevelopment),
  (DataAnalysis,                        DataAnalyst),
], default = PMO_triage)

# Part C — mandatory gates
mandatory_gates = []
if Sensitive or Customer or Employee or Restricted: mandatory_gates += SecurityReview
if Regulatory or FinancialReporting:                mandatory_gates += ITControlsSignoff
if NewKPI or NewMetricDefinition:                   mandatory_gates += GovernanceDefinitionApproval
```
