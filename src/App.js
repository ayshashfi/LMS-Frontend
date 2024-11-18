import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import LeaveApplicationCreate from './pages/LeaveApplicationCreate';
import LeaveApplicationList from './pages/LeaveApplicationList';
import ViewProfile from './pages/ViewProfile';
import EmployeeListPage from './pages/EmployeeListPage';
import LeaveApprovalPage from './pages/LeaveApprovalPage';
import LeaveReportPage from './pages/LeaveReportPage';
import ProtectedRoute from './pages/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager-dashboard"
                    element={
                        <ProtectedRoute>
                            <ManagerDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee-dashboard"
                    element={
                        <ProtectedRoute>
                            <EmployeeDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leave/create"
                    element={
                        <ProtectedRoute>
                            <LeaveApplicationCreate />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leave/list"
                    element={
                        <ProtectedRoute>
                            <LeaveApplicationList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ViewProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee-list"
                    element={
                        <ProtectedRoute>
                            <EmployeeListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leave-approval"
                    element={
                        <ProtectedRoute>
                            <LeaveApprovalPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leave-report"
                    element={
                        <ProtectedRoute>
                            <LeaveReportPage />
                        </ProtectedRoute>
                    }
                />

                {/* Default redirect if no route matches */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
