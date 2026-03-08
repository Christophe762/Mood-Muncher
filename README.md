# Mood Muncher 🍔🎨

**Mood Muncher** is a small experimental web application that generates **absurd meal suggestions** based on a user's mood.
You enter how you feel, and the app returns a **funny, cartoon-style food idea** that matches your emotional state.

Example:

> Mood: *Existential dread*
> Meal suggestion: *A bowl of screaming spaghetti topped with tiny crying meatballs.*

The project uses a **simple architecture** so the focus is not on complex application logic, but on **infrastructure, deployment, and DevOps experimentation**.

---

# Purpose of the Project 🛠️

This project is intentionally designed as a **DevOps and infrastructure playground**.

Rather than showcasing advanced application development, the goal is to provide a **small but complete full-stack application** that can be used to experiment with:

* containerization
* CI/CD pipelines
* infrastructure as code
* deployment strategies
* monitoring and observability
* cloud infrastructure
* reliability engineering practices

Because the application itself is lightweight, it becomes easy to **iterate on infrastructure without being distracted by application complexity**.

---

# Features 🍕

* Accepts a **user mood** as input
* Generates a **funny or absurd meal suggestion**
* Displays a **cartoon-style image** of the meal
* Simple API architecture
* Minimal UI focused on quick interaction

---

# Tech Stack ⚙️

### Frontend

* Angular

### Backend

* Node.js
* Express

### Architecture

* Separate **frontend** and **backend** services

The project structure is intentionally minimal to make experimentation easier.

---

# Project Structure 📁

```
mood-muncher
│
├── mood-muncher-frontend/        # Angular application
│
├── mood-muncher-backend/         # Node + Express API
│
└── README.md
```

Each component is kept independent so it can easily be:

* containerized
* deployed separately
* scaled independently
* replaced with alternative implementations

---

# Why This Project Exists 🧪

Many portfolio projects focus heavily on application features and complexity.
This project takes the opposite approach.

**Mood Muncher is intentionally simple so that the infrastructure around it can become complex.**

It serves as a sandbox for experimenting with topics such as:

* Docker and container orchestration
* CI/CD pipelines
* reverse proxies and load balancing
* automated deployments
* monitoring and logging
* cloud platforms
* resilience and fault tolerance

Over time, the surrounding infrastructure may become significantly more sophisticated than the application itself.

---

# Possible Infrastructure Experiments 🚀

This project may be used to experiment with:

* Docker and Docker Compose
* Kubernetes deployments
* Terraform infrastructure
* GitHub Actions or other CI/CD pipelines
* reverse proxy configuration
* HTTPS and certificate automation
* monitoring with Prometheus and Grafana
* centralized logging
* chaos engineering
* feature flags
* canary deployments

The exact infrastructure may evolve as the project grows.

---

# Getting Started (Development) 💻

Clone the repository:

```
git clone <repo-url>
cd mood-muncher
```

Run the backend:

```
cd backend
npm install
npm start
```

Run the frontend:

```
cd frontend
npm install
ng serve
```

Then open:

```
http://localhost:4200
```

---

# Philosophy 🌶️

The guiding principle of this project is:

> **Simple application, complex infrastructure.**

By keeping the application small and playful, the project becomes a flexible environment for learning and experimenting with modern DevOps practices.

---
