# AICTE Application Validation, Document Authentication and Regulatory Compliance Verification System

**SIH Problem Statement ID:** 26261  
**Project Module:** Frontend (Client-side Web Application)

---

## 📌 Project Overview
This repository hosts the frontend application for the AICTE Application Validation, Document Authentication, and Regulatory Compliance Verification System. The frontend provides interfaces for educational institutions, verification officers, senior authorities, and administrators to validate institutional data, scrutinize regulatory compliance, and track verification decisions.

> **Note:** The backend API and database systems are developed independently by other team members.

---

## 🛠️ Technology Stack
- **Framework / Bundler:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

---

## 📂 Project Structure
```text
aicte-validator-frontend/
├── public/
│   ├── images/              # Static image assets served directly
│   └── favicon.svg          # Application favicon
│
├── src/
│   ├── assets/
│   │   ├── images/          # Bundled images & graphics
│   │   └── styles/
│   │       └── index.css    # Global stylesheet & Tailwind CSS import
│   │
│   ├── components/
│   │   ├── common/          # Reusable shared UI components (Button, SectionHeading)
│   │   ├── landing/         # Modular landing page sections
│   │   └── auth/            # Auth-related reusable wrappers (ProtectedRoute)
│   │
│   ├── layouts/
│   │   └── PublicLayout.jsx # Standard outer shell for public routes
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx  # Phase 1 landing page placeholder
│   │   ├── LoginPage.jsx    # Authentication placeholder
│   │   ├── NotFoundPage.jsx # 404 error page
│   │   └── dashboards/      # Role-specific dashboard placeholders
│   │       ├── AdminDashboard.jsx
│   │       ├── CollegeDashboard.jsx
│   │       ├── VerificationDashboard.jsx
│   │       └── SeniorOfficerDashboard.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx    # Centralized routing configuration
│   │
│   ├── data/
│   │   └── landingPageData.js # Mock data for features, stats, workflow
│   │
│   ├── services/
│   │   └── api.js           # Centralized Axios client instance
│   │
│   ├── hooks/               # Custom reusable React hooks
│   ├── utils/               # Shared helper functions
│   ├── App.jsx              # Root app component with BrowserRouter
│   └── main.jsx             # Application entry point
│
├── .env.example             # Template for environment variables
├── .gitignore               # Git ignore patterns
├── index.html               # Main HTML document
├── package.json             # NPM dependencies and scripts
├── vite.config.js           # Vite build and plugin configuration
└── README.md                # Project documentation
```

---

## 🚦 Application Routes
| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `LandingPage` | Public introductory portal and feature overview |
| `/login` | `LoginPage` | Authentication portal placeholder |
| `/admin` | `AdminDashboard` | Administrator dashboard placeholder |
| `/college` | `CollegeDashboard` | Educational institution portal placeholder |
| `/verification` | `VerificationDashboard` | Scrutiny & verification officer dashboard placeholder |
| `/senior-officer` | `SeniorOfficerDashboard` | Senior authority / approval dashboard placeholder |
| `*` | `NotFoundPage` | 404 page with navigation return |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or yarn

### 2. Installation
Navigate into the frontend directory:
```bash
cd aicte-validator-frontend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Running the Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### 5. Building for Production
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory.
