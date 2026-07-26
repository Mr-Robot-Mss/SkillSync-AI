const API_GATEWAY_URL = import.meta.env.VITE_API_URL || "/api";

function readJsonStorage(key) {
  const raw = localStorage.getItem(key) || sessionStorage.getItem(key);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeSkills(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === "string" ? item : item?.name || item?.skill))
    .filter(Boolean);
}

export function buildCoachPayload() {
  const user = readJsonStorage("skillsync_user") || {};
  const onboarding = readJsonStorage("skillsync_onboarding_result") || {};
  const profile = readJsonStorage("skillsync_profile") || {};

  const skills = normalizeSkills(
    profile.skills || onboarding.skills || onboarding.current_skills,
  );
  const requiredSkills = normalizeSkills(
    onboarding.required_skills || onboarding.missing_skills || onboarding.focus,
  );

  return {
    user_id: String(user.id || user.user_id || "demo-user"),
    profile: {
      completion_percentage: Number(profile.completion_percentage || 65),
      target_role:
        onboarding.target_role ||
        onboarding.primary_role ||
        profile.target_role ||
        "QA Automation Engineer",
      current_level: onboarding.level || profile.level || "Junior",
      skills,
      required_skills: requiredSkills,
      cv_score: Number(profile.cv_score || onboarding.cv_score || 60),
      activity: {
        saved_jobs: Number(profile.saved_jobs || 0),
        applications: Number(profile.applications || 0),
        interviews: Number(profile.interviews || 0),
        completed_roadmap_steps: Number(profile.completed_roadmap_steps || 0),
        total_roadmap_steps: Number(profile.total_roadmap_steps || 5),
      },
    },
  };
}

export async function getCoachSummary(payload = buildCoachPayload()) {
  const response = await fetch(`${API_GATEWAY_URL}/coach/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = "No se pudo cargar el AI Career Coach";

    try {
      const error = await response.json();
      detail = error.detail || detail;
    } catch {
      // Conserva el mensaje predeterminado cuando la respuesta no es JSON.
    }

    throw new Error(detail);
  }

  return response.json();
}
