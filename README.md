# ☕ Cafetería Inteligente

Plataforma inteligente para la gestión integral de cafeterías.

## 📌 Descripción

Cafetería Inteligente es una plataforma web orientada a optimizar la gestión
operativa y la toma de decisiones en cafeterías.

El sistema permitirá administrar productos, ingredientes, recetas, inventario,
ventas, mesas, reservas y clientes. Además, incorporará análisis de datos y
modelos predictivos para apoyar la estimación de demanda y la planificación
de inventario.

## 🎯 Objetivo general

Desarrollar una plataforma inteligente para la gestión integral de cafeterías,
orientada a optimizar el control de inventario, las operaciones y la toma de
decisiones mediante tecnologías web, analítica de datos e inteligencia artificial.

## 🏗️ Arquitectura

El proyecto utilizará una arquitectura de monolito modular en capas.

- Frontend: React + TypeScript
- Backend: Node.js + NestJS + TypeScript
- Base de datos: PostgreSQL
- API: REST + JSON
- Seguridad: guards de NestJS + JWT
- Analítica de datos: Python + Pandas
- Machine Learning: Scikit-learn
- Infraestructura: Docker
- Control de versiones: Git + GitHub

## 📦 Módulos planificados

### MVP

- Autenticación y usuarios
- Roles y permisos
- Productos
- Ingredientes
- Recetas
- Inventario
- Ventas
- Dashboard básico

### Evolución futura

- Mesas
- Pedidos
- Reservas
- Clientes
- Fidelización
- Analítica avanzada
- Predicción de demanda
- Recomendaciones de inventario

## 🗂️ Estructura del proyecto

```text
cafeteria-inteligente/
├── frontend/
├── backend/
├── analytics/
├── database/
├── docs/
├── infrastructure/
├── .github/
├── README.md
├── .gitignore
├── docker-compose.yml
└── CONTRIBUTING.md
