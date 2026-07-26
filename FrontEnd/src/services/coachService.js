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

export function getCoachUserId() {
  const user = readJsonStorage("skillsync_user") || {};
  return String(user.id || user.user_id || "demo-user");
}

async function parseApiError(response, fallbackMessage) {
  try {
    const error = await response.json();
    return error.detail || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export function buildCoachPayload() {
  const onboarding = readJsonStorage("skillsync_onboarding_result") || {};
  const profile = readJsonStorage("skillsync_profile") || {};

  const skills = normalizeSkills(
    profile.skills || onboarding.skills || onboarding.current_skills,
  );
  const requiredSkills = normalizeSkills(
    onboarding.required_skills || onboarding.missing_skills || onboarding.focus,
  );

  return {
    user_id: getCoachUserId(),
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "No se pudo cargar el AI Career Coach"),
    );
  }

  return response.json();
}

export async function getCoachHistory({ userId = getCoachUserId(), limit = 12 } = {}) {
  const params = new URLSearchParams({
    user_id: String(userId),
    limit: String(limit),
  });
  const response = await fetch(`${API_GATEWAY_URL}/coach/history?${params}`);

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "No se pudo cargar el historial del Career Score"),
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data?.items || data?.history || [];
}

export async function getCoachGoal(userId = getCoachUserId()) {
  const params = new URLSearchParams({ user_id: String(userId) });
  const response = await fetch(`${API_GATEWAY_URL}/coach/goal?${params}`);

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "No se pudo cargar la meta profesional"),
    );
  }

  const data = await response.json();
  return data?.goal ?? data;
}

export async function saveCoachGoal(goal) {
  const payload = {
    user_id: goal.user_id || getCoachUserId(),
    title: String(goal.title || "").trim(),
    description: String(goal.description || "").trim(),
    target_date: goal.target_date || null,
    progress: Number(goal.progress || 0),
    status: goal.status || "active",
  };

  const response = await fetch(`${API_GATEWAY_URL}/coach/goal`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "No se pudo guardar la meta profesional"),
    );
  }

  const data = await response.json();
  return data?.goal ?? data;
}
