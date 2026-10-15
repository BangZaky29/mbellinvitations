import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicInvitationPage } from './pages/PublicInvitationPage';
import { DemoSimulatorPage } from './pages/DemoSimulatorPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardEditorPage } from './pages/dashboard/DashboardEditorPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route: langsung mengarah ke Dashboard Editor */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* SaaS Dashboard Editor routes */}
        <Route path="/dashboard" element={<DashboardEditorPage />} />
        <Route path="/dashboard/*" element={<DashboardEditorPage />} />

        {/* 5-Template Demo Simulator (Switcher toolbar) */}
        <Route path="/demo" element={<DemoSimulatorPage />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dynamic Public Invitation by Slug (e.g. /raditya-jessica) */}
        <Route path="/:slug" element={<PublicInvitationPage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
