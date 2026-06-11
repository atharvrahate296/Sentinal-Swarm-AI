# Technical Specifications & API Contracts (Phase 2)

This document contains updated API definitions, schemas, and configurations for the Sentinel Swarm AI SOC.

---

## 1. Updated Database Schema (JSON Representation)

```json
{
  "User": {
    "id": "String (UUID)",
    "username": "String",
    "role": "Enum('Security Admin', 'Security Analyst', 'Application Developer', 'Guest')"
  },
  "SecurityEvent": {
    "id": "String (UUID)",
    "timestamp": "ISO DateString",
    "severity": "Enum('Low', 'Medium', 'High', 'Critical')",
    "eventType": "Enum('Prompt Injection', 'Jailbreak Attack', 'Data Exfiltration', 'Tool Abuse', 'Privilege Escalation', 'MCP Exploitation', 'Multi-Agent Manipulation')",
    "sourceAgent": "String",
    "attackerPrompt": "String",
    "mitigated": "Boolean",
    "mitigationInfo": "String",
    "riskScore": "Float (0.0 to 1.0)",
    "traceId": "String",
    "businessImpact": {
      "potentialDataLoss": "String",
      "estimatedCostImpact": "Float",
      "securityImprovementScore": "Int",
      "complianceBenefit": "String"
    }
  }
}
```

---

## 2. API Contract Specifications

### **POST `/api/simulations/run`**
Runs a single attack simulation scenario.
- **Request Body**:
```json
{
  "id": "sim-005"
}
```
- **Response**: `200 OK`
```json
{
  "success": false,
  "finalOutput": "[SHIELD ACTIVE] Escalation request rejected due to invalid cryptographic signature.",
  "riskScore": 0.93,
  "traceId": "tr-283190",
  "steps": [
    {
      "agentName": "ComplianceAgent",
      "action": "Compliance and RBAC verification",
      "status": "failed",
      "score": 0.93,
      "confidence": 0.96,
      "reasoning": "REJECT: Privilege Escalation detected for Guest role context."
    }
  ]
}
```

### **POST `/api/simulations/auto`**
Triggers "Judge Demo Mode" to execute all 7 simulations sequentially.
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "All threat mitigations compiled.",
  "results": [...]
}
```

---

## 3. Kubernetes Multi-Service Manifest

Below is the production deployment configuration for both the Frontend Nginx static files and the Backend Node Swarm server.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sentinel-swarm-deployment
  namespace: sentinel-sec
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sentinel-sec
  template:
    metadata:
      labels:
        app: sentinel-sec
    spec:
      containers:
      - name: backend
        image: sentinelregistry.azurecr.io/sentinel-backend:latest
        ports:
        - containerPort: 5000
        resources:
          limits:
            cpu: "1"
            memory: "1Gi"
      - name: frontend
        image: sentinelregistry.azurecr.io/sentinel-frontend:latest
        ports:
        - containerPort: 80
```
