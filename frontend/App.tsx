
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';

// Lazy load pages for better initial load performance
// Explicitly use .tsx extension
const HomePage = lazy(() => import('./pages/Home.tsx'));
const SignInPage = lazy(() => import('./pages/SignIn.tsx'));
const CreateAccountPage = lazy(() => import('./pages/CreateAccount.tsx'));
const DashboardPage = lazy(() => import('./pages/Dashboard.tsx'));
const AnalyzeGeminiPage = lazy(() => import('./pages/AnalyzeGemini.tsx'));
const AnalyzeSerpAPIPage = lazy(() => import('./pages/AnalyzeSerpAPI.tsx'));
const AnalyzeSearchAPIPage = lazy(() => import('./pages/AnalyzeSearchAPI.tsx'));
const LiveAnalysisPage = lazy(() => import('./pages/LiveAnalysis.tsx'));
const HistoryPage = lazy(() => import('./pages/History.tsx'));
const SavedPage = lazy(() => import('./pages/Saved.tsx'));
const AccountSettingsPage = lazy(() => import('./pages/AccountSettings.tsx'));
const AdminPanelPage = lazy(() => import('./pages/AdminPanel.tsx'));
const NotFoundPage = lazy(() => import('./pages/NotFound.tsx'));

// Fallback for Suspense
const SuspenseFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen w-screen">
    <LoadingSpinner size="lg" message="Loading page..." />
  </div>
);

const App: React.FC = () => {
  // Mock authentication check
  const isAuthenticated = true; // Set to true for now to access protected routes

  return (
    <HashRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={!isAuthenticated ? <SignInPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/create-account" element={!isAuthenticated ? <CreateAccountPage /> : <Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes Example (can be wrapped in a ProtectedRoute component) */}
            <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/signin" replace />} />
            <Route path="/analyze/gemini" element={isAuthenticated ? <AnalyzeGeminiPage /> : <Navigate to="/signin" replace />} />
            <Route path="/analyze/serpapi" element={isAuthenticated ? <AnalyzeSerpAPIPage /> : <Navigate to="/signin" replace />} />
            <Route path="/analyze/searchapi" element={isAuthenticated ? <AnalyzeSearchAPIPage /> : <Navigate to="/signin" replace />} />
            <Route path="/live-analysis" element={isAuthenticated ? <LiveAnalysisPage /> : <Navigate to="/signin" replace />} />
            <Route path="/history" element={isAuthenticated ? <HistoryPage /> : <Navigate to="/signin" replace />} />
            <Route path="/saved" element={isAuthenticated ? <SavedPage /> : <Navigate to="/signin" replace />} />
            <Route path="/account-settings" element={isAuthenticated ? <AccountSettingsPage /> : <Navigate to="/signin" replace />} />
            <Route path="/admin" element={isAuthenticated ? <AdminPanelPage /> : <Navigate to="/signin" replace />} /> {/* Add specific admin auth later */}
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;