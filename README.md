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

## 🛡️ DevSecOps & Deployment Pipelines

* **Continuous Integration (CI)**: Automates standard formatting, Next.js build compilation validation, and **Trivy filesystem scanning** to identify and block vulnerable NPM dependencies.
* **Continuous Delivery (CD)**: Automatically triggers upon code merges to build production containers, run **Trivy container image scans** for operating system packages vulnerabilities, and publish verified secure images to GitHub Container Registry (GHCR).
* **GitOps Delivery**: Managed via Kubernetes manifests to enable declarative application state reconciliation.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
