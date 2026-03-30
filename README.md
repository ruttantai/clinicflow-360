# ClinicFlow 360

ClinicFlow 360 is a clinic operations platform for appointment management, billing, and inventory tracking. The project is structured as a real product workspace with a web app, API service, background jobs, and deployment scaffolding.

## Current scope
- Patient appointments with status tracking
- Invoice creation from completed appointments
- Inventory threshold monitoring for medical supplies

## Tech stack
- Frontend: React + TypeScript
- Backend: FastAPI + Python
- Data: PostgreSQL
- Async work: Celery
- Runtime: Docker

## Repository layout
- docs/: architecture notes, ADRs, and roadmap
- src/frontend/: React application
- src/backend/: FastAPI service
- tests/: API and UI tests
- infra/: container and deployment manifests
- scripts/: local setup helpers

## Quick start
1. Start backend: uvicorn main:app --reload (from src/backend)
2. Start frontend: npm install && npm run dev (from src/frontend)
3. Open the frontend and test appointment creation flow.

## Roadmap
1. Add authentication and role-based permissions.
2. Move from in-memory data to PostgreSQL models.
3. Add asynchronous billing reconciliation jobs.
4. Add CI and integration tests.
