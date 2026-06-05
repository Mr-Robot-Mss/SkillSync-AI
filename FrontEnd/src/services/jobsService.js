import { API_CONFIG } from "../config/apiConfig";

const USE_MOCK_DATA = true;

const MOCK_CHILE_TECH_JOBS = [
  {
    id: 1,
    title: "QA Automation Engineer",
    company: "Banco Digital Chile",
    location: "Santiago, Chile",
    region: "Metropolitana",
    modality: "Híbrido",
    seniority: "Junior",
    category: "QA",
    salary: "$1.200.000 - $1.600.000",
    source: "Get on Board",
    match: 94,
    skills: ["Selenium", "Python", "Postman", "SQL"],
    description:
      "Buscamos perfil QA con interés en automatización, pruebas funcionales, validación de APIs y trabajo con equipos ágiles.",
    requirements: [
      "Conocimiento en pruebas funcionales",
      "Manejo básico de SQL",
      "Postman o herramientas similares",
      "Deseable Selenium o Playwright",
    ],
  },
  {
    id: 2,
    title: "Frontend Developer React",
    company: "Startup Fintech",
    location: "Remoto, Chile",
    region: "Remoto",
    modality: "Remoto",
    seniority: "Junior",
    category: "Frontend",
    salary: "$1.000.000 - $1.500.000",
    source: "LinkedIn Jobs",
    match: 91,
    skills: ["React", "JavaScript", "Tailwind", "API REST"],
    description:
      "Rol frontend orientado a construir interfaces modernas, componentes reutilizables y conexión con servicios backend.",
    requirements: [
      "React y JavaScript",
      "Consumo de APIs REST",
      "Manejo de CSS/Tailwind",
      "Buenas prácticas de componentes",
    ],
  },
  {
    id: 3,
    title: "Analista BI Junior",
    company: "Empresa Retail",
    location: "Las Condes, Chile",
    region: "Metropolitana",
    modality: "Presencial",
    seniority: "Junior",
    category: "Data",
    salary: "$1.100.000 - $1.400.000",
    source: "Chiletrabajos",
    match: 88,
    skills: ["Power BI", "SQL", "Excel", "ETL"],
    description:
      "Se requiere analista BI para construir reportes, analizar datos comerciales y apoyar la toma de decisiones.",
    requirements: [
      "SQL básico/intermedio",
      "Power BI",
      "Excel avanzado",
      "Deseable experiencia en ETL",
    ],
  },
  {
    id: 4,
    title: "Soporte TI Nivel 2",
    company: "Servicios Tecnológicos SPA",
    location: "Santiago, Chile",
    region: "Metropolitana",
    modality: "Híbrido",
    seniority: "Semi Senior",
    category: "Soporte TI",
    salary: "$900.000 - $1.300.000",
    source: "Laborum",
    match: 82,
    skills: ["Windows", "Redes", "SQL", "Mesa de ayuda"],
    description:
      "Cargo orientado a soporte técnico, resolución de incidencias, atención de usuarios y seguimiento de tickets.",
    requirements: [
      "Experiencia en soporte TI",
      "Conocimiento en redes",
      "Manejo de tickets",
      "Comunicación con usuarios",
    ],
  },
  {
    id: 5,
    title: "Data Analyst Junior",
    company: "Consultora Analytics Chile",
    location: "Providencia, Chile",
    region: "Metropolitana",
    modality: "Híbrido",
    seniority: "Junior",
    category: "Data",
    salary: "$1.100.000 - $1.700.000",
    source: "Get on Board",
    match: 90,
    skills: ["SQL", "Python", "Power BI", "ETL"],
    description:
      "Buscamos analista de datos junior para apoyar proyectos de inteligencia de negocios y automatización de reportes.",
    requirements: [
      "SQL para consultas",
      "Power BI o herramienta similar",
      "Python básico deseable",
      "Capacidad analítica",
    ],
  },
  {
    id: 6,
    title: "Desarrollador Fullstack Junior",
    company: "Software Factory Chile",
    location: "Valparaíso, Chile",
    region: "Valparaíso",
    modality: "Remoto",
    seniority: "Junior",
    category: "Fullstack",
    salary: "$1.200.000 - $1.800.000",
    source: "Chiletrabajos",
    match: 86,
    skills: ["React", "Node.js", "SQL", "API REST"],
    description:
      "Rol fullstack para desarrollo de aplicaciones web, consumo de APIs y mantenimiento de módulos internos.",
    requirements: [
      "React o framework frontend",
      "Conocimientos de backend",
      "Bases de datos SQL",
      "Trabajo con Git",
    ],
  },
];

function normalizeJob(job, index) {
  return {
    id: job.id || index + 1,
    title: job.title || "Cargo no informado",
    company: job.company || "Empresa no informada",
    location: job.location || "Chile",
    region: job.region || "Metropolitana",
    modality: job.modality || "No especificada",
    seniority: job.seniority || "No especificada",
    category: job.category || "Informática",
    salary: job.salary || "Sueldo no informado",
    source: job.source || "Fuente externa",
    match: job.match || 75,
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description || "Descripción no disponible.",
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
  };
}

export async function getChileTechJobs() {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return MOCK_CHILE_TECH_JOBS.map(normalizeJob);
    }

    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.chileTechJobs}`
    );

    if (!response.ok) {
      throw new Error("No se pudieron obtener las ofertas laborales");
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map(normalizeJob);
    }

    if (Array.isArray(data.jobs)) {
      return data.jobs.map(normalizeJob);
    }

    return MOCK_CHILE_TECH_JOBS.map(normalizeJob);
  } catch (error) {
    console.error("Error cargando ofertas laborales:", error);
    return MOCK_CHILE_TECH_JOBS.map(normalizeJob);
  }
}