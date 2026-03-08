# Mood Muncher 🍔🎨

**Mood Muncher** is a small experimental web application that generates **absurd meal suggestions** based on a user's mood.

You enter how you feel, and the app returns a **funny, cartoon-style food idea** that matches your emotional state.

Example:

> **Mood:** *Existential dread*
> **Meal suggestion:** *A bowl of screaming spaghetti topped with tiny crying meatballs.*

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

## Frontend

* Angular

## Backend

* Node.js
* Express

## Database

* PostgreSQL

## Infrastructure

* Docker
* Docker Compose

The application runs as **separate containerized services**, allowing experimentation with deployment strategies, scaling, and infrastructure automation.

---

# Architecture 🧱

The application is composed of three services:

* **Frontend** — Angular web interface
* **Backend** — Node.js / Express API
* **Database** — PostgreSQL

The backend communicates with the PostgreSQL database to store and retrieve application data.

Docker Compose orchestrates these services in a **local development environment**.

---

# Project Structure 📁

```
mood-muncher
│
├── mood-muncher-frontend/        # Angular application
│
├── mood-muncher-backend/         # Node + Express API
│
├── db/                           # Database initialization
│   └── sql.init                  # PostgreSQL initialization script
│
├── docker-compose.yml            # Multi-container local environment
│
├── .env.example                  # Example environment variables
│
└── README.md
```

Each component is kept independent so it can easily be:

* containerized
* deployed separately
* scaled independently
* replaced with alternative implementations

---

# Environment Variables 🔐

The project uses environment variables for configuration.

An example configuration file is provided:

```
.env.example
```

Create your local configuration file:

```
cp .env.example .env
```

You can then adjust the values depending on your environment.

---

# Services 📦

| Service    | Port | Description            |
| ---------- | ---- | ---------------------- |
| Frontend   | 4200 | Angular user interface |
| Backend    | 3000 | Express API            |
| PostgreSQL | 5432 | Application database   |

---

# Getting Started (Recommended) 🐳

The easiest way to run the project locally is using **Docker Compose**.

### 1. Clone the repository

```
git clone <repo-url>
cd mood-muncher
```

### 2. Create the environment file

```
cp .env.example .env
```

### 3. Start the application

```
docker compose up --build
```

Once the containers are running, open:

```
http://localhost:4200
```

---

# Database Initialization 🗄️

The PostgreSQL database is automatically initialized using the SQL script located in:

```
db/sql.init
```

This script runs when the PostgreSQL container is created and can be used to:

* create tables
* insert seed data
* define initial schema

---

# Running Without Docker (Optional) 💻

You can also run the services manually.

## Backend

```
cd mood-muncher-backend
npm install
npm start
```

## Frontend

```
cd mood-muncher-frontend
npm install
ng serve
```

Make sure you also have a **PostgreSQL instance running locally** and configured according to your `.env` variables.

Then open:

```
http://localhost:4200
```

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

The surrounding infrastructure may evolve over time.

---

# Philosophy 🌶️

The guiding principle of this project is:

> **Simple application, complex infrastructure.**

By keeping the application small and playful, the project becomes a flexible environment for learning and experimenting with **modern DevOps practices**.
