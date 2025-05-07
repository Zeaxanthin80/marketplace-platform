# Phase 1.4 - API Contracts and Microservices Boundaries

## Checklist
- [ ] Define boundaries for each microservice (including courier/delivery service)
- [ ] Draft API contracts (REST/GraphQL endpoints, data models)
- [ ] Document service dependencies and communication patterns
- [ ] Review for scalability and maintainability

---

## Core Microservices & Example API Contracts

### 1. User Service
- **User Types:** Buyer, Seller, Admin, Independent Courier/Delivery Personnel
- **Endpoints:**
  - `POST /users/register` (specify user type)
  - `POST /users/login`
  - `GET /users/{id}`
  - `PUT /users/{id}`
  - `DELETE /users/{id}`

### 2. Product Service
- **Responsibilities:** Product listing, details, categories, inventory per seller.
- **Endpoints:**
  - `POST /products`
  - `GET /products`
  - `GET /products/{id}`
  - `PUT /products/{id}`
  - `DELETE /products/{id}`

### 3. Order Service
- **Responsibilities:** Cart, order creation, order status, order history, order tracking.
- **Endpoints:**
  - `POST /orders`
  - `GET /orders`
  - `GET /orders/{id}`
  - `PUT /orders/{id}/status`
  - `GET /orders/user/{userId}`

### 4. Payment Service
- **Responsibilities:** Payment processing, refunds, payment status.
- **Endpoints:**
  - `POST /payments`
  - `GET /payments/{orderId}`
  - `POST /payments/refund`

### 5. Review & Rating Service
- **Responsibilities:** Product reviews, ratings, moderation.
- **Endpoints:**
  - `POST /reviews`
  - `GET /reviews/product/{productId}`
  - `DELETE /reviews/{id}`

### 6. Notification Service
- **Responsibilities:** Email, SMS, in-app notifications.
- **Endpoints:**
  - `POST /notifications/email`
  - `POST /notifications/sms`
  - `POST /notifications/in-app`

### 7. Admin Service
- **Responsibilities:** User and product moderation, analytics, reports, content management.
- **Endpoints:**
  - `GET /admin/users`
  - `PUT /admin/users/{id}/ban`
  - `GET /admin/reports`
  - `POST /admin/content`

### 8. Courier/Delivery Service
- **User Type:** Independent Courier/Delivery Personnel
- **Responsibilities:**
  - Courier account registration and profile management
  - Accept/decline delivery assignments
  - Track delivery status (en route, delivered, etc.)
  - Delivery history and earnings
- **Endpoints:**
  - `POST /couriers/register`
  - `GET /couriers/{id}`
  - `PUT /couriers/{id}`
  - `GET /couriers/{id}/deliveries` (assigned deliveries)
  - `POST /couriers/{id}/accept-delivery`
  - `POST /couriers/{id}/update-status`
  - `GET /couriers/{id}/earnings`

---

## Service Dependencies & Communication Patterns

- **Order Service** interacts with **Courier/Delivery Service** to assign and track deliveries.
- **Courier/Delivery Service** notifies couriers of new assignments (via Notification Service).
- **User Service** maintains authentication and roles for all user types.
- **Admin Service** can moderate couriers and review delivery analytics.
- **Notification Service** is used for real-time updates to buyers, sellers, and couriers.

---

> Review and revise this structure as needed to fit your business logic and operational flow.
