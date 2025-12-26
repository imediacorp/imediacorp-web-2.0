# Web 2.0 Demo Framework - Architecture

## Overview

This document describes the architecture of the Web 2.0 demo framework for HDPD dashboards, designed to be SaaS-ready and extensible to all domain dashboards.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React/Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Gas Vehicle  │  │ Electric     │  │  Other       │      │
│  │  Dashboard   │  │  Vehicle     │  │  Dashboards  │      │
│  │              │  │  Dashboard   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│              ┌─────────────▼─────────────┐                  │
│              │   Dashboard Framework     │                  │
│              │   (Reusable Components)   │                  │
│              └─────────────┬─────────────┘                  │
│                            │                                │
│              ┌─────────────▼─────────────┐                  │
│              │      API Client Layer     │                  │
│              │    (Axios + TypeScript)   │                  │
│              └─────────────┬─────────────┘                  │
└────────────────────────────┼────────────────────────────────┘
                             │
                    HTTP REST API
                             │
┌────────────────────────────▼────────────────────────────────┐
│            Python FastAPI Backend (Port 8000)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Vehicle API  │  │ CHADD/HDPD   │  │   Services   │      │
│  │   Routes     │  │    Core      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router for file-based routing
- **React 18**: UI library with hooks and modern patterns
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for data visualization
- **Axios**: HTTP client with interceptors
- **Zustand**: Lightweight state management (optional, ready for use)

### Backend (Existing)
- **FastAPI**: Python web framework
- **Pydantic**: Data validation
- **CHADD/HDPD Core**: Diagnostic algorithms

## Component Architecture

### Dashboard Framework Components

#### DashboardLayout
- Main wrapper component
- Provides consistent header, sidebar, and layout
- Accepts domain-specific content

#### MetricsCard
- Displays S/Q/U/D metrics
- Shows health score with color coding
- Reusable across all domains

#### TimeSeriesChart
- Time-series data visualization
- Configurable lines and colors
- Responsive design

### API Client Architecture

```
API Client (Axios Instance)
  ├── Base Client (client.ts)
  │   ├── Request interceptor (auth, headers)
  │   └── Response interceptor (error handling)
  │
  └── Domain Clients
      ├── vehicles.ts (gas/electric)
      ├── grid.ts (future)
      ├── medical.ts (future)
      └── ...
```

## Data Flow

### Assessment Flow

```
User Action (Click "Run Assessment")
  ↓
Frontend: Prepare telemetry data
  ↓
API Client: POST /api/vehicle/{type}/vehicles/{id}/assess
  ↓
FastAPI Backend: Process request
  ├── Validate telemetry (Pydantic)
  ├── Call domain service
  ├── Map to S/Q/U/D (CHADD)
  └── Return assessment response
  ↓
Frontend: Update UI with results
  ├── Display S/Q/U/D metrics
  ├── Show health score
  └── Render charts
```

## State Management

Currently using React state (`useState`) for component-level state. Zustand is available for global state management when needed (e.g., user authentication, preferences, cached data).

## Styling Architecture

- **Tailwind CSS**: Utility-first approach
- **Custom Theme**: Extended colors for primary, success, warning, danger
- **Responsive Design**: Mobile-first approach
- **Component Classes**: Reusable utility classes

## Type Safety

- **TypeScript**: Full type coverage
- **Shared Types**: Common types in `src/types/`
- **Domain Types**: Domain-specific types in respective files
- **API Types**: Matching Pydantic models from backend

## Extensibility Patterns

### Adding a New Dashboard

1. **Create Types** (`src/types/[domain].ts`)
2. **Create API Client** (`src/lib/api/[domain].ts`)
3. **Create Dashboard Page** (`src/app/dashboards/[domain]/page.tsx`)
4. **Use Framework Components** (DashboardLayout, MetricsCard, etc.)

### Adding New Components

1. Create in `src/components/[category]/`
2. Export from appropriate index file
3. Document props and usage
4. Add to component library

## SaaS-Ready Features

### Authentication (Ready)
- API client interceptors prepared for token injection
- Environment variables for auth configuration
- Protected route patterns (can be implemented)

### Multi-Tenancy (Ready)
- Tenant context can be added to API requests
- Backend supports tenant isolation
- Frontend can display tenant information

### Error Handling
- Global error boundary (can be added)
- API error interception
- User-friendly error messages

### Performance
- Next.js automatic code splitting
- Image optimization
- Static generation where possible

## Security Considerations

- API keys in environment variables (server-side)
- CORS configuration on backend
- Input validation on both frontend and backend
- HTTPS in production (required)

## Deployment Architecture

### Development
- Next.js dev server (port 3000)
- FastAPI backend (port 8000)
- Hot reload enabled

### Production (Recommended)
- **Frontend**: Vercel, Netlify, or self-hosted Node.js
- **Backend**: Same deployment as Python backend
- **CDN**: Static assets via Vercel/Netlify CDN

### Docker (Future)
- Multi-stage build for optimization
- Separate containers for frontend/backend
- docker-compose for local development

## Testing Strategy

### Unit Tests (Future)
- Component tests (React Testing Library)
- API client tests (Jest)
- Type checking (TypeScript)

### Integration Tests (Future)
- API integration tests
- End-to-end tests (Playwright/Cypress)

### Current Testing
- Manual testing via dev server
- Type checking: `npm run type-check`

## Performance Optimization

- **Code Splitting**: Automatic via Next.js
- **Image Optimization**: Next.js Image component
- **API Caching**: TanStack Query (can be integrated)
- **Bundle Size**: Tree shaking, dynamic imports

## Monitoring & Analytics (Future)

- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Performance monitoring (Web Vitals)
- API monitoring (backend logs)

## Roadmap

### Phase 1: Foundation (Current)
- ✅ Basic framework structure
- ✅ GV/EV dashboards
- ✅ Core components
- ✅ API integration

### Phase 2: Enhancement
- [ ] All domain dashboards
- [ ] Real-time updates (WebSocket)
- [ ] Advanced charts
- [ ] Data export

### Phase 3: SaaS Features
- [ ] Authentication
- [ ] Multi-tenancy UI
- [ ] User management
- [ ] Billing integration

### Phase 4: Advanced
- [ ] Mobile app (React Native)
- [ ] Offline support
- [ ] Advanced analytics
- [ ] Custom dashboards

