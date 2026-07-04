# Pasindu Jayasinghe - Systems & DevOps Portfolio

A professional, high-fidelity Systems and DevOps portfolio showcase. Built with a modern Next.js 16 and Tailwind CSS v4 architecture, containerized with Docker, and designed to run inside an on-premises Kubernetes cluster using GitOps principles.

---

## 🛠️ Built With

* **Frontend**: Next.js 16 (App Router), React 19, Framer Motion, and Tailwind CSS v4.
* **Database & ORM**: PostgreSQL, mapped and queried via Prisma.
* **Containerization**: Docker multi-stage builds.
* **Orchestration**: Kubernetes (K3s) with automated resource limits.
* **Security & Ingress**: Cloudflare Zero Trust (Access Policies & Tunnels).
* **GitOps**: ArgoCD synchronization.

---

## 💡 Key Design & Engineering Concepts

### 1. Interactive CLI Terminal Simulator
Simulates a live SSH terminal session with easy/medium difficulty interfaces, allowing users to query telemetry data, run custom command configurations (e.g., simulating Terraform steps), and interact directly with the portfolio's mock terminal engine.

### 2. Infrastructure Telemetry Dashboard
Visualizes live platform metrics including processor load history, memory usage allocation, system uptime indicators, and global service node mappings.

### 3. Encrypted Credentials Vault
A security-focused interface module showing credentials verification, secure handshake sequences, and decrypted telemetry metrics log streaming.

---

## 🛡️ Enterprise Security & DevSecOps Architecture

This platform is engineered following strict global security standards (CIS Benchmarks, NIST guidelines) to ensure a highly robust, enterprise-grade security posture.

### Network & Infrastructure Security
* **Zero Trust Network Access**: The on-premises Kubernetes cluster has no inbound open router ports. 
* **Cloudflare Tunnels**: All external ingress is strictly routed through Cloudflare Zero Trust Tunnels, absorbing malicious traffic, masking the origin IP, and providing enterprise DDoS protection.
* **Internal Isolation**: The PostgreSQL database runs as an internal `ClusterIP` service, completely isolated from public exposure.

### Container Hardening
* **Minimal Base OS**: Utilizes `alpine` Linux to drastically reduce the container's attack surface.
* **Non-Root Execution**: The application runs under a strictly unprivileged user (`uid 1001`), ensuring that even in the event of an application breach, attackers cannot execute host-level privilege escalation.
* **Multi-stage Builds**: Prevents sensitive build-time tooling and dependencies from being shipped to production.

### DevSecOps Pipelines
* **Continuous Integration (CI)**: Automates standard formatting, Next.js build compilation validation, and **Trivy filesystem scanning** to identify and block vulnerable NPM dependencies.
* **Continuous Release**: Automatically triggers upon code merges to build production containers, run **Trivy container image scans** for operating system packages vulnerabilities, and publish verified secure images to GitHub Container Registry (GHCR).

### GitOps & Secrets Management
* **Declarative State Reconciliation**: Automated deployment and state management via **ArgoCD**.
* **Military-grade Cryptography**: Implements **Bitnami Sealed Secrets** to encrypt sensitive Kubernetes manifests (like database credentials) before committing to GitHub, ensuring 100% of the infrastructure is managed securely via Git without exposing plaintext secrets.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
