import type { CategoryDef, Course, TechDef } from "@/types/roadmap";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PLATFORM_BASE: Record<Course["platform"], string> = {
  Alura: "https://www.alura.com.br/curso",
  Udemy: "https://www.udemy.com/course",
  Coursera: "https://www.coursera.org/learn",
  YouTube: "https://www.youtube.com/results?search_query",
};

let courseSeq = 0;

function crs(
  title: string,
  platform: Course["platform"],
  durationMinutes: number,
  status: Course["status"],
  progressRatio?: number,
): Course {
  courseSeq += 1;
  const studiedMinutes =
    status === "completed"
      ? durationMinutes
      : status === "not_started"
        ? 0
        : Math.round(durationMinutes * (progressRatio ?? 0.45));
  return {
    id: `crs-${courseSeq}`,
    title,
    platform,
    url: `${PLATFORM_BASE[platform]}/${slugify(title)}`,
    durationMinutes,
    studiedMinutes,
    status,
  };
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "fundamentos",
    name: "Fundamentos",
    description: "A base que sustenta tudo o resto.",
    accent: "sky",
    icon: "brain",
  },
  {
    id: "backend",
    name: "Backend",
    description: "Java, Spring e o ecossistema de serviços.",
    accent: "cyan",
    icon: "server",
  },
  {
    id: "databases",
    name: "Databases",
    description: "Onde o estado vive.",
    accent: "teal",
    icon: "database",
  },
  {
    id: "frontend",
    name: "Frontend",
    description: "Interfaces que as pessoas realmente tocam.",
    accent: "violet",
    icon: "atom",
  },
  {
    id: "devops",
    name: "DevOps",
    description: "Empacotar, orquestrar, entregar.",
    accent: "amber",
    icon: "container",
  },
  {
    id: "cloud",
    name: "Cloud",
    description: "Infraestrutura sem servidor debaixo da mesa.",
    accent: "indigo",
    icon: "cloud",
  },
  {
    id: "aws",
    name: "AWS",
    description: "O provedor mais usado do mercado.",
    accent: "ember",
    icon: "archive",
  },
  {
    id: "arquitetura",
    name: "Arquitetura",
    description: "Decisões que envelhecem bem.",
    accent: "rose",
    icon: "puzzle",
  },
  {
    id: "testes",
    name: "Testes",
    description: "Confiança em forma de código.",
    accent: "emerald",
    icon: "check",
  },
  {
    id: "git",
    name: "Git",
    description: "Histórico, colaboração, controle.",
    accent: "gold",
    icon: "gitBranch",
  },
];

export const TECHS: TechDef[] = [
  // ── Fundamentos ────────────────────────────────────────────
  {
    id: "logica-programacao",
    name: "Lógica de Programação",
    categoryId: "fundamentos",
    parentId: null,
    icon: "binary",
    summary: "Variáveis, condicionais, laços e a forma de pensar antes da sintaxe.",
    courses: [
      crs("Lógica de Programação: do zero à prática", "Alura", 480, "completed"),
      crs("Curso de Lógica de Programação", "Udemy", 360, "completed"),
    ],
  },
  {
    id: "poo",
    name: "Orientação a Objetos",
    categoryId: "fundamentos",
    parentId: "logica-programacao",
    icon: "shapes",
    summary: "Classes, herança, polimorfismo e encapsulamento aplicados de verdade.",
    courses: [
      crs("POO na prática com Java", "Alura", 420, "completed"),
      crs("Orientação a Objetos: princípios SOLID", "Udemy", 300, "completed"),
    ],
  },
  {
    id: "estruturas-dados",
    name: "Estruturas de Dados",
    categoryId: "fundamentos",
    parentId: "logica-programacao",
    icon: "listTree",
    summary: "Listas, pilhas, filas, árvores e quando usar cada uma.",
    courses: [
      crs("Estruturas de Dados com Java", "Alura", 450, "completed"),
      crs("Data Structures Fundamentals", "Coursera", 540, "completed"),
    ],
  },
  {
    id: "algoritmos",
    name: "Algoritmos",
    categoryId: "fundamentos",
    parentId: "estruturas-dados",
    icon: "binary",
    summary: "Complexidade, ordenação, busca e raciocínio algorítmico.",
    courses: [
      crs("Algoritmos e Complexidade", "Alura", 400, "completed"),
      crs("Introduction to Algorithms", "Coursera", 620, "completed"),
      crs("Algoritmos na prática", "YouTube", 180, "completed"),
    ],
  },

  // ── Backend ────────────────────────────────────────────────
  {
    id: "java",
    name: "Java",
    categoryId: "backend",
    parentId: null,
    icon: "coffee",
    summary: "A linguagem que sustenta boa parte do backend corporativo.",
    courses: [
      crs("Java Completo: do básico ao avançado", "Alura", 720, "completed"),
      crs("Java Masterclass", "Udemy", 900, "completed"),
      crs("Java para Backend", "Alura", 300, "completed"),
    ],
  },
  {
    id: "spring",
    name: "Spring Framework",
    categoryId: "backend",
    parentId: "java",
    icon: "leaf",
    summary: "Injeção de dependência, IoC e a base de todo o ecossistema Spring.",
    courses: [
      crs("Spring Framework: fundamentos", "Alura", 480, "completed"),
      crs("Spring do zero ao avançado", "Udemy", 660, "in_progress", 0.6),
      crs("Inversão de Controle na prática", "YouTube", 120, "not_started"),
    ],
  },
  {
    id: "spring-boot",
    name: "Spring Boot",
    categoryId: "backend",
    parentId: "spring",
    icon: "rocket",
    summary: "APIs REST produtivas com autoconfiguração e convenção sobre configuração.",
    courses: [
      crs("Spring Boot 3", "Alura", 510, "completed"),
      crs("APIs REST com Spring Boot", "Udemy", 380, "in_progress", 0.65),
      crs("Spring Boot Actuator e Observabilidade", "Udemy", 240, "not_started"),
    ],
  },
  {
    id: "spring-security",
    name: "Spring Security",
    categoryId: "backend",
    parentId: "spring",
    icon: "shield",
    summary: "Autenticação, autorização e JWT em aplicações Spring.",
    courses: [
      crs("Spring Security do zero", "Udemy", 600, "not_started"),
      crs("JWT e OAuth2 na prática", "Alura", 320, "not_started"),
    ],
  },
  {
    id: "spring-data-jpa",
    name: "Spring Data JPA",
    categoryId: "backend",
    parentId: "spring",
    icon: "database",
    summary: "Persistência declarativa e o mapeamento objeto-relacional.",
    courses: [
      crs("Spring Data JPA na prática", "Alura", 360, "not_started"),
      crs("JPA e Hibernate Completo", "Udemy", 480, "not_started"),
    ],
  },
  {
    id: "microservices",
    name: "Microservices",
    categoryId: "backend",
    parentId: "spring-boot",
    icon: "boxes",
    summary: "Decomposição de sistemas, comunicação entre serviços e resiliência.",
    courses: [
      crs("Arquitetura de Microsserviços", "Alura", 540, "not_started"),
      crs("Microservices com Spring Cloud", "Udemy", 620, "not_started"),
      crs("Padrões de Resiliência", "Coursera", 300, "not_started"),
    ],
  },
  {
    id: "node",
    name: "Node.js",
    categoryId: "backend",
    parentId: "java",
    icon: "server",
    summary: "JavaScript no servidor com um runtime orientado a eventos.",
    courses: [
      crs("Node.js: a jornada completa", "Alura", 450, "not_started"),
      crs("Node.js, Express e APIs REST", "Udemy", 400, "not_started"),
    ],
  },

  // ── Databases ──────────────────────────────────────────────
  {
    id: "postgresql",
    name: "PostgreSQL",
    categoryId: "databases",
    parentId: null,
    icon: "harddrive",
    summary: "SQL relacional, índices e modelagem de dados sólida.",
    courses: [
      crs("PostgreSQL do zero ao avançado", "Alura", 420, "in_progress", 0.7),
      crs("SQL para Análise de Dados", "Coursera", 360, "completed"),
      crs("Performance e Índices no PostgreSQL", "YouTube", 150, "not_started"),
    ],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    categoryId: "databases",
    parentId: "postgresql",
    icon: "layers",
    summary: "Modelagem orientada a documentos e consultas não relacionais.",
    courses: [
      crs("MongoDB Essencial", "Udemy", 300, "not_started"),
      crs("Modelagem de Dados com MongoDB", "Alura", 240, "not_started"),
    ],
  },
  {
    id: "redis",
    name: "Redis",
    categoryId: "databases",
    parentId: "postgresql",
    icon: "zap",
    summary: "Cache, filas leves e estruturas de dados em memória.",
    courses: [
      crs("Redis na prática", "Udemy", 210, "not_started"),
      crs("Cache com Redis e Spring", "Alura", 180, "not_started"),
    ],
  },

  // ── Frontend ───────────────────────────────────────────────
  {
    id: "html-css",
    name: "HTML & CSS",
    categoryId: "frontend",
    parentId: null,
    icon: "fileCode",
    summary: "Estrutura semântica e estilo — a base visual da web.",
    courses: [
      crs("HTML e CSS do zero", "Alura", 360, "completed"),
      crs("CSS Layout: Flexbox e Grid", "Udemy", 240, "completed"),
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    categoryId: "frontend",
    parentId: "html-css",
    icon: "braces",
    summary: "A linguagem que roda em todo navegador do planeta.",
    courses: [
      crs("JavaScript Moderno: ES6+", "Alura", 480, "completed"),
      crs("JavaScript: The Complete Guide", "Udemy", 900, "completed"),
      crs("Assincronismo em JS", "YouTube", 140, "completed"),
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    categoryId: "frontend",
    parentId: "javascript",
    icon: "fileType",
    summary: "Tipagem estática sobre JavaScript para sistemas maiores.",
    courses: [
      crs("TypeScript do zero", "Alura", 300, "completed"),
      crs("TypeScript Avançado", "Udemy", 360, "in_progress", 0.4),
      crs("Generics e Utility Types", "YouTube", 90, "not_started"),
    ],
  },
  {
    id: "react",
    name: "React",
    categoryId: "frontend",
    parentId: "typescript",
    icon: "atom",
    summary: "Componentes, estado e a biblioteca mais usada para UI.",
    courses: [
      crs("React: a jornada completa", "Alura", 540, "in_progress", 0.55),
      crs("React com TypeScript", "Udemy", 420, "not_started"),
    ],
  },
  {
    id: "nextjs",
    name: "Next.js",
    categoryId: "frontend",
    parentId: "react",
    icon: "triangle",
    summary: "SSR, rotas e o framework React de produção.",
    courses: [
      crs("Next.js 14 na prática", "Alura", 360, "not_started"),
      crs("Fullstack com Next.js", "Udemy", 480, "not_started"),
    ],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    categoryId: "frontend",
    parentId: "javascript",
    icon: "wind",
    summary: "Estilização utilitária direto no markup.",
    courses: [
      crs("Tailwind CSS do zero", "YouTube", 120, "not_started"),
      crs("Design Systems com Tailwind", "Udemy", 220, "not_started"),
    ],
  },

  // ── DevOps ─────────────────────────────────────────────────
  {
    id: "docker",
    name: "Docker",
    categoryId: "devops",
    parentId: null,
    icon: "container",
    summary: "Containers, imagens e ambientes reproduzíveis.",
    courses: [
      crs("Docker do zero ao avançado", "Alura", 400, "in_progress", 0.5),
      crs("Docker e Docker Compose", "Udemy", 320, "in_progress", 0.3),
    ],
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    categoryId: "devops",
    parentId: "docker",
    icon: "ship",
    summary: "Orquestração de containers em escala.",
    courses: [
      crs("Kubernetes na prática", "Udemy", 540, "not_started"),
      crs("K8s para desenvolvedores", "Alura", 360, "not_started"),
      crs("Helm Charts Essencial", "YouTube", 100, "not_started"),
    ],
  },
  {
    id: "cicd",
    name: "CI/CD",
    categoryId: "devops",
    parentId: "docker",
    icon: "gitMerge",
    summary: "Integração e entrega contínua automatizadas.",
    courses: [
      crs("CI/CD com GitHub Actions", "Alura", 260, "not_started"),
      crs("Pipelines com Jenkins", "Udemy", 300, "not_started"),
    ],
  },
  {
    id: "nginx",
    name: "Nginx",
    categoryId: "devops",
    parentId: "docker",
    icon: "network",
    summary: "Proxy reverso, balanceamento de carga e servidor web.",
    courses: [
      crs("Nginx na prática", "Udemy", 180, "not_started"),
      crs("Reverse Proxy e Load Balancing", "YouTube", 90, "not_started"),
    ],
  },

  // ── Cloud ──────────────────────────────────────────────────
  {
    id: "cloud-fundamentals",
    name: "Cloud Fundamentals",
    categoryId: "cloud",
    parentId: null,
    icon: "cloud",
    summary: "Conceitos essenciais de computação em nuvem.",
    courses: [
      crs("Fundamentos de Cloud Computing", "Coursera", 300, "in_progress", 0.5),
      crs("Cloud para Desenvolvedores", "Alura", 240, "not_started"),
    ],
  },
  {
    id: "serverless",
    name: "Serverless",
    categoryId: "cloud",
    parentId: "cloud-fundamentals",
    icon: "cloudCog",
    summary: "Funções sob demanda sem gerenciar servidores.",
    courses: [
      crs("Serverless na prática", "Udemy", 260, "not_started"),
      crs("Arquiteturas Event-Driven", "Alura", 220, "not_started"),
    ],
  },
  {
    id: "terraform",
    name: "Terraform",
    categoryId: "cloud",
    parentId: "cloud-fundamentals",
    icon: "layers3",
    summary: "Infraestrutura como código, de forma declarativa.",
    courses: [
      crs("Terraform do zero", "Udemy", 340, "not_started"),
      crs("IaC na prática com Terraform", "YouTube", 130, "not_started"),
    ],
  },

  // ── AWS ────────────────────────────────────────────────────
  {
    id: "ec2",
    name: "EC2",
    categoryId: "aws",
    parentId: null,
    icon: "server",
    summary: "Máquinas virtuais elásticas na AWS.",
    courses: [
      crs("AWS EC2 na prática", "Udemy", 240, "not_started"),
      crs("AWS Certified Cloud Practitioner", "Coursera", 480, "not_started"),
    ],
  },
  {
    id: "s3",
    name: "S3",
    categoryId: "aws",
    parentId: "ec2",
    icon: "archive",
    summary: "Armazenamento de objetos altamente durável.",
    courses: [
      crs("AWS S3 Essencial", "Udemy", 160, "not_started"),
      crs("Storage e Backup na AWS", "Alura", 180, "not_started"),
    ],
  },
  {
    id: "lambda",
    name: "Lambda",
    categoryId: "aws",
    parentId: "ec2",
    icon: "fn",
    summary: "Funções serverless orquestradas pela AWS.",
    courses: [
      crs("AWS Lambda na prática", "Udemy", 220, "not_started"),
      crs("Serverless Framework com AWS", "YouTube", 110, "not_started"),
    ],
  },

  // ── Arquitetura ────────────────────────────────────────────
  {
    id: "design-patterns",
    name: "Design Patterns",
    categoryId: "arquitetura",
    parentId: null,
    icon: "puzzle",
    summary: "Soluções reutilizáveis para problemas recorrentes de design.",
    courses: [
      crs("Design Patterns em Java", "Alura", 400, "not_started"),
      crs("Padrões de Projeto GoF", "Udemy", 360, "not_started"),
    ],
  },
  {
    id: "clean-architecture",
    name: "Clean Architecture",
    categoryId: "arquitetura",
    parentId: "design-patterns",
    icon: "layers",
    summary: "Camadas, dependências e regras de negócio protegidas.",
    courses: [
      crs("Clean Architecture na prática", "Udemy", 320, "not_started"),
      crs("Arquitetura Limpa com Java", "Alura", 280, "not_started"),
    ],
  },
  {
    id: "ddd",
    name: "Domain-Driven Design",
    categoryId: "arquitetura",
    parentId: "clean-architecture",
    icon: "boxes",
    summary: "Modelagem estratégica focada no domínio do negócio.",
    courses: [
      crs("DDD na prática", "Udemy", 380, "not_started"),
      crs("Domain-Driven Design Fundamentals", "Coursera", 420, "not_started"),
    ],
  },
  {
    id: "system-design",
    name: "System Design",
    categoryId: "arquitetura",
    parentId: "design-patterns",
    icon: "network",
    summary: "Escalabilidade, trade-offs e desenho de sistemas distribuídos.",
    courses: [
      crs("System Design Interview", "Udemy", 460, "not_started"),
      crs("Grokking System Design", "Coursera", 400, "not_started"),
    ],
  },

  // ── Testes ─────────────────────────────────────────────────
  {
    id: "junit",
    name: "JUnit",
    categoryId: "testes",
    parentId: null,
    icon: "check",
    summary: "Testes unitários no ecossistema Java.",
    courses: [
      crs("JUnit 5 na prática", "Alura", 260, "not_started"),
      crs("Testes Unitários com Java", "Udemy", 300, "not_started"),
    ],
  },
  {
    id: "mockito",
    name: "Mockito",
    categoryId: "testes",
    parentId: "junit",
    icon: "drama",
    summary: "Mocks, stubs e isolamento de dependências em testes.",
    courses: [
      crs("Mockito Essencial", "Udemy", 180, "not_started"),
      crs("Mocks na prática com Java", "YouTube", 90, "not_started"),
    ],
  },
  {
    id: "tdd",
    name: "TDD",
    categoryId: "testes",
    parentId: "junit",
    icon: "repeat",
    summary: "Red, green, refactor — testes guiando o design.",
    courses: [
      crs("TDD na prática", "Alura", 300, "not_started"),
      crs("Test-Driven Development", "Coursera", 340, "not_started"),
    ],
  },
  {
    id: "integration-tests",
    name: "Testes de Integração",
    categoryId: "testes",
    parentId: "junit",
    icon: "link",
    summary: "Validando a integração entre componentes reais.",
    courses: [
      crs("Testes de Integração com Spring", "Udemy", 260, "not_started"),
      crs("Testcontainers na prática", "Alura", 220, "not_started"),
    ],
  },

  // ── Git ────────────────────────────────────────────────────
  {
    id: "git-basico",
    name: "Git Básico",
    categoryId: "git",
    parentId: null,
    icon: "gitBranch",
    summary: "Commits, branches e o controle de versão essencial.",
    courses: [
      crs("Git e GitHub do zero", "Alura", 180, "completed"),
      crs("Controle de Versão com Git", "Udemy", 150, "completed"),
    ],
  },
  {
    id: "github-flow",
    name: "GitHub Flow",
    categoryId: "git",
    parentId: "git-basico",
    icon: "gitPullRequest",
    summary: "Pull requests, code review e fluxo colaborativo.",
    courses: [
      crs("GitHub Flow na prática", "YouTube", 90, "not_started"),
      crs("Colaboração em equipe com Git", "Alura", 140, "not_started"),
    ],
  },
  {
    id: "git-avancado",
    name: "Git Avançado",
    categoryId: "git",
    parentId: "github-flow",
    icon: "gitCommit",
    summary: "Rebase interativo, cherry-pick e histórico sob controle.",
    courses: [
      crs("Git Avançado", "Udemy", 220, "not_started"),
      crs("Rebase, Merge e Cherry-pick", "Alura", 160, "not_started"),
    ],
  },
];

/** Cross-category relations — technologies that connect beyond the strict prerequisite tree. */
export const CROSS_LINKS: Array<{ from: string; to: string }> = [
  { from: "spring-data-jpa", to: "postgresql" },
  { from: "microservices", to: "docker" },
  { from: "cloud-fundamentals", to: "ec2" },
  { from: "system-design", to: "microservices" },
  { from: "cicd", to: "github-flow" },
  { from: "terraform", to: "kubernetes" },
];

export function findTech(id: string): TechDef | undefined {
  return TECHS.find((t) => t.id === id);
}
