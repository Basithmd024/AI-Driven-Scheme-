# Samarthya Setu: AI-Driven Concessional Channel Finance & Scheme Matching Platform

An institutional-grade decision support and credit matching platform engineered for Scheduled Caste (SC) entrepreneurs and marginalized beneficiaries, aligning with the channel finance mandates of the **National Scheduled Castes Finance & Development Corporation (NSFDC)** under the **Ministry of Social Justice & Empowerment (MoSJE)**, Government of India.

---

## Executive Summary

Traditional welfare and concessional credit mechanisms often face delivery bottlenecks due to fragmented eligibility rules, lack of localized channel partner visibility, and complex debt servicing schedules. **Samarthya Setu** resolves these challenges by providing an automated, transparent, and user-centric platform that:

1. **Enforces Statutory Constraints**: Applies the statutory annual family income ceiling (<= INR 5.00 Lakhs) and calculates exact promoter contribution margins (5% to 10%) and concessional coverage (up to 90%).
2. **Simulates Debt Servicing & Moratoria**: Computes EMI schedules, grace period interest behavior, and quantifies total interest savings against commercial banking benchmarks (13.5% p.a.).
3. **Optimizes Channel Partner Routing**: Geolocation-based routing to authorized State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), Regional Rural Banks (RRBs), and NBFC-MFIs, backed by Non-Performing Asset (NPA) and fund utilization risk filters.
4. **Delivers a Zero Static Colors Interface**: 100% dynamic CSS variable design system supporting instantaneous, pure switching between Dark Mode and Light Mode.

---

## Core System Modules

### 1. Scheme Matching Engine
- **Income Ceiling Gate**: Strictly disallows applicants with annual family income exceeding INR 5,00,000 as per NSFDC criteria.
- **Multi-Attribute Scoring**: Weights applicant demographics, business sectors, target project costs, and locations against scheme guidelines.
- **Automated Document Checklist**: Dynamically compiles mandatory proof requirements (SC caste certificates, revenue income certificates, project reports, admission proofs).
- **Application Routing**: Direct links to official portals (NSFDC Scheme Portal and PM-SURAJ National Portal).

### 2. Concessional Financial Calculator & Simulator
- **Interest Rate Range**: Concessional rates spanning 4.0% p.a. (Micro-Credit & Mahila Samriddhi) to 8.0% p.a. (Overseas Education & Term Loans).
- **Moratorium Engine**: Models grace periods (up to 12 months) where principal repayment is deferred during enterprise gestation.
- **Commercial Benchmark Comparative**: Computes exact monetary savings relative to prevailing market lending rates (13.5% p.a.).

### 3. Channel Partner Locator
- **Geospatial Proximity**: Leverages HTML5 Geolocation API with Haversine distance calculations across variable radii (5 km, 15 km, 25 km, 50 km).
- **Institutional Coverage**: Catalogs SCAs, PSBs (e.g., State Bank of India, Punjab National Bank, Canara Bank), and RRBs.
- **Health & Governance Safeguards**:
  - Automatically flags and isolates institutions with NPA rates >= 5.0%.
  - Filters for active fund utilization rates (>= 70.0%).

### 4. Dynamic Design System (Zero Static Colors)
- All color values across components, Leaflet interactive maps, navigation elements, inputs, and score indicators are strictly mapped to semantic CSS tokens (`var(--...)`).
- Seamless transitions between high-contrast Dark Command Mode and accessible Light Mode without hardcoded color artifacts.

---

## Technology Stack

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Backend** | FastAPI (Python 3.11+) | Asynchronous REST architecture, Pydantic v2 validation, CORS & security middlewares |
| **Matching Algorithms** | Custom Rule & Vector Engine | Statutory filtering, multi-factor weighting, eligibility reasoning generation |
| **Frontend** | Next.js 14 / React / TypeScript | Server and client component separation, Next.js internal API rewrite proxy |
| **Geospatial & Maps** | Leaflet / React-Leaflet | Dynamic custom HTML markers with CSS variable styling, circle radiuses, popups |
| **Styling** | Vanilla CSS Design Tokens | Zero Tailwind bloat, modular variables (`variables.css`, `global.css`), fluid micro-animations |
| **Deployment** | Docker & Docker Compose | Containerized database, backend API, and frontend client |

---

## Repository Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application factory and routing
│   │   ├── api/v1/
│   │   │   ├── schemes.py              # Scheme catalog and matching endpoints
│   │   │   ├── calculator.py           # Financial simulator endpoint
│   │   │   ├── partners.py             # Geospatial channel partner locator
│   │   │   └── health.py               # Minimalist service health check
│   │   ├── schemas/                    # Pydantic validation schemas
│   │   │   ├── scheme.py               # Matching input and output models
│   │   │   ├── calculator.py           # Loan and moratorium calculation models
│   │   │   └── partner.py              # Partner locator schemas
│   │   └── services/                   # Business logic and algorithms
│   │       ├── matching_engine.py      # Core eligibility and scoring algorithm
│   │       ├── financial_calculator.py # EMI, moratorium, and savings formulas
│   │       └── channel_partner_service.py # Geospatial locator & NPA filtering
│   ├── requirements.txt                # Python backend dependencies
│   └── Dockerfile                      # Backend container configuration
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              # Root HTML wrapper with metadata
│   │   │   └── page.tsx                # Unified command center interface
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # Navigation bar with theme and language switchers
│   │   │   ├── SchemeCard.tsx          # Card with SVG score rings and routing drawers
│   │   │   ├── FinancialCalculator.tsx # Interactive debt and moratorium simulator
│   │   │   └── PartnerLocator.tsx      # GPS-enabled interactive partner map
│   │   ├── lib/
│   │   │   └── api.ts                  # Type-safe API client and client-side proxy binding
│   │   └── styles/
│   │       ├── variables.css           # Semantic color tokens (Dark & Light modes)
│   │       └── global.css              # Baseline resets, card motion, and button styles
│   ├── next.config.js                  # Next.js configuration and API rewrite rules
│   ├── package.json                    # Node dependencies and build scripts
│   └── Dockerfile                      # Frontend container configuration
├── docker-compose.yml                  # Container orchestration specification
├── .gitignore                          # Git exclusion patterns
└── README.md                           # System documentation
```

---

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Git

### 1. Backend Configuration
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/v1/health`

### 2. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

---

## API Reference

### 1. Health Verification
- **Endpoint**: `GET /api/v1/health`
- **Response**:
  ```json
  { "status": "ok" }
  ```

### 2. Scheme Recommendation Engine
- **Endpoint**: `POST /api/v1/matching/recommend`
- **Request Body**:
  ```json
  {
    "full_name": "Ramesh Kumar",
    "annual_family_income": 250000,
    "project_cost": 500000,
    "target_demographics": ["sc_artisan"],
    "state": "Delhi",
    "business_type": "handicrafts"
  }
  ```
- **Response**: Array of eligible schemes sorted by match score with channel guidelines, AI assessment reasoning, and document checklists.

### 3. Financial & Moratorium Simulator
- **Endpoint**: `POST /api/v1/calculator/calculate`
- **Request Body**:
  ```json
  {
    "project_cost": 500000,
    "concessional_interest_rate": 6.0,
    "tenure_years": 5,
    "moratorium_months": 6,
    "channel_finance_coverage": 90.0,
    "commercial_benchmark_rate": 13.5
  }
  ```
- **Response**:
  ```json
  {
    "loan_amount": 450000.0,
    "promoter_contribution": 50000.0,
    "monthly_emi": 8700.12,
    "total_interest_concessional": 72007.2,
    "total_amount_payable": 522007.2,
    "commercial_benchmark_interest": 162000.0,
    "beneficiary_savings_amount": 89992.8,
    "moratorium_months": 6,
    "repayment_tenure_months": 60
  }
  ```

### 4. Channel Partner Locator
- **Endpoint**: `POST /api/v1/partners/locate`
- **Request Body**:
  ```json
  {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "radius_km": 25.0,
    "state": "Delhi",
    "category": "SCA",
    "only_active": true
  }
  ```
- **Response**: Filtered list of verified banking and channel partners ranked by distance with NPA rates and contact information.

---

## Scheme Governance Matrix

| Scheme Code | Scheme Name | Concessional Rate | Max Project Limit | Max Moratorium | Channel Partners |
|---|---|---|---|---|---|
| **NSFDC-TL-01** | Term Loan Scheme (General Enterprise) | 6.0% p.a. | INR 50.00 Lakhs | 6 Months | SCAs, PSBs, RRBs |
| **NSFDC-MC-02** | Micro Credit Finance Scheme | 5.0% p.a. | INR 1.50 Lakhs | 3 Months | SCAs, NBFC-MFIs |
| **NSFDC-MS-03** | Mahila Samriddhi Yojana | 4.0% p.a. | INR 1.40 Lakhs | 6 Months | SCAs, PSBs |
| **NSFDC-EL-04** | Educational Loan (Domestic Studies) | 7.5% p.a. | INR 20.00 Lakhs | Course + 12m | PSBs, SCAs |
| **NSFDC-EL-05** | Educational Loan (Overseas Studies) | 8.0% p.a. | INR 30.00 Lakhs | Course + 12m | PSBs, SCAs |
| **NSFDC-GB-06** | Green Business Scheme (EV / Solar) | 6.5% p.a. | INR 30.00 Lakhs | 6 Months | SCAs, PSBs, RRBs |

---

## License

This project is released under the **MIT License**.
