# Nexus Roadmap

Trilha de estudos gamificada: uma árvore de tecnologias (React Flow) com cursos por
tecnologia, progresso por XP/nível, conquistas e um timer Pomodoro integrado que
concede XP real ao terminar um ciclo de foco. Todo o progresso é persistido —
sobrevive a restart da aplicação e a F5 na página.

> Projeto de portfólio, single-user (sem login).

## Funcionalidades

- **Roadmap visual** — árvore de categorias/tecnologias com dependências (uma tecnologia destrava a seguinte), progresso por curso, tecnologia e categoria.
- **Pomodoro** — ciclo de foco/pausa; ao completar um foco, os minutos são registrados no curso ativo e viram XP.
- **XP e nível** — XP por sessão de estudo, curva de nível progressiva, com toast ao subir de nível.
- **Conquistas** — desbloqueadas automaticamente no servidor (primeira conclusão, 10 sessões, 100h de estudo, estudar depois das 22h) ou pelo frontend quando dependem da árvore de categorias (ex: concluir uma categoria inteira).
- **Stats** — página com visão consolidada do progresso.

## Stack

**Backend**

| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 4 |
| Banco | MySQL (persistência real) / H2 em memória nos testes |
| Persistência | Spring Data JPA / Hibernate |
| Validação | Bean Validation |
| Docs de API | springdoc-openapi (Swagger UI) |
| Utilitário | Lombok |

**Frontend**

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework | React 19 + Vite |
| Diagrama | React Flow |
| Estilo | Tailwind CSS 4 |
| Animação | Framer Motion |
| Ícones | Lucide |

## Como rodar (dev)

Pré-requisito: **Java 21**, **Node.js** e **Docker** ligado.

**Backend**

```bash
docker compose up -d
./mvnw spring-boot:run
```

- API: `http://localhost:8081`
- Swagger UI: `http://localhost:8081/swagger-ui/index.html`

Testes (usam H2 em memória, não precisam de Docker):

```bash
./mvnw test
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5174`
- Aponta para a API em `http://localhost:8081` por padrão; ajustável via `VITE_API_URL`.

Backend e frontend rodam como dois processos separados.

## Configuração (variáveis de ambiente)

**Backend**

| Variável | Default (dev) | Descrição |
|---|---|---|
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | credenciais do `compose.yaml` local | Conexão com o MySQL. |
| `PORT` | `8081` | Porta da API. |
| `CORS_ALLOWED_ORIGIN` | `http://localhost:5174` | Origem liberada no CORS (frontend). |

**Frontend**

| Variável | Default (dev) | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8081` | Base URL da API. |

## API

- `GET /progresso` — snapshot completo: progresso do usuário, status de cada curso e conquistas.
- `PATCH /cursos/{cursoId}` — define manualmente o status de um curso (não concede XP).
- `POST /cursos/{cursoId}/sessoes-estudo` — registra minutos estudados, concede XP, avalia nível e conquistas automáticas.
- `POST /conquistas/{conquistaId}/desbloquear` — desbloqueia uma conquista (idempotente); usado pelo frontend para conquistas que dependem da árvore de categorias.

## Arquitetura

O catálogo do roadmap (categorias, tecnologias, cursos, duração, links) é conteúdo
estático que vive só no frontend (`frontend/src/data/roadmap.ts`) — não muda com
frequência e não depende de usuário. O backend é dono só do que é **dinâmico**:
status/minutos estudados por curso, XP/nível e conquistas desbloqueadas. Por isso
os endpoints de curso recebem a duração total como parâmetro em vez do backend
manter uma cópia do catálogo.

## Status

Backend e frontend integrados de ponta a ponta — persistência real via MySQL,
gamificação (XP, nível, conquistas) calculada no servidor.
