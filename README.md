# SIH 26261 - AICTE Application Validation, Document Authentication & Regulatory Compliance Verification System

**Smart India Hackathon Problem Statement ID:** 26261  
**Project:** AICTE Institutional Application Validation & Regulatory Compliance Verification System

---

## 📌 Project Overview
This repository contains the prototype implementation for the AICTE Application Validation, Document Authentication, and Regulatory Compliance Verification System. The system streamlines institutional approval scrutiny, regulatory rule enforcement, OCR-based document verification, faculty deduplication, and regional directorate approvals across technical higher education institutions in India.

## 📂 Repository Structure
- **[`aicte-validator-frontend/`](./aicte-validator-frontend/)**: React 19 + Vite + Tailwind CSS frontend application featuring:
  - **Public Portal & Landing Page**: Public notices, AICTE regulatory handbook references, and application status search.
  - **Portal Authentication**: Role-based access simulation for Institutional, Verification, Directorate, and Admin roles.
  - **System Admin Console**: RBAC, audit log scrutiny, and regulatory rule engine configuration.
  - **College Representative Dashboard**: Multi-step institutional application filing, document uploads, and clarification responses.
  - **Verification Officer Console**: Scrutiny queue, optical extraction evaluation, query issuing, and case escalations.
  - **Senior Officer Dashboard**: Regional Directorate approval queue, case review workspace (AI vs. human review distinction), escalation resolution, officer performance metrics, compliance reporting with CSV export, decision history, and cryptographic audit trail.

---

## 🚀 Quick Start (Frontend)

```bash
cd aicte-validator-frontend
npm install
npm run dev
```

Visit the local development server at `http://localhost:5173/` or `http://localhost:5174/`.

---

## 🛠️ Technology Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM v7, Lucide Icons, Axios
- **Design Language:** Modern Indian Government Portal Aesthetic (Navy Blue `#102D52`, Emerald, Amber, and Slate)
