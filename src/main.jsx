import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageReports from "./pages/admin/ManageReports";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageCertificates from "./pages/admin/ManageCertificates";
import CourseDetail from "./pages/praktikum/CourseDetail";
import ReportDetail from "./pages/praktikum/ReportDetail";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/sidiq">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/praktikum/:courseSlug" element={<CourseDetail />} />
        <Route
          path="/praktikum/:courseSlug/:reportSlug"
          element={<ReportDetail />}
        />

        {/* Admin */}
        <Route path="/sidiq-admin" element={<AdminLogin />} />
        <Route path="/sidiq-admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="reports" element={<ManageReports />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="certificates" element={<ManageCertificates />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
