import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { StudentDashboard } from './pages/StudentDashboard';
import { About } from './pages/About';

import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

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
  );
}
