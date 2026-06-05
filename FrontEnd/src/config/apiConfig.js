export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/api",

  endpoints: {
    chileTechJobs: "/jobs/chile-tech",
    jobDetail: "/jobs",
    profileMatch: "/ai/profile-match",
  },

  sources: {
    getOnBoard: "Get on Board",
    chiletrabajos: "Chiletrabajos",
    laborum: "Laborum",
    trabajando: "Trabajando.cl",
    linkedin: "LinkedIn Jobs",
  },
};