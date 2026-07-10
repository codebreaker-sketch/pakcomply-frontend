import client from './client'

// ── 6.1 Regulatory Knowledge Base + 6.2 RAG Retrieval ─────────────────────
export const listRegulations   = ()        => client.get('/regulations')
export const searchRegulations = (query)   => client.get('/regulations/search', { params: { q: query } })

// ── 6.3 Internal Policy Compliance Engine (gap detection) ─────────────────
export const listAssessments   = ()             => client.get('/compliance/assessments')
export const getAssessment     = (id)           => client.get(`/compliance/assessments/${id}`)
export const runComplianceCheck= (payload)      => client.post('/compliance/run', payload)
// payload = { policy_id, regulation_id, framework }

// ── 6.4 Data Compliance Validation ─────────────────────────────────────────
export const validateDataset   = (formData, onProgress) =>
  client.post('/compliance/validate-data', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
  })

// ── 6.5 Vendor Risk Assessment ─────────────────────────────────────────────
export const listVendors       = ()         => client.get('/vendors')
export const getVendor         = (id)       => client.get(`/vendors/${id}`)
export const createVendor      = (data)     => client.post('/vendors', data)
export const runVendorAssessment = (id, answers) => client.post(`/vendors/${id}/assess`, { answers })
export const deleteVendor      = (id)       => client.delete(`/vendors/${id}`)

// ── 6.6 Website Compliance Scanner ─────────────────────────────────────────
export const listWebsiteScans  = ()         => client.get('/website-scans')
export const runWebsiteScan    = (url)      => client.post('/website-scans', { url })
export const getWebsiteScan    = (id)       => client.get(`/website-scans/${id}`)

// ── 6.7 Unified Risk Dashboard ─────────────────────────────────────────────
export const getRiskOverview   = ()         => client.get('/dashboard/risk-overview')

// ── 6.8 Anomaly Detection Engine ───────────────────────────────────────────
export const listAnomalies     = ()         => client.get('/anomalies')
export const resolveAnomaly    = (id)       => client.patch(`/anomalies/${id}`, { status: 'resolved' })

// ── 6.9 Regulatory Change Detection ────────────────────────────────────────
export const listRegulatoryChanges = ()     => client.get('/regulatory-changes')
export const acknowledgeChange = (id)       => client.patch(`/regulatory-changes/${id}`, { acknowledged: true })

// ── 6.10 Conversational Regulatory Assistant ───────────────────────────────
export const sendAssistantMessage = (message, history = []) =>
  client.post('/assistant/chat', { message, history })

// ── 6.11 Reporting & Audit Module ──────────────────────────────────────────
export const listReports       = ()         => client.get('/reports')
export const generateReport    = (payload)  => client.post('/reports/generate', payload)
export const downloadReport    = (id)       => client.get(`/reports/${id}/download`, { responseType: 'blob' })
