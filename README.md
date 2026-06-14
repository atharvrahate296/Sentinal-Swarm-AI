# 🌌 Sentinel Swarm AI

### _The Spatial Operating System for Autonomous Multi-Agent Intelligence_

[![Status](https://img.shields.io/badge/Status-Investor--Ready-0078d4?style=for-the-badge&logo=microsoft&logoColor=white)](https://github.com/rohan1252030019-netizen/sentinel-swarm-ai)
![License](https://img.shields.io/badge/License-MIT-30d158?style=for-the-badge&logo=opensourceinitiative&logoColor=white)
![Interface](https://img.shields.io/badge/UI-VisionOS%20Spatial%20OS-00e5ff?style=for-the-badge&logo=apple&logoColor=white)
![Security](https://img.shields.io/badge/Security-Zero%20Trust%20Consensus-ff453a?style=for-the-badge&logo=defender&logoColor=white)

---
Sentinel Swarm AI is a spatial operating system designed for autonomous multi-agent security orchestration. It provides real-time threat detection, consensus-based validation, and self-healing recovery mechanisms for AI agent networks.

## Core Features

- **3D Swarm Visualization**: Interactive canvas displaying agent network topology and real-time status.
- **6-Layer Consensus Pipeline**: A structured defense mechanism (Planner → Security → Memory → Validator → Compliance → Recovery).
- **Spotlight Command Center**: Natural language interface for seamless system control.
- **Attack Simulation Engine**: Automated compromise chain testing with visual walkthroughs.
- **Executive Dashboard**: Persona-based views tailored for CEOs, CISOs, Operations, and Investors.
- **Digital Immune System**: Self-learning threat signature rules.
- **Black Box Forensics**: Step-by-step replay capabilities for agent decision chains.
- **Self-Healing Recovery**: Automated state rollback upon compromise detection.
## 🔮 Spatial Interface Overview

Sentinel Swarm AI prioritizes immersive spatial interaction over traditional metric widgets:

```
+-----------------------------------------------------------------------+
|  [Status: Active]                                   [RBAC Override]   |
|                                                                       |
|                       *   CivilianAgent_0x82a                         |
|           PlannerAgent                                                |
|                *               LLM Engine                             |
|                                    *                                  |
|         * SecurityAgent                          * ValidatorAgent     |
|                                                                       |
|                                  * RecoveryAgent                      |
|                                                                       |
|                                                                       |
|                                                                       |
|                [ Swarm ] [ Cmd ] [ GRC ] [ Video ] [ Policy ]         |
+-----------------------------------------------------------------------+
```

*   **Swarm Space**: Drag and orbit the 3D-like glowing agent civilization particle swarm. Hover and click nodes to view floating glass telemetry cards.
*   **Command Bar**: Press `Cmd+K` to search anything. Shortcut pills trigger immediate compromise simulations or reputation health audits.
*   **Executive boards**: Flip to the GRC Storyboard to view financial and compliance metrics displayed in clean typography.

---

## 🏗️ Consensus Architecture Diagram

The diagram below details the sequence of transactions passing through the 6-layer Consensus Validation Pipeline:

```mermaid
sequenceDiagram
    autonumber
    actor Client as "Client Request"
    participant Orchestrator as "Orchestrator Agent"
    participant Security as "SecurityAgent (Input Guard)"
    participant Memory as "MemoryAgent (RAG/MCP)"
    participant Validator as "ValidatorAgent (Consensus)"
    participant Compliance as "ComplianceAgent (GRC)"
    participant Recovery as "RecoveryAgent (Self-Heal)"

    Client->>Orchestrator: Submit Prompt + Token
    activate Orchestrator
    Orchestrator->>Security: Pre-execution Scan
    activate Security
    Note over Security: Verifies prompt injections & jailbreaks
    Security-->>Orchestrator: Input Safe (Trust: 0.99)
    deactivate Security

    Orchestrator->>Memory: Fetch Context
    activate Memory
    Note over Memory: Safe RAG query / MCP filesystem filter
    Memory-->>Orchestrator: Context Appended
    deactivate Memory

    Orchestrator->>Validator: Validate LLM Proposed Output
    activate Validator
    Note over Validator: Consensus audit of parameters
    Validator-->>Orchestrator: Output Verified
    deactivate Validator

    Orchestrator->>Compliance: Verify Policy Rules
    activate Compliance
    Note over Compliance: Verifies SOC2 / GDPR / PII constraints
    Compliance-->>Orchestrator: Compliant
    deactivate Compliance

    Orchestrator-->>Client: Safe Output Dispatched
    deactivate Orchestrator

    alt Violation / Compromise Flagged
        Orchestrator->>Recovery: Trigger Quarantines
        activate Recovery
        Note over Recovery: Rollback settings, deploy new node
        Recovery-->>Orchestrator: State Baseline Synced
        deactivate Recovery
    end
```

---


## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rohan1252030019-netizen/sentinel-swarm-ai.git
   cd sentinel-swarm-ai
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

### Configuration

Set up your environment variables.

**Backend** (`backend/.env`):
```env
PORT=5000
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
AZURE_OPENAI_KEY="your-azure-key"
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL="http://localhost:5000"
VITE_WS_URL="ws://localhost:5000"
```

### Running Locally

Start both the frontend and backend servers concurrently:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Deployment

To deploy the application using Docker:

```bash
docker-compose -f docker/docker-compose.yml up --build -d
```
- Frontend: `http://localhost:80`
- Backend: `http://localhost:5000`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
