import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildCoachPayload } from "./coachService";

function createStorage() {
  const values = new Map();

  return {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, value)),
    removeItem: vi.fn((key) => values.delete(key)),
    clear: vi.fn(() => values.clear()),
  };
}

describe("buildCoachPayload", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
    vi.stubGlobal("sessionStorage", createStorage());
  });

  it("normaliza el usuario y el resultado del onboarding", () => {
    localStorage.setItem("skillsync_user", JSON.stringify({ id: 25 }));
    localStorage.setItem(
      "skillsync_onboarding_result",
      JSON.stringify({
        target_role: "QA Automation Engineer",
        level: "Junior",
        skills: ["Python", { name: "Git" }],
        required_skills: ["Python", "Git", "Playwright"],
      }),
    );

    const payload = buildCoachPayload();

    expect(payload.user_id).toBe("25");
    expect(payload.profile.target_role).toBe("QA Automation Engineer");
    expect(payload.profile.skills).toEqual(["Python", "Git"]);
    expect(payload.profile.required_skills).toContain("Playwright");
  });
});
