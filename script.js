const sections = [...document.querySelectorAll('.form-section')];
const form = document.querySelector('#intakeForm');
const sectionNav = document.querySelector('#sectionNav');
const progressValue = document.querySelector('#progressValue');
const progressBar = document.querySelector('#progressBar');
const requiredTeams = document.querySelector('#requiredTeams');
const summaryPanel = document.querySelector('#summaryPanel');
const toast = document.querySelector('#toast');

const decisionRules = [
  { trigger: 'New Data Source', teams: ['Data Governance', 'Architecture', 'Data Engineering'], test: data => data.newDataSource === 'Yes' },
  { trigger: 'New API', teams: ['Architecture', 'Data Engineering', 'Security'], test: data => data.newApi === 'Yes' || data.solutionType.includes('API Integration') },
  { trigger: 'Dashboard Request', teams: ['BI Development', 'Business Analyst'], test: data => data.dashboardRequired === 'Yes' || data.solutionType.includes('Dashboard') },
  { trigger: 'New KPI', teams: ['Data Governance', 'Business Owner'], test: data => data.newKpi === 'Yes' },
  { trigger: 'Regulatory Data', teams: ['Governance', 'Security', 'IT Controls'], test: data => data.classification.includes('Regulatory Data') || data.regulatory.length > 0 },
  { trigger: 'Vendor Data', teams: ['Vendor Management', 'Governance'], test: data => data.solutionType.includes('Vendor Integration') || Boolean(data.vendor) },
  { trigger: 'Customer Data', teams: ['Security', 'Governance'], test: data => data.classification.includes('Customer Data') },
  { trigger: 'New Integration', teams: ['Architecture', 'Data Engineering'], test: data => data.newIntegration === 'Yes' || data.solutionType.includes('Data Pipeline') },
  { trigger: 'New Database Objects', teams: ['Architecture', 'Data Engineering'], test: data => data.newDatabaseObjects === 'Yes' || data.solutionType.includes('Data Warehouse Enhancement') },
  { trigger: 'Financial Reporting', teams: ['BI Development', 'Governance', 'IT Controls'], test: data => data.classification.includes('Financial') || data.regulatory.includes('SOX') }
];

const raciTeams = ['Business Stakeholder', 'Data Governance', 'Data Engineering', 'BI Development', 'Data Analyst', 'Architect', 'Security', 'IT Controls', 'Vendor Management', 'PMO'];
const approvals = ['Intake Approval', 'Governance Approval', 'Architecture Approval', 'Development Approval', 'UAT Approval', 'Production Approval'];

function init() {
  sections.forEach((section, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#${section.id}">${String(index + 1).padStart(2, '0')}. ${section.dataset.title}</a>`;
    sectionNav.appendChild(li);
  });
  buildEditableRows('riskRows', ['risk', 'impact', 'mitigation'], 3);
  buildEditableRows('dependencyRows', ['dependency', 'owner', 'status'], 3);
  buildRaciRows();
  buildDecisionRows();
  buildApprovalRows();
  document.querySelector('[name="dateSubmitted"]').valueAsDate = new Date();
  refresh();
}

function buildEditableRows(targetId, fields, count) {
  const target = document.querySelector(`#${targetId}`);
  for (let row = 1; row <= count; row++) {
    const tr = document.createElement('tr');
    tr.innerHTML = fields.map(field => `<td><input name="${field}${row}" aria-label="${field} ${row}" type="text" /></td>`).join('');
    target.appendChild(tr);
  }
}

function buildRaciRows() {
  const target = document.querySelector('#raciRows');
  target.innerHTML = raciTeams.map(team => `
    <tr>
      <td>${team}</td>
      ${['Responsible', 'Accountable', 'Consulted', 'Informed'].map(role => `
        <td><input name="raci_${slug(team)}_${slug(role)}" aria-label="${team} ${role}" type="text" placeholder="Name or team" /></td>
      `).join('')}
    </tr>
  `).join('');
}

function buildDecisionRows() {
  document.querySelector('#decisionRows').innerHTML = decisionRules
    .map(rule => `<tr><td>${rule.trigger}</td><td>${rule.teams.join(', ')}</td></tr>`)
    .join('');
}

function buildApprovalRows() {
  document.querySelector('#approvalRows').innerHTML = approvals.map(approval => `
    <div class="approval-card">
      <h3>${approval}</h3>
      <fieldset class="option-group">
        <legend>Status</legend>
        <label><input type="radio" name="${slug(approval)}" value="Approved" />Approved</label>
        <label><input type="radio" name="${slug(approval)}" value="Rejected" />Rejected</label>
      </fieldset>
      <label>Approver<input name="${slug(approval)}Approver" type="text" /></label>
    </div>
  `).join('');
}

function getFormData() {
  const data = new FormData(form);
  const value = name => data.get(name) || '';
  const values = name => data.getAll(name);
  return {
    requestName: value('requestName'),
    requestor: value('requestor'),
    department: value('department'),
    dateSubmitted: value('dateSubmitted'),
    completionDate: value('completionDate'),
    priority: value('priority'),
    problem: value('problem'),
    outcome: value('outcome'),
    benefits: values('benefits'),
    solutionType: values('solutionType'),
    existingData: value('existingData'),
    newDataSource: value('newDataSource'),
    existingSources: value('existingSources'),
    sourceName: value('sourceName'),
    systemOwner: value('systemOwner'),
    vendor: value('vendor'),
    classification: values('classification'),
    businessOwner: value('businessOwner'),
    technicalOwner: value('technicalOwner'),
    approvedDefinitions: value('approvedDefinitions'),
    newDefinitions: value('newDefinitions'),
    newKpi: value('newKpi'),
    newIntegration: value('newIntegration'),
    newApi: value('newApi'),
    newDatabaseObjects: value('newDatabaseObjects'),
    sensitiveData: value('sensitiveData'),
    securityReview: value('securityReview'),
    regulatory: values('regulatory'),
    dashboardRequired: value('dashboardRequired'),
    reportRequired: value('reportRequired'),
    audience: value('audience'),
    metrics: value('metrics'),
    refresh: value('refresh'),
    development: values('development'),
    testing: values('testing'),
    status: value('status')
  };
}

function refresh() {
  const data = getFormData();
  updateProgress();
  renderRequiredTeams(data);
  renderSummary(data);
}

function updateProgress() {
  const fields = [...form.querySelectorAll('input, textarea')].filter(field => !field.name.startsWith('raci_'));
  const groups = new Map();
  fields.forEach(field => {
    if ((field.type === 'radio' || field.type === 'checkbox') && field.name) {
      groups.set(field.name, groups.get(field.name) || [...form.querySelectorAll(`[name="${field.name}"]`)]);
    } else if (field.name) {
      groups.set(field.name, [field]);
    }
  });
  let complete = 0;
  groups.forEach(group => {
    if (group.some(field => field.type === 'checkbox' || field.type === 'radio' ? field.checked : field.value.trim())) complete++;
  });
  const percent = Math.round((complete / groups.size) * 100);
  progressValue.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function getRequiredTeams(data) {
  return [...new Set(decisionRules.filter(rule => rule.test(data)).flatMap(rule => rule.teams))].sort();
}

function renderRequiredTeams(data) {
  const teams = getRequiredTeams(data);
  requiredTeams.innerHTML = teams.length
    ? teams.map(team => `<span class="pill">${team}</span>`).join('')
    : '<span class="pill empty">No routing triggers selected yet</span>';
}

function renderSummary(data) {
  const teams = getRequiredTeams(data);
  summaryPanel.innerHTML = `
    <h3>${data.requestName || 'Untitled Intake Request'}</h3>
    <p><strong>Requestor:</strong> ${data.requestor || 'Not provided'} | <strong>Department:</strong> ${data.department || 'Not provided'} | <strong>Priority:</strong> ${data.priority || 'Not selected'}</p>
    <p><strong>Solution Type:</strong> ${formatList(data.solutionType)}</p>
    <p><strong>Data Classification:</strong> ${formatList(data.classification)}</p>
    <p><strong>Required Teams:</strong> ${teams.length ? teams.join(', ') : 'No routing triggers selected yet'}</p>
    <p><strong>Current Status:</strong> ${data.status || 'Not selected'}</p>
    <p><strong>Desired Outcome:</strong> ${data.outcome || 'Not provided'}</p>
  `;
}

function formatList(items) {
  return items.length ? items.join(', ') : 'None selected';
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

form.addEventListener('input', refresh);
form.addEventListener('change', refresh);
form.addEventListener('reset', () => setTimeout(refresh));
form.addEventListener('submit', event => {
  event.preventDefault();
  showToast('Intake captured. Connect this action to Dataverse or Power Automate next.');
});

document.querySelector('#copySummary').addEventListener('click', async () => {
  const text = summaryPanel.innerText.trim();
  try {
    await navigator.clipboard.writeText(text);
    showToast('Summary copied to clipboard.');
  } catch {
    showToast('Copy unavailable in this browser session.');
  }
});

init();
