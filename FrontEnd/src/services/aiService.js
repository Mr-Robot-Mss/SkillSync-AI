export async function askAssistant(message) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const text = message.toLowerCase();

  if (text.includes("docker")) {
    return "Docker es muy recomendable para tu perfil, especialmente para QA Automation, Backend y DevOps.";
  }

  if (text.includes("react")) {
    return "React es clave para roles Frontend y Fullstack. Es una buena ruta si quieres combinar desarrollo con datos o QA.";
  }

  if (text.includes("qa")) {
    return "Para QA Automation enfócate en Selenium, Playwright, Postman, SQL, evidencias y casos de prueba.";
  }

  if (text.includes("cv")) {
    return "Tu CV debería destacar proyectos reales, tecnologías usadas, métricas de impacto y experiencia práctica.";
  }

  if (text.includes("trabajo") || text.includes("empleo")) {
    return "Según tu perfil, las mejores rutas son QA Automation, Analista BI Junior, Data Analyst Junior y Frontend Developer.";
  }

  return "Según tu perfil actual, te recomiendo fortalecer automatización, análisis de datos, React, Docker y cloud.";
}

export async function analyzeInterviewAnswer(answer) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const score = answer.length > 100 ? 90 : answer.length > 50 ? 78 : 62;

  return {
    score,
    feedback:
      score >= 85
        ? "Muy buena respuesta. Incluyes herramientas, metodología y enfoque técnico."
        : score >= 75
        ? "Buena base. Puedes mejorar agregando ejemplos reales y resultados concretos."
        : "Respuesta básica. Agrega herramientas, pasos técnicos y experiencia práctica.",
  };
}

export async function analyzeSkillGap() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    compatibility: 73,
    currentSkills: ["Python", "SQL", "Power BI", "Postman", "Testing"],
    missingSkills: ["Docker", "AWS", "React", "Selenium"],
    recommendation:
      "Tu perfil tiene buena base en QA y datos. Aprender Docker, React y Selenium aumentará tu compatibilidad laboral.",
  };
}

export async function generateCVAnalysis(role) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    atsScore: role.includes("QA") ? 89 : 84,
    recommendation:
      "Agrega métricas de impacto, herramientas específicas y proyectos reales relacionados al rol objetivo.",
  };
}