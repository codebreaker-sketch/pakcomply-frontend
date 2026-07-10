import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import PoliciesPage from './pages/PoliciesPage'
import OrganizationPage from './pages/OrganizationPage'
import AuditLogsPage from './pages/AuditLogsPage'
import RiskDashboardPage from './pages/phase2/RiskDashboardPage'
import GapAnalysisPage from './pages/phase2/GapAnalysisPage'
import VendorRiskPage from './pages/phase2/VendorRiskPage'
import WebsiteScannerPage from './pages/phase2/WebsiteScannerPage'
import AnomalyAlertsPage from './pages/phase2/AnomalyAlertsPage'
import RegulatoryChangesPage from './pages/phase2/RegulatoryChangesPage'
import AssistantPage from './pages/phase2/AssistantPage'
import ReportsPage from './pages/phase2/ReportsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#16A34A', secondary: '#FFFFFF' } },
            error:   { iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' } },
          }}
        />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"    element={<DashboardPage />} />
            <Route path="policies"     element={<PoliciesPage />} />
            <Route path="organization" element={<OrganizationPage />} />
            <Route path="audit-logs"   element={<AuditLogsPage />} />

            {/* Phase 2 — AI & Compliance Intelligence */}
            <Route path="risk-dashboard"     element={<RiskDashboardPage />} />
            <Route path="gap-analysis"       element={<GapAnalysisPage />} />
            <Route path="vendor-risk"        element={<VendorRiskPage />} />
            <Route path="website-scanner"    element={<WebsiteScannerPage />} />
            <Route path="anomalies"          element={<AnomalyAlertsPage />} />
            <Route path="regulatory-changes" element={<RegulatoryChangesPage />} />
            <Route path="assistant"          element={<AssistantPage />} />
            <Route path="reports"            element={<ReportsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
