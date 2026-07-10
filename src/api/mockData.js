// Demo data shown when the Phase 2 backend endpoints aren't reachable yet.
// Every page tries the real API first (see src/api/phase2.js) and falls back
// to this so the UI is fully demoable for the mentor review before the
// backend team ships each endpoint. Swap out as real endpoints land.

export const mockRiskOverview = {
  compliance_index: 78,
  trend: '+4 pts this month',
  scores: [
    { key: 'policy',   label: 'Policy Compliance',   value: 82, framework: 'HEC / PECA 2025' },
    { key: 'vendor',   label: 'Vendor Risk',          value: 71, framework: '6 vendors assessed' },
    { key: 'website',  label: 'Website Compliance',   value: 88, framework: 'PECA + OWASP' },
    { key: 'data',     label: 'Data Compliance',      value: 65, framework: 'Schema validation' },
  ],
  alerts: [
    { id: 1, severity: 'high',   title: 'Missing annual penetration testing clause', source: 'SBP-TRM Framework', time: '2h ago' },
    { id: 2, severity: 'medium', title: 'Vendor "CloudSecure Ltd" data localization unclear', source: 'PECA 2025 Sec. 17', time: '5h ago' },
    { id: 3, severity: 'low',    title: 'Cookie consent banner outdated', source: 'Website Scanner', time: '1d ago' },
    { id: 4, severity: 'high',   title: 'Enrollment data spike flagged as anomalous', source: 'Anomaly Engine', time: '1d ago' },
  ],
}

export const mockAssessments = [
  { id: 1, policy_name: 'Data Protection Policy v3.pdf', framework: 'PECA 2025', score: 74, status: 'completed', gaps: 4, created_at: '2026-07-08T10:00:00Z' },
  { id: 2, policy_name: 'Student Data Handling Policy.docx', framework: 'HEC QA Manual', score: 91, status: 'completed', gaps: 1, created_at: '2026-07-06T10:00:00Z' },
  { id: 3, policy_name: 'Cybersecurity Policy.pdf', framework: 'PTA Cybersecurity Framework', score: null, status: 'running', gaps: null, created_at: '2026-07-10T09:00:00Z' },
]

export const mockGaps = [
  { id: 1, clause: 'PECA 2025, Sec. 17(2) — Consent for data processing', gap_type: 'missing', severity: 'high', recommendation: 'Add an explicit consent clause covering third-party data sharing before collection begins.' },
  { id: 2, clause: 'HEC QA Manual, Cl. 4.3 — Annual data audit', gap_type: 'partial', severity: 'medium', recommendation: 'Policy mentions audits but doesn\u2019t specify frequency — add "conducted annually" to Section 4.3.' },
  { id: 3, clause: 'PTA Cybersecurity Framework, Cl. 6.1 — Incident response SLA', gap_type: 'missing', severity: 'high', recommendation: 'Define a 24-hour incident notification SLA aligned with PTA\u2019s framework.' },
  { id: 4, clause: 'PECA 2025, Sec. 21 — Data retention limits', gap_type: 'matched', severity: 'low', recommendation: 'Fully compliant — retention period explicitly capped at 5 years.' },
]

export const mockVendors = [
  { id: 1, vendor_name: 'CloudSecure Ltd', industry: 'Cloud Hosting', risk_score: 62, risk_level: 'medium', last_assessed: '2026-06-28' },
  { id: 2, vendor_name: 'EduPay Solutions', industry: 'Payments', risk_score: 88, risk_level: 'low', last_assessed: '2026-07-01' },
  { id: 3, vendor_name: 'DataWorks Analytics', industry: 'Analytics', risk_score: 34, risk_level: 'critical', last_assessed: '2026-07-05' },
  { id: 4, vendor_name: 'NetGuard Security', industry: 'IT Security', risk_score: 76, risk_level: 'low', last_assessed: '2026-06-20' },
  { id: 5, vendor_name: 'SwiftMail SMTP', industry: 'Email Infra', risk_score: 55, risk_level: 'high', last_assessed: '2026-06-15' },
]

export const mockWebsiteScans = [
  {
    id: 1, url: 'https://university.edu.pk', scanned_at: '2026-07-09T12:00:00Z',
    compliance_score: 81, security_score: 74, legal_score: 88,
    findings: [
      { pillar: 'Security',   severity: 'medium', title: 'Missing Content-Security-Policy header', fix: 'Add a strict CSP header to prevent XSS attacks.' },
      { pillar: 'Legal',      severity: 'high',   title: 'No PECA-compliant privacy policy page found', fix: 'Publish a privacy policy referencing PECA 2025 Sec. 17.' },
      { pillar: 'Security',   severity: 'low',    title: 'SSL certificate expires in 20 days', fix: 'Renew the SSL certificate before expiry.' },
      { pillar: 'Technology', severity: 'medium', title: 'Outdated jQuery library (v1.8) detected', fix: 'Upgrade to a maintained, patched library version.' },
    ],
  },
]

export const mockAnomalies = [
  { id: 1, anomaly_type: 'Enrollment Spike', entity: 'Admissions Portal', score: 0.91, status: 'open', detected_at: '2026-07-09T08:12:00Z', detail: 'Enrollment submissions 4.2x above 30-day baseline between 2–4 AM.' },
  { id: 2, anomaly_type: 'Unusual Login Pattern', entity: 'Auth Module', score: 0.77, status: 'open', detected_at: '2026-07-08T22:47:00Z', detail: 'Repeated failed logins from a single IP across 12 accounts.' },
  { id: 3, anomaly_type: 'Transaction Outlier', entity: 'Fee Payment Gateway', score: 0.63, status: 'resolved', detected_at: '2026-07-06T14:03:00Z', detail: 'Single transaction 15x the median fee amount — confirmed legitimate scholarship payment.' },
]

export const mockRegulatoryChanges = [
  { id: 1, authority: 'HEC', title: 'Quality Assurance Manual — Annex C updated', change_type: 'modified', impact: 'high', published_at: '2026-07-08', affected_policies: 2 },
  { id: 2, authority: 'PTA', title: 'Cybersecurity Framework v2.3 released', change_type: 'new', impact: 'medium', published_at: '2026-07-05', affected_policies: 1 },
  { id: 3, authority: 'SECP', title: 'Corporate Governance Rules — clause removed', change_type: 'removed', impact: 'low', published_at: '2026-06-29', affected_policies: 0 },
]

export const mockReports = [
  { id: 1, report_type: 'HEC Quality Audit', generated_at: '2026-07-08T09:00:00Z', status: 'ready' },
  { id: 2, report_type: 'Executive Summary', generated_at: '2026-07-06T09:00:00Z', status: 'ready' },
  { id: 3, report_type: 'PTA Cybersecurity Audit', generated_at: '2026-07-10T07:00:00Z', status: 'generating' },
]
