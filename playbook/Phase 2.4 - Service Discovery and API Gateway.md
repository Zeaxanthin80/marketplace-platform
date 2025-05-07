# Phase 2.4 – Service Discovery & API Gateway

## Overview
This document describes the strategy for service discovery and API gateway management in the Kubernetes-based microservices architecture.

## Goals
- Enable dynamic discovery of microservices within the cluster
- Route all external and internal API traffic through a secure, scalable API gateway
- Provide authentication, authorization, and rate limiting at the gateway level
- Support versioning and monitoring of APIs

## Checklist
- [ ] Select and deploy an API gateway (e.g., Kong, Traefik, NGINX)
- [ ] Configure gateway routing for all microservices
- [ ] Integrate authentication and authorization plugins/middleware
- [ ] Set up service discovery using Kubernetes DNS or service mesh (optional: Istio, Linkerd)
- [ ] Enable logging, monitoring, and rate limiting at the gateway
- [ ] Document API versioning and deprecation strategy

## API Gateway Options
- **Kong** (Open source, highly extensible, plugins for auth/rate limiting/monitoring)
- **Traefik** (Lightweight, native Kubernetes integration, dynamic config)
- **NGINX Ingress Controller** (Widely used, robust, less extensible than Kong)

## Example: Kong Gateway Deployment (Kubernetes)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kong
spec:
  replicas: 2
  selector:
    matchLabels:
      app: kong
  template:
    metadata:
      labels:
        app: kong
    spec:
      containers:
        - name: kong
          image: kong:3.6
          env:
            - name: KONG_DATABASE
              value: "off"
            - name: KONG_PROXY_ACCESS_LOG
              value: "/dev/stdout"
            - name: KONG_ADMIN_ACCESS_LOG
              value: "/dev/stdout"
            - name: KONG_PROXY_ERROR_LOG
              value: "/dev/stderr"
            - name: KONG_ADMIN_ERROR_LOG
              value: "/dev/stderr"
          ports:
            - containerPort: 8000 # Proxy
            - containerPort: 8001 # Admin API
```

## Service Discovery
- By default, Kubernetes provides DNS-based service discovery for all services in the cluster.
- For advanced scenarios, consider a service mesh (e.g., Istio, Linkerd) for traffic management, observability, and security.

## Best Practices
- Route all external traffic through the API gateway
- Use HTTPS for all external endpoints
- Monitor and log all gateway traffic
- Regularly review and update gateway plugins/configuration

## Next Steps
- Integrate gateway with CI/CD for automated config updates
- Document API endpoints and publish OpenAPI/Swagger specs

> Adjust this plan as your architecture and requirements evolve.
