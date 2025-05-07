# Phase 1.3 - Open Source Licenses and Deployment Hosts

## Chosen Open Source License
- **MIT License**
  - Very permissive, allows commercial use, modification, distribution, and private use with attribution.
  - Widely adopted and compatible with most open source and commercial projects.

## Chosen Deployment Solution
- **DigitalOcean Kubernetes (DOKS)**
  - Managed Kubernetes service for deploying and scaling microservices using containers (Docker).
  - Easiest way to start with a scalable, production-ready architecture.
  - Supports rolling updates, auto-scaling, and managed storage/networking.
  - Integrates with DigitalOcean Spaces (object storage), managed databases, and other cloud services.

### Why DOKS?
- **Scalability:** Easily add/remove nodes as traffic grows.
- **Simplicity:** Managed control plane, automatic updates, less manual setup than self-hosted Kubernetes.
- **Community & Support:** Good documentation, active community, and straightforward UI/API.
- **Cost-effective:** Pay only for worker nodes and resources used. No extra charge for the control plane.

### Pricing Notes
- Worker nodes start at $12/month (2GB RAM, 1 vCPU). Recommended to start with at least 3 nodes for high availability ($36/month base).
- Additional costs for storage, outbound bandwidth, and managed databases (if used).
- Can scale up or down as needed, making it suitable for both MVP and full production.

## Alternative Options Considered
- **Hetzner Cloud + Managed Kubernetes:** Also scalable and cost-effective, especially in Europe. DigitalOcean chosen for broader documentation and easier onboarding for most teams.
- **DigitalOcean Droplets:** Good for manual setups, but less future-proof for microservices at scale.
- **Self-hosted Kubernetes:** More control, but higher maintenance overhead.

---

> **Decision:** Start with DigitalOcean Kubernetes (DOKS) for microservices deployment, using the MIT License for all open source code. This combination provides scalability, simplicity, and broad compatibility for future growth.
