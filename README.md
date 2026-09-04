# AI-Driven Scheme Matching for Marginalized Entrepreneurs

An AI-powered web platform tailored for marginalized entrepreneurs (women, SC/ST/OBC, minorities, rural artisans, persons with disabilities, and micro-enterprises) to discover, match, and apply for government and non-government schemes, grants, subsidies, and credit guarantee programs.

## System Architecture

- **Backend**: FastAPI (Python 3.11+) with asynchronous endpoints, Pydantic schemas, and rule/vector matching algorithms.
- **Frontend**: Next.js / React with responsive, accessible UI components.
- **Database**: PostgreSQL 16 with `pgvector` extension for structured eligibility rule queries and semantic vector search.
- **Containerization**: Docker Compose for single-command orchestration of database, API, and web interface.

## Project Structure

```
ai-scheme-matching/
├── docker-compose.yml          # Container orchestration (db, backend, frontend)
├── .env.example                # Environment configuration template
├── .env                        # Local environment variables
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── backend/
│   ├── Dockerfile              # Backend container definition
│   ├── requirements.txt        # Python dependencies
│   ├── scripts/
│   │   └── init_db.sql         # DB initialization with pgvector extension
│   └── app/
│       ├── main.py             # FastAPI entrypoint
│       ├── core/               # App configuration and database session
│       ├── models/             # SQLAlchemy ORM models
│       ├── schemas/            # Pydantic request/response schemas
│       ├── api/v1/             # API routing (schemes, matching, users)
│       └── services/           # Matching engine and AI recommendation logic
└── frontend/
    ├── Dockerfile              # Frontend container definition
    ├── package.json            # Node.js dependencies and scripts
    ├── public/                 # Static assets
    └── src/
        ├── app/                # Next.js app router pages
        ├── components/         # Reusable UI components
        ├── lib/                # API client and utilities
        └── styles/             # Global CSS and themes
```

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- Or alternatively, local installations of:
  - Python 3.10+
  - Node.js 18+
  - PostgreSQL 15+ (with pgvector)

### Running with Docker Compose

1. Copy `.env.example` to `.env` (already done by default):
   ```bash
   cp .env.example .env
   ```

2. Start the database, backend, and frontend containers:
   ```bash
   docker compose up -d
   ```

3. Access the services:
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **Interactive API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **PostgreSQL Database**: `localhost:5432` (`scheme_db`)
