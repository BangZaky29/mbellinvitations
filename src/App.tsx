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
        {/* Default route redirects to raditya-jessica live public invitation */}
        <Route path="/" element={<Navigate to="/raditya-jessica" replace />} />

        {/* 5-Template Demo Simulator (Switcher toolbar) */}
        <Route path="/demo" element={<DemoSimulatorPage />} />

        {/* Auth routes (Phase 2 & 3) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* SaaS Dashboard Editor routes */}
        <Route path="/dashboard/*" element={<DashboardEditorPage />} />

        {/* Dynamic Public Invitation by Slug */}
        <Route path="/:slug" element={<PublicInvitationPage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/raditya-jessica" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
