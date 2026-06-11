# Sentinel Swarm AI

Sentinel Swarm AI is a production-ready, industry-grade AI Security Operating System for Agentic Applications. Designed with a multi-agent swarm architecture, it protects autonomous AI agents from prompt injection, jailbreaks, data exfiltration, tool abuse, and compliance violations.

---

## Key Features

1.  **Consensus Swarm Defense**: Utilizes multiple coordinate agents (`Planner`, `Security`, `Compliance`, `Memory`, `Validator`, `Recovery`, and `Monitoring`) to inspect input queries and output responses before they hit external services.
2.  **Microsoft Fluent 2 Design UI**: Built with a clean, dark-mode dashboard showcasing:
    - Interactive live swarm communication diagram.
    - Attack simulator control panel.
    - Live terminal trace logging.
    - Interactive security event database grid.
3.  **Real-Time Simulation Console**: Features five built-in advanced attack scenarios to show real-time mitigations and self-healing protocols.
4.  **1-Click Judge Demo Mode**: Triggers a sequence of simulated attacks, showing instant dashboard telemetry updates and audit trails.

---

## Folder Structure

```
sentinel-swarm-ai/
├── backend/                  # Node.js + Express Swarm Engine
│   └── src/
│       ├── config/           # Environment config parameters
│       ├── database/         # SQLite DB schemas and states
│       ├── services/         # Security scanning engine & attack simulator
│       ├── swarm/            # Planner, Security, Validator, Memory, Compliance, Recovery, Monitoring agents
│       └── server.ts         # Server entrypoint and WebSockets connection
├── frontend/                 # React + Vite + TypeScript Dashboard
│   └── src/
│       ├── components/       # Fluent UI design panels
│       ├── styles/           # CSS design variables and variables.css
│       └── App.tsx           # Dashboard tabs and visualization flows
├── docs/                     # Pitch deck, presentation guides, API specifications
└── docker/                   # Docker deployment configurations
```

---

## Quick Start (Local Run)

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```

### 2. Start the Application
Run from the root directory:
```bash
npm run dev
```

The system will start:
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)

---

## Docker Deployment
Build and run the entire platform in isolated containers:
```bash
cd docker
docker-compose up --build
```
The frontend will then be exposed on port `80`, and the backend api on port `5000`.
