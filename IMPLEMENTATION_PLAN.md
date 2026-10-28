# AICTE VerifyAI — Final Engineering & Integration Plan
## AI-Powered Application Validation, Document Authentication & Regulatory Compliance Verification
**Smart India Hackathon 2026 · Problem Statement ID: SIH26261 · Team: Rudraksha_1**

---

## 1. Executive Summary & Scope

The objective is to transform the existing **React 19 + Vite frontend prototype** into a fully operational, end-to-end production system by pairing it with a high-performance **FastAPI backend**, **PostgreSQL/Supabase database**, **Private Object Storage**, **Sarvam Document AI API**, and a multi-tiered **Document Forensics Pipeline** (ViT document-level classifier + DocTamper text localization + YOLO region detector).

### Core Directives
1. **No PaddleOCR**: All OCR and document layout digitisation will exclusively use **Sarvam Document AI API** (Digitise & Extract endpoints).
2. **Simultaneous Frontend Connection**: The frontend UI and user experience will remain completely intact. We will progressively replace the in-memory `DemoStateContext` with live API endpoints in [`src/services/api.js`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/aicte-validator-frontend/src/services/api.js) using an active **Hybrid Fallback Mode** so the app never breaks during development or live presentations.
3. **Assistive Decision-Support Guardrail**: AI models never make statutory approval or rejection decisions automatically. All AI outputs are labeled as preliminary assistive findings (`No obvious tampering detected`, `Potential tampering`, `Review Required`, `Possible Inconsistency`) requiring human officer scrutiny under the AICTE Act 1987.

---

## 2. Target Architecture & Component Topology

```text
                               +--------------------------------------------+
                               |     React 19 + Vite Frontend (Port 5173)   |
                               |  - College Portal (/college)               |
                               |  - Verification Console (/verification)    |
                               |  - Senior Directorate (/senior-officer)    |
                               |  - Admin Console (/admin)                  |
                               +---------------------+----------------------+
                                                     |
                                   REST / JSON APIs with JWT + Axios
                                                     |
                               +---------------------v----------------------+
                               |       FastAPI Backend API (Port 8000)      |
                               |  - Authentication & RBAC Dependencies      |
                               |  - Application & Document Management       |
                               |  - Findings, Queries, Escalations, Audits  |
                               +----------+---------------------+-----------+
                                          |                     |
                  +-----------------------+                     +-----------------------+
                  |                                                                     |
       +----------v----------+                                               +----------v----------+
       |   PostgreSQL DB     |                                               |  Supabase Storage   |
       |  (Supabase Hosted)  |                                               |  (Private Buckets)  |
       |  - 18 Relational    |                                               |  - Original PDFs    |
       |    Tables + Indexes |                                               |  - Rendered Pages   |
       |  - Audit Ledger     |                                               |  - Forensic Masks   |
       +---------------------+                                               +---------------------+
                  ^
                  |
       +----------+-----------------------------------------------------------------+
       |                                                                            |
+------v------------------------------------+                     +-----------------v--------------------+
|   Celery Worker / Background Tasks        |                     |      External AI Services            |
|   (Redis Queue)                           |                     |                                      |
|                                           |  REST API (Secrets) |  +--------------------------------+  |
|   1. PDF Validation & SHA-256 Hashing     |-------------------->|  | Sarvam Document AI API         |  |
|   2. PyMuPDF Page Image Rasterization     |                     |  |  - Digitise (Markdown/Layout)  |  |
|   3. Field Normalization & Parsing        |                     |  |  - Extract (Schema Fields)     |  |
|   4. APH Deterministic Rule Verification  |                     |  +--------------------------------+  |
|   5. Cross-Institute Deduplication Engine |                     |                                      |
|   6. Cryptographic Audit Hash Generation  |                     |  +--------------------------------+  |
|                                           |                     |  | Local / Worker ML Models       |  |
|                                           |                     |  |  - ViT Forgery Detector (ELA)  |  |
|                                           |                     |  |  - DocTamper (DTD Localization)|  |
|                                           |                     |  |  - YOLO (Stamps & Signatures)  |  |
|                                           |                     |  +--------------------------------+  |
+-------------------------------------------+---------------------+--------------------------------------+
```

---

## 3. Technology Stack Specification

| Component | Technology | Rationale & Configuration |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide Icons | Pre-built, verified, zero lint errors, high-fidelity Indian Govt portal aesthetic. |
| **Backend API** | Python 3.11+, FastAPI, Pydantic v2 | High-throughput async endpoints, native Python ML/CV ecosystem compatibility. |
| **Database** | PostgreSQL 16 (Supabase) + SQLAlchemy 2.0 + Alembic | Enterprise relational integrity, JSONB support for OCR layouts, structured audit logs. |
| **File Storage** | Supabase Storage (Private Bucket: `aicte-documents`) | Secure server-side signed URLs (15-minute expiry). Never public. 10 MB file limit. |
| **OCR Engine** | **Sarvam Document AI API** | Replaces PaddleOCR. Indian languages and English document intelligence (`digitise` & `extract`). |
| **Tamper Screening (Document)** | **ViT Document Forgery Detector** (`zodumair/document-forgery-detector`) | Binary real-vs-forged classification utilizing Error Level Analysis (ELA) at $\alpha=0.3$. |
| **Tamper Localization (Text)** | **DocTamper (DTD)** | CVPR 2023 text tampering detection producing pixel-level mask overlays of altered numbers/dates. |
| **Region Detection** | **YOLOv8** (Ultralytics) | Target bounding box detection: `official_stamp`, `authorized_signature`, `qr_code`, `letterhead`. |
| **Image / PDF Engine** | PyMuPDF (fitz) + OpenCV + Pillow | High-speed PDF page rendering (180 DPI), deskewing, noise reduction, SHA-256 digest computation. |
| **Task Queue** | Redis + Celery | Asynchronous non-blocking document ingestion; ensures sub-100ms API response times. |
| **Security & Auditing** | JWT (HS256) + Passlib/Bcrypt + SHA-256 Ledger | Tamper-evident cryptographic ledger (`Hash = SHA256(PrevHash + Data)`). |

---

## 4. Database Architecture (18 Production Tables)

All tables use internal UUIDs (`UUIDv4`) for primary keys and clean human-readable IDs (`APP-2026-ENG-xxxx`, `AUD-xxxx`, `CQ-xxx`, `ESC-xxx`) as display reference codes.

```mermaid
erDiagram
    INSTITUTIONS ||--o{ APPLICATIONS : files
    USERS ||--o{ APPLICATIONS : assigns
    APPLICATIONS ||--o{ DOCUMENTS : contains
    DOCUMENTS ||--o{ DOCUMENT_PAGES : renders
    DOCUMENTS ||--o{ OCR_RESULTS : produces
    DOCUMENTS ||--o{ EXTRACTED_FIELDS : yields
    DOCUMENTS ||--o{ TAMPER_ANALYSES : undergoes
    DOCUMENTS ||--o{ YOLO_DETECTIONS : identifies
    APPLICATIONS ||--o{ FINDINGS : triggers
    APPLICATIONS ||--o{ RULE_RESULTS : evaluates
    APPLICATIONS ||--o{ CLARIFICATION_QUERIES : issues
    CLARIFICATION_QUERIES ||--o{ CLARIFICATION_RESPONSES : receives
    APPLICATIONS ||--o{ ESCALATIONS : escalates
    APPLICATIONS ||--o{ SENIOR_DECISIONS : resolves
    APPLICATIONS ||--o{ AUDIT_LEDGER : logs
    APPLICATIONS ||--o{ APPLICATION_TIMELINE : tracks
```

### Table Breakdown
1. **`institutions`**: AISHE code, Permanent Institute ID, name, region, state, district, land area, built-up area.
2. **`users`**: Email, hashed password, full name, role (`admin`, `college`, `verification`, `senior-officer`), institution reference.
3. **`applications`**: `public_id` (e.g. `APP-2026-ENG-1042`), type, academic year, status (`Under Review`, `Review Required`, `Escalated`, `Scrutiny Passed`, `Approved`), priority.
4. **`application_timeline`**: Chronological milestone events (Actor, Stage, Details, Timestamp).
5. **`documents`**: Document category, title, storage key, SHA-256 checksum, page count, processing status (`uploaded`, `queued`, `processing`, `completed`, `failed`).
6. **`document_pages`**: Page numbers, rendered 180 DPI image storage keys, thumbnail keys, page status.
7. **`ocr_results`**: Provider (`sarvam`), provider job ID, full raw response JSONB, extracted markdown text.
8. **`extracted_fields`**: Key, label, original OCR value, normalized value (dates/numbers), confidence score, bounding box, manual override status.
9. **`tamper_analyses`**: Model name (`ViT-ELA`, `DocTamper`), model score, predicted label, mask storage key, overlay image key.
10. **`yolo_detections`**: Class name (`stamp`, `signature`, `qr_code`), confidence, bounding box coordinates `[x1, y1, x2, y2]`.
11. **`findings`**: Anomaly/deficiency records with evidence JSONB, severity (`info`, `warning`, `danger`), status (`active`, `dismissed`, `verified`).
12. **`rule_definitions`**: APH regulatory rules (rule code, category, threshold config JSONB, severity).
13. **`rule_results`**: Evaluated rule output (expected value, observed value, pass/fail status, APH clause).
14. **`clarification_queries`**: Officer query, category, subject, deadline, status (`Pending`, `Responded`).
15. **`clarification_responses`**: College rebuttal text, submission timestamp, supporting attachment ID.
16. **`escalations`**: Case escalation to Regional Director, reason, evidence summary, resolution status.
17. **`senior_decisions`**: Statutory determination (`Final Approval`, `Provisional Approval`, `Rejection`, `Return for Review`), conditions, board meeting date.
18. **`audit_ledger`**: Append-only cryptographic chain (`sequence_no`, `actor_id`, `action`, `payload_hash`, `previous_hash`, `record_hash`).

---

## 5. Document Processing & AI Pipeline

```text
[PDF Upload] (Max 10MB)
      │
      ▼
1. Validation & Storage ────► SHA-256 computed ────► Stored in Private Supabase Bucket
      │
      ▼
2. Page Rendering ──────────► PyMuPDF renders pages at 180 DPI RGB images
      │
      ├───► 3. Sarvam Document AI API (Cloud OCR)
      │        ├── Digitise: Complete markdown & table layout extraction
      │        └── Extract: Structured entity extraction (Intake, Area, Dates, Reg Nos)
      │
      ├───► 4. ViT Document Forgery Detector (Local PyTorch)
      │        ├── Error Level Analysis (ELA) generation at JPEG Q=90
      │        └── Blends at alpha=0.3 ──► ViT binary classification (Real vs Forged)
      │
      ├───► 5. DocTamper DTD (Text-Level Tamper Localization)
      │        └── Multi-view Iterative Decoder ──► Heatmap & binary mask of altered text
      │
      ├───► 6. YOLOv8 Region Detection
      │        └── Pinpoints official municipal seals, signatures, and QR codes
      │
      ▼
7. Normalization & Cross-Checking
      ├── Land Area, Built-up Area, Intake, Fire NOC dates converted to standard units
      ├── Deduplication: Faculty PAN/Aadhaar/Bank records checked across all active applications
      └── Deterministic APH Rule Engine: Validates against AICTE 2026-27 norms
      │
      ▼
8. Evidence Synthesis
      └── Aggregates findings with source page bounding boxes into human-readable flags
```

### Forensic Triaging Policy
| ViT Signal (Document) | DocTamper Signal (Text) | YOLO Signal (Seals/Signatures) | Automated Advisory Status | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Low Concern** | **No Region Detected** | Valid Seal & Signature Found | `Preliminary Check Passed` | Standard officer review |
| **Low Concern** | **Suspicious Region** | Seal Found | `Review Required` | Officer inspects highlighted region |
| **High Concern** | **No Region Detected** | Missing Official Seal | `Possible Inconsistency` | Cross-check issuing authority |
| **High Concern** | **Suspicious Region** | Tampered Seal/Signature | `Possible Inconsistency` | Flag for priority senior escalation |

---

## 6. Simultaneous Frontend Integration Strategy

To connect the frontend simultaneously without disrupting ongoing demos or crashing when the backend is restarted:

### 6.1 Progressive Dual-Mode Architecture (`src/services/api.js`)
We will configure Axios with an intelligent **Graceful Fallback Mode**:
1. When `VITE_USE_MOCK_FALLBACK=true` (or when the backend is offline), API service calls seamlessly fall back to local mock data.
2. When the FastAPI backend is running, the frontend immediately communicates with real live endpoints.
3. This eliminates developer bottlenecks: frontend components can be hooked up to API calls one-by-one.

```javascript
// src/services/api.js (Target Design)
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aicte_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 6.2 Frontend Screen-to-API Route Mapping

| Frontend View / Component | Active Route | Backend REST Endpoint | Functionality |
| :--- | :--- | :--- | :--- |
| **Landing & Status Search** | `/` | `GET /api/v1/applications/search?q={id}` | Public application progress tracker |
| **Demo Login Gateway** | `/login` | `POST /api/v1/auth/login` | Issues real JWT with role claims |
| **College: 6-Step Wizard** | `/college` | `POST /api/v1/applications` | Persists application metadata to Postgres |
| **College: Document Upload** | `/college` | `POST /api/v1/applications/{id}/documents/upload` | Multipart upload to Supabase, queues OCR job |
| **College: Query Response** | `/college` | `POST /api/v1/queries/{id}/respond` | Submits institutional explanations & files |
| **Verification: Scrutiny Queue** | `/verification`| `GET /api/v1/applications?assigned=true` | Lists assigned applications with real status |
| **Verification: Review Desk** | `/verification`| `GET /api/v1/documents/{id}/results` | Renders Sarvam OCR text + ViT/DocTamper overlays |
| **Verification: Raise Query** | `/verification`| `POST /api/v1/queries` | Dispatches clarification to college portal |
| **Verification: Escalate** | `/verification`| `POST /api/v1/escalations` | Transfers dossier to Senior Director queue |
| **Senior: Approval Queue** | `/senior-officer`| `GET /api/v1/escalations` & `GET /api/v1/applications` | Displays critical cases awaiting determination |
| **Senior: Decision Modal** | `/senior-officer`| `POST /api/v1/senior-officer/decisions` | Records formal orders, generates Audit Hash |
| **Senior: Compliance Reports** | `/senior-officer`| `GET /api/v1/reports/compliance` & `export-csv` | Streams real-time compliance metrics & CSV |
| **Senior: Audit Ledger** | `/senior-officer`| `GET /api/v1/audit/trail` | Displays verifiable SHA-256 ledger events |

---

## 7. Step-by-Step Implementation Roadmap

```mermaid
timeline
    title AICTE VerifyAI Implementation Milestones
    Phase 1 : Backend Foundation : FastAPI Setup, CORS, Supabase DB & Storage init
    Phase 2 : Database & Schemas : SQLAlchemy 2.0 models, Alembic migrations, Seed data
    Phase 3 : Authentication & RBAC : JWT tokens, 4 role dependencies, Auth API
    Phase 4 : Ingestion & Storage : Secure PDF upload, SHA-256 hashing, PyMuPDF page rendering
    Phase 5 : Sarvam Document AI : Digitise API, Extract schema fields, async polling
    Phase 6 : Document Forensics : ViT ELA detector, DocTamper adapter, YOLO detector
    Phase 7 : Regulatory Rule Engine : APH 2026-27 deterministic rules, Faculty deduplication
    Phase 8 : Frontend Integration : Connect Axios services, replace mock state with live queries
    Phase 9 : Audit & Reporting : Cryptographic ledger verification, Dynamic CSV export
    Phase 10 : End-to-End Validation : SIH Demo scenarios, stress testing, pitch readiness
```

### Phase 1: Backend Foundation & Environment Setup
- Initialize `aicte-validator-backend` directory with Python 3.11 virtual environment.
- Configure `requirements.txt` with FastAPI, Uvicorn, SQLAlchemy, Pydantic, PyMuPDF, Torch, Transformers, Pillow, OpenCV, Celery, Redis.
- Create `.env.example` and `.env` with Supabase credentials, `SARVAM_API_KEY`, `JWT_SECRET_KEY`.
- Configure CORS to allow `http://localhost:5173`.

### Phase 2: Database Schema & Migrations
- Write SQLAlchemy 2.0 ORM models for all 18 tables.
- Generate and apply initial Alembic migration against Supabase PostgreSQL.
- Seed baseline administrative accounts and demo institutions (BITS Bhopal, Vidyapeeth College).

### Phase 3: Authentication & Security (4 Roles)
- Implement `/api/v1/auth/login` and `/api/v1/auth/me`.
- Create role-enforcement dependencies: `require_role(["college"])`, `require_role(["verification", "senior-officer"])`.
- Connect frontend [`src/pages/LoginPage.jsx`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/aicte-validator-frontend/src/pages/LoginPage.jsx) so 1-click role logins authenticate with the live backend.

### Phase 4: Storage & Document Ingestion
- Implement `/api/v1/applications/{id}/documents/upload` accepting multipart PDF/PNG/JPG (enforcing 10MB limit).
- Upload to private Supabase bucket `aicte-documents`.
- Calculate file SHA-256 digest; write entry to `documents` table.
- Use PyMuPDF to rasterize PDF pages at 180 DPI RGB images for downstream ML models.

### Phase 5: Sarvam Document AI Integration (COMPLETED & VERIFIED)
- Implemented `SarvamDocumentClient` service in [`backend/app/ai/sarvam_client.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/ai/sarvam_client.py):
  - Integrates with live `api.sarvam.ai/doc-ai/v1`:
    - `POST /job/digitise`: full OCR, layout reading order, table blocks, pixel & normalized bounding boxes.
    - `POST /job/extract`: schema-guided extraction for the Golden 5 Dossier types (`Land`, `Fire Safety`, `Faculty`, `Building`, `Affiliation`).
    - Robust heuristic fallback engine guaranteeing zero downtime.
- Implemented `run_document_pipeline` in [`backend/app/workers/pipeline.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/workers/pipeline.py) persisting to `ocr_results` and `extracted_fields`.
- Added endpoints in [`backend/app/api/v1/documents.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/api/v1/documents.py):
  - `GET /documents/{doc_id}/ocr`
  - `GET /documents/{doc_id}/fields`
  - `POST /documents/{doc_id}/reprocess`
  - `PATCH /documents/{doc_id}/fields/{field_id}` (Manual officer override with cryptographic audit logging)
- Added `documentService` in frontend [`aicte-validator-frontend/src/services/api.js`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/aicte-validator-frontend/src/services/api.js).
- **Verified with automated tests in `backend/tests/test_sarvam.py` (5/5 passed including live API calls). All 26 backend tests passed.**

### Phase 6: Document Forensics (ViT + DocTamper + YOLO) (COMPLETED & VERIFIED)
- **ViT ELA Detector ([`backend/app/ai/vit_detector.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/ai/vit_detector.py))**:
  - Multi-scale Error Level Analysis (JPEG Q=90, difference amplification multiplier, alpha=0.35 blending).
  - Statistical variance and high-energy anomaly scoring; generates ELA overlay heatmaps.
  - Persists `TamperAnalysis` records with `model_name="ViT-ELA"`.
- **DocTamper DTD Adapter ([`backend/app/ai/doctamper_adapter.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/ai/doctamper_adapter.py))**:
  - Text-level tamper localization via Laplacian/Sobel high-frequency local variance filtering.
  - Generates 1-channel binary tamper mask (`mask_bytes`) and bounding box overlay (`overlay_bytes`).
  - Persists `TamperAnalysis` records with `model_name="DocTamper-DTD"`.
- **YOLO Statutory Detector ([`backend/app/ai/yolo_detector.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/ai/yolo_detector.py))**:
  - Official municipal/fire department ink seal/stamp detection (HSV color thresholding & morphology).
  - Cursive authorized signature stroke detection.
  - Cryptographic QR code detection and decoding via `cv2.QRCodeDetector`.
  - Header letterhead banner detection; crops each element and stores thumbnail (`crop_storage_key`).
  - Persists `YOLODetection` records.
- **Forensics Orchestrator & Triaging Policy ([`backend/app/ai/forensics_orchestrator.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/ai/forensics_orchestrator.py))**:
  - Evaluates forensic signals across all pages and determines regulatory triage status (`check_status`).
  - Synthesizes actionable `Finding` records (e.g. "Potential Localized Text Alteration Flagged", "Missing Competent Authority Seal").
  - Seamlessly integrated into `run_document_pipeline` in [`backend/app/workers/pipeline.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/workers/pipeline.py).
- **API Endpoints ([`backend/app/api/v1/documents.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/api/v1/documents.py))**:
  - `GET /documents/{doc_id}/forensics`: Returns all tamper analyses, YOLO detections, masks, overlays, and check status with signed preview URLs.
  - `GET /documents/{doc_id}/findings`: Returns all findings for the document.
- **Frontend Integration**: Updated `documentService` in [`src/services/api.js`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/aicte-validator-frontend/src/services/api.js) with `getDocumentForensics` and `getDocumentFindings`.
- **Automated Tests**: Added [`backend/tests/test_forensics.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/tests/test_forensics.py). All 4 tests passed; entire test suite (30/30 tests) passed.

### Phase 7: Regulatory Rule Engine & Faculty Deduplication (COMPLETED & VERIFIED)
- **APH 2026-27 Rule Engine ([`backend/app/compliance/rule_engine.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/compliance/rule_engine.py))**:
  - Deterministic evaluation of statutory rules:
    - `APH-LAND-01`: Minimum land area (7.5 acres rural / 2.5 acres metro) & Contiguity parcel requirement.
    - `APH-FIRE-01`: Fire Safety Certificate validity against scrutiny date.
    - `APH-SFR-01`: Student-to-Faculty Ratio ($\le 1:20$ ceiling, $\le 1:15$ Tier-1 accreditation tier).
    - `APH-CADRE-01`: Faculty Cadre Ratio ($1:2:6$) & minimum $\ge 1$ full Professor per department.
    - `APH-DEDUP-01`: Cross-institutional faculty deduplication.
  - Persists `RuleResult` rows and synthesizes regulatory `Finding` records.
  - Integrated into document worker pipeline (`run_document_pipeline`) for continuous real-time compliance tracking.
- **Faculty Cross-Institutional Deduplication Engine ([`backend/app/compliance/deduplication_engine.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/compliance/deduplication_engine.py))**:
  - Scans National Faculty Registry indexes and active college dossiers for duplicate PAN hashes and identity matches.
  - On collision: automatically logs `Escalation` to Regional Director (`ESC-2026-xxx`), generates danger-level `Finding`, elevates application priority to `High`, and records cryptographic audit ledger block.
- **API Endpoints ([`backend/app/api/v1/compliance.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/app/api/v1/compliance.py))**:
  - `GET /rules`: List all APH 2026-27 rule definitions and parameters.
  - `GET /applications/{app_id}/rules`: Returns evaluated compliance results with observed vs expected values.
  - `POST /applications/{app_id}/rules/evaluate`: On-demand rule evaluation and deduplication scan.
  - `GET /applications/{app_id}/deduplication`: Live cross-institutional collision report.
- **Frontend Integration**: Added `complianceService` in [`src/services/api.js`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/aicte-validator-frontend/src/services/api.js).
- **Automated Tests**: Added [`backend/tests/test_compliance.py`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/backend/tests/test_compliance.py). All 5 tests passed; entire test suite (**35/35 tests**) passed.

### Phase 8: Simultaneous Frontend Integration
- Connect [`src/services/api.js`](file:///c:/Users/shlok/OneDrive/Desktop/SIH11/aicte-validator-frontend/src/services/api.js) to live endpoints.
- Update `CollegeDashboard.jsx` (form submission & upload checklist).
- Update `VerificationDashboard.jsx` (render live Sarvam OCR text and tamper bounding boxes in `DocumentReviewWorkspace.jsx`).
- Update `SeniorOfficerDashboard.jsx` (senior decision sign-offs and live CSV export).

### Phase 9: Cryptographic Audit Ledger & Reports
- Append SHA-256 hashed audit events upon every document upload, query response, and senior approval.
- Expose `/api/v1/audit/trail` and `/api/v1/audit/verify-chain` to prove ledger immutability.
- Connect `AuditTrailView.jsx` and `ComplianceReportsView.jsx`.

### Phase 10: Testing, Evaluation & Demo Rehearsal
- Test with sample genuine and manipulated PDFs (edited intake numbers, expired dates, duplicate faculty).
- Measure accuracy, latency, and false positive rates.
- Rehearse the complete hackathon presentation flow.

---

## 8. Environment Variables Specification

### Backend `.env` (Never committed to Git)
```env
# Server
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Supabase Storage (Private)
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...[SERVICE_ROLE_KEY]
SUPABASE_STORAGE_BUCKET=aicte-documents

# Sarvam Document AI API (Backend Only)
SARVAM_API_KEY=sk_sarvam_...[API_KEY]
SARVAM_MAX_PAGES_PER_JOB=20

# JWT Auth
JWT_SECRET_KEY=super-secret-cryptographic-salt-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Redis / Celery
REDIS_URL=redis://localhost:6379/0

# ML Models
MODEL_CACHE_DIR=./models_cache
VIT_MODEL_ID=zodumair/document-forgery-detector
YOLO_MODEL_PATH=./weights/yolov8_stamps_signatures.pt
DOCTAMPER_CHECKPOINT_PATH=./checkpoints/DocTamper_checkpoint.pth
MAX_UPLOAD_MB=10
```

### Frontend `.env` (`aicte-validator-frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCK_FALLBACK=true
```

---

## 9. Immediate Next Actions

1. Confirm Supabase project credentials (URL & Service Role Key) or local PostgreSQL setup.
2. Obtain / confirm Sarvam AI API subscription key (`SARVAM_API_KEY`).
3. Scaffold `backend/` directory structure and initiate Phase 1 & 2.
4. Wire the first live endpoint (`/api/v1/auth/login`) directly into the frontend.
