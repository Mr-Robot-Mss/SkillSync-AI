export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",

  endpoints: {
    chileTechJobs: "/jobs/chile-tech",
    recommendedJobs: "/jobs/recommended",
    syncJobs: "/jobs/sync",

    savedJobs: "/saved-jobs/all",
    saveJob: "/saved-jobs/save",
    deleteSavedJob: "/saved-jobs",

    onboardingAnalyze: "/onboarding/analyze",
    assistant: "/ai/assistant",
    roadmap: "/roadmap/my-roadmap",
    interviewQuestion: "/interview/question",
    interviewEvaluate: "/interview/evaluate",
    cvAnalyze: "/cv/analyze",
  },
};