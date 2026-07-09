import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MarketPulse from "./pages/MarketPulse";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import StudentProfile from "./pages/StudentProfile";
import SavedJobs from "./pages/SavedJobs";
import AITools from "./pages/AITools";
import SkillGap from "./pages/SkillGap";
import CVBuilder from "./pages/CVBuilder";
import Analytics from "./pages/Analytics";
import InterviewSimulator from "./pages/InterviewSimulator";
import CareerRoadmap from "./pages/CareerRoadmap";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import OnboardingAI from "./pages/OnboardingAI";

import AIFloatingAssistant from "./components/AIFloatingAssistant";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function PrivatePage({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="noise relative min-h-screen overflow-hidden bg-[#f5f5f3]">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Privadas */}
          <Route path="/home" element={<PrivatePage><Home /></PrivatePage>} />
          <Route path="/onboarding" element={<PrivatePage><OnboardingAI /></PrivatePage>} />
          <Route path="/dashboard" element={<PrivatePage><Dashboard /></PrivatePage>} />
          <Route path="/profile" element={<PrivatePage><StudentProfile /></PrivatePage>} />
          <Route path="/market" element={<PrivatePage><MarketPulse /></PrivatePage>} />
          <Route path="/saved-jobs" element={<PrivatePage><SavedJobs /></PrivatePage>} />
          <Route path="/ai-tools" element={<PrivatePage><AITools /></PrivatePage>} />
          <Route path="/skill-gap" element={<PrivatePage><SkillGap /></PrivatePage>} />
          <Route path="/cv-builder" element={<PrivatePage><CVBuilder /></PrivatePage>} />
          <Route path="/analytics" element={<PrivatePage><Analytics /></PrivatePage>} />
          <Route path="/interview-simulator" element={<PrivatePage><InterviewSimulator /></PrivatePage>} />
          <Route path="/career-roadmap" element={<PrivatePage><CareerRoadmap /></PrivatePage>} />
          <Route path="/settings" element={<PrivatePage><Settings /></PrivatePage>} />
          <Route path="/notifications" element={<PrivatePage><Notifications /></PrivatePage>} />
          <Route path="/admin" element={<PrivatePage><AdminDashboard /></PrivatePage>} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <AIFloatingAssistant />
      </div>
    </BrowserRouter>
  );
}