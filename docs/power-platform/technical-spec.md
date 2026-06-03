# Power Platform Technical Specification

Implementation design for the Enterprise Data & Analytics Intake & Requirements
Framework on the Microsoft Power Platform: **Dataverse** (data), **Power Apps**
(canvas intake app), **Power Automate** (routing, approvals, document generation,
notifications), and **Word templates + SharePoint** (output).

This aligns with a Microsoft-native environment and can later integrate with a
Copilot agent for project and executive reporting.

---

## 1. Solution architecture

```
                 ┌────────────────────────────────────────────┐
                 │              Power Apps (Canvas)            │
                 │   8-screen intake + auto stakeholder calc   │
                 └───────────────────┬────────────────────────┘
                                     │ writes
                                     ▼
                 ┌────────────────────────────────────────────┐
                 │                  Dataverse                  │
                 │  ProjectRequests · Stakeholders · Rules ·   │
                 │  Approvals · Risks · DataSources · Reqs     │
                 └───────────────────┬────────────────────────┘
                                     │ triggers (on create/update)
                                     ▼
                 ┌────────────────────────────────────────────┐
                 │               Power Automate                │
                 │  1 Submit · 2 Assign · 3 Approvals ·        │
                 │  4 Doc Gen · 5 Status · 6 Notify            │
                 └───────┬───────────────────────────┬────────┘
                         ▼                           ▼
                 ┌───────────────┐          ┌──────────────────┐
                 │ SharePoint /  │          │   Teams / Email  │
                 │ Word template │          │  notifications   │
                 └───────────────┘          └──────────────────┘
```

---

## 2. Dataverse data model

Publisher prefix assumed: `da_`. Adjust to your environment's prefix.

### 2.1 Tables overview

| Table | Logical name | Purpose |
| ----- | ------------ | ------- |
| Project Requests | `da_projectrequest` | Main intake record (one per request). |
| Stakeholders | `da_stakeholder` | Teams/contacts engaged per request. |
| Decision Rules | `da_decisionrule` | Configurable engagement logic (data-driven). |
| Approvals | `da_approval` | Per-gate approval tracking. |
| Risks | `da_risk` | Risks per request. |
| Data Sources | `da_datasource` | Data inventory references per request. |
| Requirements | `da_requirement` | Generated/derived requirement line items. |

### 2.2 Project Requests (`da_projectrequest`)

Primary table. Columns grouped by intake section.

| Display name | Logical name | Type | Notes |
| ------------ | ------------ | ---- | ----- |
| Request Name | `da_name` | Text (primary) | |
| Requestor | `da_requestor` | Lookup (User) | Default `User()`. |
| Department | `da_department` | Choice | Finance, HR, Supply Chain, Procurement, IT, Sales, Other. |
| Business Sponsor | `da_businesssponsor` | Lookup (User) | People picker. |
| Date Submitted | `da_datesubmitted` | DateOnly | Default `Today()`. |
| Requested Completion | `da_targetdate` | DateOnly | |
| Business Priority | `da_priority` | Choice | Critical, High, Medium, Low. |
| Problem Statement | `da_problemstatement` | Multiline text | |
| Desired Outcome | `da_desiredoutcome` | Multiline text | |
| Business Benefits | `da_benefits` | Choices (multi) | |
| Solution Type | `da_solutiontype` | Choices (multi) | Dashboard, Report, Pipeline, API, … |
| Existing Data Source | `da_existingsource` | Yes/No | |
| New Data Source | `da_newsource` | Yes/No | Engagement trigger. |
| Data Classification | `da_classification` | Choices (multi) | |
| Business Data Owner | `da_businessowner` | Lookup (User) | |
| Technical Data Owner | `da_technicalowner` | Lookup (User) | |
| New KPI | `da_newkpi` | Yes/No | Engagement trigger. |
| New Definition | `da_newdefinition` | Yes/No | |
| New Integration | `da_newintegration` | Yes/No | Engagement trigger. |
| New API | `da_newapi` | Yes/No | Engagement trigger. |
| New DB Objects | `da_newdbobjects` | Yes/No | Engagement trigger. |
| Sensitive Data | `da_sensitivedata` | Yes/No | Engagement trigger. |
| Customer Data | `da_customerdata` | Yes/No | Engagement trigger. |
| Employee Data | `da_employeedata` | Yes/No | Engagement trigger. |
| Regulatory Data | `da_regulatorydata` | Yes/No | Engagement trigger. |
| Vendor Data | `da_vendordata` | Yes/No | Engagement trigger. |
| Regulatory Frameworks | `da_regframeworks` | Choices (multi) | SOX, GDPR, HIPAA, PCI, Internal Controls. |
| Dashboard Required | `da_dashboardreq` | Yes/No | |
| Report Required | `da_reportreq` | Yes/No | |
| Audience | `da_audience` | Text | |
| Refresh Frequency | `da_refresh` | Choice | Real-Time, Hourly, Daily, Weekly, Monthly. |
| Lead Team | `da_leadteam` | Choice | Set by Work Type Classifier. |
| Required Teams | `da_requiredteams` | Choices (multi) | Set by flow. |
| Status | `da_status` | Choice | Intake … Closed (8 values). |
| Current Gate | `da_currentgate` | Choice | Intake, Governance, Architecture, Development, UAT, Production. |
| Requirements Doc | `da_docurl` | URL | Link to generated Word doc. |

> **Status choice values:** `Intake (1)`, `Analysis (2)`, `Design (3)`,
> `Development (4)`, `Testing (5)`, `Deployment (6)`, `Production Support (7)`,
> `Closed (8)`.

### 2.3 Stakeholders (`da_stakeholder`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `da_name` | Text | Team or person label. |
| `da_request` | Lookup → ProjectRequest | Parent. |
| `da_team` | Choice | Data Governance, Data Engineering, BI Development, … |
| `da_raci` | Choice | Responsible, Accountable, Consulted, Informed. |
| `da_contact` | Lookup (User) | Assigned individual. |
| `da_source` | Choice | Auto (rule) / Manual. |

### 2.4 Decision Rules (`da_decisionrule`)

Makes engagement logic **data-driven** so it can change without editing flows.

| Column | Type | Notes |
| ------ | ---- | ----- |
| `da_name` | Text | e.g., "New Data Source". |
| `da_triggerfield` | Text | Logical name of the boolean/choice to evaluate, e.g., `da_newsource`. |
| `da_triggervalue` | Text | Value that fires the rule (e.g., `true`). |
| `da_teams` | Choices (multi) | Teams to add when fired. |
| `da_isleadcandidate` | Yes/No | Whether this rule can set the lead team. |
| `da_leadteam` | Choice | Lead team if this rule wins. |
| `da_priority` | Whole number | Lower = evaluated first for lead selection. |
| `da_active` | Yes/No | Enable/disable without deletion. |

> Seed this table from
> [`../reference/engagement-decision-matrix.md`](../reference/engagement-decision-matrix.md)
> (Parts A and B).

### 2.5 Approvals (`da_approval`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `da_request` | Lookup → ProjectRequest | Parent. |
| `da_gate` | Choice | Intake, Governance, Architecture, Development, UAT, Production. |
| `da_approver` | Lookup (User) | |
| `da_decision` | Choice | Pending, Approved, Rejected. |
| `da_decisiondate` | DateTime | |
| `da_comments` | Multiline text | |

### 2.6 Risks (`da_risk`) and Data Sources (`da_datasource`)

**Risks:** `da_request` (lookup), `da_description`, `da_impact` (choice
High/Medium/Low), `da_mitigation`, `da_owner` (user), `da_status`.

**Data Sources:** `da_request` (lookup), `da_sourcename`, `da_systemowner`
(user), `da_vendor`, `da_isnew` (yes/no), `da_classification` (choices).

### 2.7 Requirements (`da_requirement`)

`da_request` (lookup), `da_category` (choice: Business/Data/Governance/
Architecture/Security/Reporting/Testing), `da_text` (multiline),
`da_acceptancecriteria` (multiline), `da_priority`.

---

## 3. Power Apps canvas app — screen specs

Eight screens. Navigation is linear with a progress indicator; validation gates
the **Next** button on each screen.

### Screen 1 — Project Intake (General)
- `txtProjectName` (Text input) → `da_name`
- `drpBusinessArea` (Dropdown) → `da_department`
- `lblRequestor` (Label, read-only) = `User().FullName`
- `pplSponsor` (People picker) → `da_businesssponsor`
- `radPriority` (Radio: Critical/High/Medium/Low) → `da_priority`
- `dtTarget` (Date picker) → `da_targetdate`

### Screen 2 — Business Need
- `txtAccomplish` (multiline) → `da_desiredoutcome`
- `txtProblem` (multiline) → `da_problemstatement`
- `chkBenefits` (checkbox group) → `da_benefits`

### Screen 3 — Data Assessment
- `tglExistingSource` (Toggle) → `da_existingsource`
  - If Yes: `cmbSourceSystems` (multi-select combo: Snowflake, SAP, Coupa,
    Beeline, Workday, SQL Server) → child `da_datasource` rows.
- `tglNewSource` (Toggle) → `da_newsource`
  - If Yes: `txtVendor`, `txtSystemName`, `pplDataOwner`.

### Screen 4 — Solution Type
- `chkSolutionType` (checkbox group) → `da_solutiontype`
  (Dashboard, Report, API, Data Pipeline, DW Enhancement, Governance Initiative,
  AI Solution, Automation).

### Screen 5 — Governance Assessment (toggles)
- `tglNewKPI` → `da_newkpi`
- `tglNewMetric` → `da_newdefinition`
- `tglRegulatory` → `da_regulatorydata`
- `tglSensitive` → `da_sensitivedata`
- `tglCustomer` → `da_customerdata`
- `tglEmployee` → `da_employeedata`
- `tglVendor` → `da_vendordata`

### Screen 6 — Architecture Assessment (toggles)
- `tglNewIntegration` → `da_newintegration`
- `tglNewAPI` → `da_newapi`
- `tglNewDBObjects` → `da_newdbobjects`
- `tglInfraChange` → (optional) `da_infrachange`

### Screen 7 — Stakeholder Auto-Determination (read-only)
Calculates required teams client-side for immediate feedback, then the flow
re-evaluates authoritatively on submit. See Power Fx in §4.

### Screen 8 — Review & Submit
- Read-only summary: project, required stakeholders, lead team, approval path.
- `btnSubmit`: `SubmitForm`/`Patch` then `Navigate(ConfirmationScreen)`.

---

## 4. Power Fx — client-side stakeholder calculation

Computed in `OnVisible` of Screen 7 for instant feedback. Mirrors Part A of the
decision matrix. (The authoritative calculation runs server-side in Flow 2 so
the app and the rules can never drift if rules change in Dataverse.)

```powerfx
// Screen7.OnVisible — build the required-teams collection
ClearCollect(
    RequiredTeams,
    // Baseline
    { Team: "Business Stakeholder" },
    { Team: "PMO" }
);

// Additive engagement triggers
If(tglNewSource.Value,
    Collect(RequiredTeams,
        { Team: "Data Governance" },
        { Team: "Data Engineering" },
        { Team: "Architecture" }));

If(tglNewAPI.Value,
    Collect(RequiredTeams,
        { Team: "Architecture" },
        { Team: "Data Engineering" },
        { Team: "Security" }));

If("Dashboard" in chkSolutionType.SelectedItems.Value,
    Collect(RequiredTeams,
        { Team: "BI Development" },
        { Team: "Data Analyst" }));

If(tglNewKPI.Value,
    Collect(RequiredTeams,
        { Team: "Data Governance" },
        { Team: "Business Data Owner" }));

If(tglRegulatory.Value,
    Collect(RequiredTeams,
        { Team: "Data Governance" },
        { Team: "Security" },
        { Team: "IT Controls" }));

If(tglVendor.Value,
    Collect(RequiredTeams,
        { Team: "Vendor Management" },
        { Team: "Data Governance" }));

If(tglSensitive.Value || tglCustomer.Value,
    Collect(RequiredTeams, { Team: "Security" }));

If(tglEmployee.Value,
    Collect(RequiredTeams,
        { Team: "Security" },
        { Team: "Data Governance" },
        { Team: "IT Controls" }));

If(tglNewIntegration.Value || tglNewDBObjects.Value,
    Collect(RequiredTeams,
        { Team: "Architecture" },
        { Team: "Data Engineering" }));

// De-duplicate for display
ClearCollect(RequiredTeamsDistinct, Distinct(RequiredTeams, Team));
```

```powerfx
// Lead team (Work Type Classifier — first match wins)
Set(varLeadTeam,
    If(tglNewAPI.Value || tglNewIntegration.Value, "Architecture",
    If(tglNewSource.Value, "Data Engineering",
    If(tglNewKPI.Value, "Data Governance",
    If("Dashboard" in chkSolutionType.SelectedItems.Value, "BI Development",
    "PMO (triage)")))));
```

---

## 5. Power Automate flows

### Flow 1 — New Request Submitted
- **Trigger:** Dataverse *When a row is added* (`da_projectrequest`).
- **Steps:** Validate required fields → set `da_status = Intake`,
  `da_currentgate = Intake` → call Flow 2 (child) → call Flow 4 (doc gen) →
  call Flow 6 (notify).

### Flow 2 — Stakeholder Assignment (authoritative)
- **Trigger:** Child flow (called by Flow 1) or *When a row is modified*.
- **Logic:**
  1. `List rows` from `da_decisionrule` where `da_active = true`, ordered by
     `da_priority`.
  2. For each rule, evaluate `da_triggerfield` on the request against
     `da_triggervalue`. If matched, union `da_teams` into the required set and,
     if `da_isleadcandidate` and no lead yet, set `da_leadteam`.
  3. Upsert `da_stakeholder` rows (avoid duplicates), tagging `da_source = Auto`.
  4. Patch `da_requiredteams` and `da_leadteam` back onto the request.

  ```text
  Pseudocode (Apply to each rule):
    IF item(da_active) = true:
       fieldValue = triggerOutputs(request)[item(da_triggerfield)]
       IF string(fieldValue) == item(da_triggervalue):
           requiredTeams = union(requiredTeams, item(da_teams))
           IF item(da_isleadcandidate) AND empty(leadTeam):
               leadTeam = item(da_leadteam)
  ```

### Flow 3 — Approval Routing (phase gates)
- **Trigger:** *When a row is modified* on `da_projectrequest` where
  `da_currentgate` changes.
- **Steps:** Create an `da_approval` row for the current gate → start an
  **Approvals** action routed to the gate's approver (see
  [`../reference/phase-gates.md`](../reference/phase-gates.md)) → on **Approve**,
  advance `da_status`/`da_currentgate` to the next gate → on **Reject**, set
  status back and notify requestor. Enforce mandatory gates (Security/IT
  Controls) from Part C before allowing Production.

### Flow 4 — Generate Requirements Document
- **Trigger:** Child flow (called by Flow 1) and on major updates.
- **Steps:** *Populate a Microsoft Word template* (content-control mapped to the
  request + child rows) → create file in SharePoint
  `Data & Analytics Intake / {Request Name} / Project Requirements Document.docx`
  → patch `da_docurl` back to the request.

### Flow 5 — Status Updates
- **Trigger:** *When a row is modified* where `da_status` changes.
- **Steps:** Post status change to the request's Teams channel/thread; update any
  Planner/Azure DevOps work items if integrated.

### Flow 6 — Notifications
- **Trigger:** Child flow (called by Flow 1) and on assignment changes.
- **Steps:** Post an adaptive card to the **Data & Analytics Intake** Teams
  channel:

  ```
  New Analytics Project Intake Submitted
  • Project:        @{request.da_name}
  • Requestor:      @{request.da_requestor}
  • Lead Team:      @{request.da_leadteam}
  • Required Teams: @{join(requiredTeams, ', ')}
  • Due Date:       @{request.da_targetdate}
  ```

  → send email to each assigned stakeholder's contact.

---

## 6. Word template content controls

Map these plain-text/repeating content controls in the Word template used by
Flow 4:

| Control | Source |
| ------- | ------ |
| `ProjectName` | `da_name` |
| `Requestor` | `da_requestor` |
| `ProblemStatement` | `da_problemstatement` |
| `DesiredOutcome` | `da_desiredoutcome` |
| `LeadTeam` | `da_leadteam` |
| `RequiredTeams` | repeating: `da_stakeholder` |
| `Risks` (table) | repeating: `da_risk` |
| `DataSources` (table) | repeating: `da_datasource` |
| `Requirements` (table) | repeating: `da_requirement` |
| `Approvals` (table) | repeating: `da_approval` |

---

## 7. Security & ALM notes

- **Security roles:** Requestor (create/read own), Reviewer per team
  (read/update assigned), Governance/Architecture/Security approvers
  (gate-specific update), Admin (manage `da_decisionrule`).
- **Environments:** Build in Dev → export **managed** solution → Test → Prod.
  Keep `da_decisionrule` data as a configuration-migration (e.g., via the
  Configuration Migration tool) so rule changes promote cleanly.
- **Auditing:** Enable Dataverse auditing on `da_projectrequest` and
  `da_approval` to support IT Controls / SOX evidence.
- **Future Copilot integration:** Expose `da_projectrequest` and `da_approval`
  to a Copilot Studio agent for natural-language status and executive reporting
  ("show all initiatives pending Architecture approval over 5 days").

---

## 8. Build order (suggested)

1. Create Dataverse tables (§2) and seed `da_decisionrule` from the
   [decision matrix](../reference/engagement-decision-matrix.md).
2. Build the canvas app screens (§3) with client-side calc (§4).
3. Build Flow 2 (authoritative routing) and test against seeded rules.
4. Add Flow 1 → 6 wiring; build the Word template (§6) and Flow 4.
5. Add Flow 3 approvals and wire phase-gate transitions.
6. Harden security/ALM (§7), then promote to Test/Prod.
