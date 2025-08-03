import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Villas from './pages/Villas';
import Payments from './pages/Payments';
import Analytics from './pages/Analytics';
import Announcements from './pages/Announcements';
import Complaints from './pages/Complaints';
import ProtectedRoute from './pages/components/ProtectedRoute';
import Layout from './pages/components/Layout';
import AssociationAccount from './pages/AssociationAccount'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout><AssociationAccount /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Layout><AssociationAccount /></Layout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/villas"
          element={
            <ProtectedRoute>
              <Layout><Villas /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Layout><Payments /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout><Analytics /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Layout><Announcements /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Layout><Complaints /></Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
