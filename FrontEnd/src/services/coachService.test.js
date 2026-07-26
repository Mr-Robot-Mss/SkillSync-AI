import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildCoachPayload,
  getCoachGoal,
  getCoachHistory,
  saveCoachGoal,
} from "./coachService";

function createStorage() {
  const values = new Map();

  return {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, value)),
    removeItem: vi.fn((key) => values.delete(key)),
    clear: vi.fn(() => values.clear()),
  };
}

describe("coachService", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
    vi.stubGlobal("sessionStorage", createStorage());
    vi.restoreAllMocks();
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

  it("normaliza un historial envuelto en items", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [{ career_score: 72 }] }),
      }),
    );

    const history = await getCoachHistory({ userId: "25", limit: 6 });

    expect(history).toEqual([{ career_score: 72 }]);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/coach/history?user_id=25&limit=6"),
    );
  });

  it("devuelve null cuando el usuario todavía no tiene una meta", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ status: 404, ok: false }),
    );

    await expect(getCoachGoal("25")).resolves.toBeNull();
  });

  it("envía una meta normalizada al gateway", async () => {
    localStorage.setItem("skillsync_user", JSON.stringify({ id: 25 }));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ goal: { title: "Conseguir empleo", progress: 35 } }),
      }),
    );

    const result = await saveCoachGoal({
      title: "  Conseguir empleo  ",
      progress: "35",
      status: "active",
    });

    expect(result.progress).toBe(35);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/coach/goal"),
      expect.objectContaining({
        method: "PUT",
        body: expect.stringContaining('"user_id":"25"'),
      }),
    );
  });
});
