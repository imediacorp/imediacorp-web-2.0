Rhapsode – New System Design (Aligned with Commercial Design)

Date: 2025-10-13

Purpose
- Translate the commercial multi-user, multi-story, personalized platform design into a practical, incremental system architecture that integrates this Python engine.

1. Architecture Overview
- Frontend: Next.js (React) SPA with NextAuth.js Google OAuth; protected routes for /dashboard, /stories/[id], /settings, /billing.
- API Gateway (BFF): Node.js (Fastify/Express) providing a unified API with user scoping; handles JWT verification, rate limits, and response shaping for the frontend.
- Microservices:
  - Auth Service: Issues/verifies JWT, manages Google OAuth callbacks, bootstrap user profile, privacy controls.
  - Story Service: CRUD for Story, collaboration roles, invitations, beta-reader links, versioning.
  - Graph Service: Neo4j operations per story; GraphRAG endpoints; indexing & caching.
  - Personalization Service: Ingest samples and telemetry; compute style metrics (perplexity, tone, diversity); provide style hints.
  - Content Service: LLM-backed suggestions/outlines, constrained by GraphRAG context and personalization.
  - Billing Service: Stripe subscriptions, entitlements; webhooks to update access rights.
- Python Engine Service: This repository, packaged as a service with REST endpoints /extract, /validate, /load; connects to Neo4j using shared config.

2. Data Model (Neo4j)
- Nodes: User, Story, Character, Location, Event, Note, Draft
- Relationships:
  - (User)-[:OWNS]->(Story)
  - (User)-[:COLLABORATES_ON {role}]->(Story)
  - (Story)-[:HAS_CHARACTER]->(Character)
  - (Story)-[:HAS_LOCATION]->(Location)
  - (Story)-[:HAS_EVENT]->(Event)
  - (Story)-[:HAS_DRAFT]->(Draft)
- Multi-tenancy: All queries filtered by userId; optional enterprise isolation by database per tenant.

3. Storage & Infra
- Neo4j Aura or self-managed Neo4j cluster.
- Postgres or MongoDB for documents (manuscripts, feedback, settings), referenced by Neo4j IDs.
- Redis for session store, personalization cache, GraphRAG cache.
- S3/GCS for exports, backups, large assets.

4. Security
- Google OAuth via NextAuth.js; scopes limited to profile/email.
- JWT with short TTL + refresh tokens; httpOnly secure cookies.
- RBAC for stories (Owner, Editor, Viewer).
- Data export/delete workflows; audit logs.

5. Observability
- Prometheus + Grafana metrics; structured JSON logs; OpenTelemetry traces spanning frontend -> gateway -> services -> Python engine -> Neo4j.

6. API Contracts (sketch)
- Gateway
  - GET /me -> user profile
  - GET /stories -> list stories for user
  - POST /stories -> create story
  - GET /stories/:id -> story detail
  - POST /stories/:id/collaborators -> invite with role
  - POST /stories/:id/extract -> delegates to Python Engine /extract
  - POST /stories/:id/load -> delegates to Python Engine /load
  - GET /stories/:id/graph -> graph snapshot (via Graph Service)
  - POST /content/suggest -> delegates to Content Service (LLM)
- Python Engine
  - POST /extract {inputUrl|text, outputPath?} -> {graphRef, counts}
  - POST /validate {graph} -> {valid, warnings}
  - POST /load {graphRef|graph, storyId} -> {nodes_loaded, relationships_loaded}

7. Integration Plan (with this repo)
- Phase 1: Add a lightweight FastAPI/Flask wrapper exposing /extract, /validate, /load, reusing current modules. Secure with service token.
- Phase 2: Implement loader and validator; add batch writes to Neo4j; add request id logging.
- Phase 3: Add GraphRAG endpoints and caching; integrate personalization hints as inputs.

8. Deployment
- Containerize Python engine (Dockerfile) with gunicorn/uvicorn.
- Helm charts for services; environment via ConfigMaps/Secrets.
- CI/CD: GitHub Actions for tests, build, push images; deploy to Kubernetes.

9. Roadmap Alignment
- MVP: Auth + Dashboard + Multi-story basics; use Python engine for extraction; Stripe billing for Premium.
- Collaboration & Real-time: WebSockets, roles, invites.
- Enterprise: Per-tenant databases, SSO, advanced monitoring.

10. Open Questions
- LLM provider(s) and prompt templates; cost control.
- Data residency requirements; per-region deployments.
- Extent of offline support and conflict resolution strategy.
