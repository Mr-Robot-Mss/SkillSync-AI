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

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="noise relative min-h-screen overflow-hidden bg-[#f5f5f3]">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<OnboardingAI />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/market" element={<MarketPulse />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/cv-builder" element={<CVBuilder />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/interview-simulator" element={<InterviewSimulator />} />
          <Route path="/career-roadmap" element={<CareerRoadmap />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <AIFloatingAssistant />
      </div>
    </BrowserRouter>
  );
}