# RaceTracker

## Project Overview

RaceTracker is a web-based championship management platform designed primarily for **Gran Turismo 7** competitive leagues.

The application aims to simplify league organization by automating:

* championship management,
* regulation validation,
* race result tracking,
* and real-time championship scenario calculations.

The platform provides dedicated workflows for:

* **League Organizers**
* **Drivers**

This project is currently developed as part of an academic MVP development process.

---

# Main Features (MVP)

## Authentication System

* User registration and login
* JWT-based authentication
* Role-based access

## League Management

* Create and manage championships
* Configure league settings
* Register drivers

## Regulation Validation

* Automatic vehicle legality checks
* Regulation enforcement
* Car specification validation

## Championship Management

* Real-time standings
* Point calculations
* Mathematical championship eligibility
* Title contention scenarios

## Driver Dashboard

* Championship overview
* Race-by-race results
* Detailed driver statistics

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* NestJS
* Node.js
* REST API

## Database

* PostgreSQL
* Prisma ORM

## Tools

* Git & GitHub
* Postman
* Mermaid
* Figma

---

# Project Structure

```text
RaceTracker/
│
├── frontend/     # Next.js frontend application
├── backend/      # NestJS backend API
├── docs/         # Documentation, diagrams and mockups
│
├── README.md
└── .gitignore
```

---

# Installation

## Clone the Repository

```bash
git clone <repository-url>
cd RaceTracker
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on:

```text
http://localhost:3000
```

---

# Database Setup

## PostgreSQL

Make sure PostgreSQL is installed and running locally.

Create a database for the project.

Example:

```sql
CREATE DATABASE racetracker;
```

---

# Prisma Setup

Inside the backend folder:

```bash
npx prisma init
```

Run migrations:

```bash
npx prisma migrate dev
```

---

# Development Workflow

## Git Branches

* `main` → stable production-ready branch
* `development` → active development branch
* `feature/*` → feature-specific branches

---

# Documentation

Technical documentation is available in the `docs/` folder and includes:

* system architecture,
* ER diagrams,
* sequence diagrams,
* API specifications,
* mockups,
* technical decisions.

---

# Future Improvements (V2)

Planned future features include:

* Multi-game support
* Discord integration
* AI-generated race summaries
* Advanced broadcaster tools
* Setup analysis systems

---

# License

This project is currently developed for educational purposes.
