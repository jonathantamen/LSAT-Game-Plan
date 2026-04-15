import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import { Home } from './pages/Home';
import { TutorDashboard } from './pages/TutorDashboard';
import { StudentDashboard } from './pages/StudentDashboard';

import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/tutor"
              element={
                <AuthGuard allowedRole="admin">
                  <TutorDashboard />
                </AuthGuard>
              }
            />

            <Route
              path="/student"
              element={
                <StudentDashboard />
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster position="bottom-right" />
      </HashRouter>
    </AuthProvider>
  );
}
