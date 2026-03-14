import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/home/ScrollToTop";

import { useEffect } from "react";

import MainLayout from "./layouts/MainLayout";
import NoFooterLayout from "./layouts/NoFooterLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Portfolio from "./pages/Portfolio";
import ContactInfo from "./pages/Contact";
import Blogs from "./pages/Blogs";
import ProjectDetail from "./pages/ProjectDetail";
import BlogDetail from "./pages/BlogDetail";

import {
  BlogsAdmin,
  Dashboard,
  PortfolioAdmin,
  MessagesAdmin,
  SettingsAdmin,
  AdminRequests,
  OverviewAdmin,
  TestimonialsAdmin,
  CreateQuoteAdmin,
  ProposalsAdmin,
} from "./admin/pages";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./admin/pages/Login";
import Signup from "./admin/pages/Signup";
import ProtectedRoute from "./admin/components/ProtectedRoutes";

function App() {
  // ── Track visitor on every public page load ──
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/visitors/track`, {
      method: "POST",
    }).catch(() => {});
  }, []);
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ── Public routes WITH footer ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Service />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />

          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
        </Route>

        {/* ── Public routes WITHOUT footer ── */}
        <Route element={<NoFooterLayout />}>
          <Route path="/contact" element={<ContactInfo />} />
        </Route>

        {/* ── Admin login — public ── */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />

        {/* ── Admin routes — protected ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="blogs" element={<BlogsAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="portfolio" element={<PortfolioAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="overview" element={<OverviewAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="create-quote" element={<CreateQuoteAdmin />} />
          <Route path="proposals" element={<ProposalsAdmin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
