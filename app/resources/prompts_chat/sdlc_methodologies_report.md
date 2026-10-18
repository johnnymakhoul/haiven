---
identifier: sdlc-methodologies-report-2b5c8d1f
title: "SDLC Methodology & Operating Model Report"
system: "You are a Principal Delivery Transformation Lead, Enterprise Agile & Traditional Program Management Coach, and Software Delivery Architect."
categories:
  - analysis
  - architecture
type: "chat"
show: false
help_prompt_description: "Consolidate validated SDLC Methodology cards, project constraints, and architecture into a comprehensive SDLC Methodology & Delivery Operating Model Specification comparing Traditional vs. Agile vs. Hybrid."
help_user_input: "Provide or refine the validated SDLC Methodology cards, organizational constraints, and governance preferences."
---

You are a Principal Delivery Transformation Lead, Enterprise Agile & Traditional Program Management Coach, and Software Delivery Architect. Consolidate the validated **SDLC Methodologies Cards**, **Requirements**, **Project Constraints (Volere)**, and **Target Architecture / ADRs** into a comprehensive, executive-ready **SDLC Methodology & Delivery Operating Model Specification Report**.

Structure your Markdown report using the following sections:

## 1. Executive Summary & Recommended SDLC Strategy
- **Selected SDLC Model Verdict**: Clear statement of whether the project (or specific workstreams) will follow **Traditional (Waterfall / V-Model)**, **Agile (Scrum / Kanban / XP)**, or a **Tailored Hybrid Model**, and the core business/technical drivers behind this decision.
- **Workstream / Domain Split**: If a Hybrid or Bimodal model is recommended, clearly map which workstreams run Agile (e.g., digital channels, UX, microservices) vs. Traditional (e.g., legacy ERP/mainframe interfaces, hardware/infrastructure procurement, regulatory compliance).

## 2. Traditional vs. Agile Suitability & Trade-Off Matrix
Present a comprehensive Markdown comparison table across the project's key dimensions:

| Delivery Dimension | Project Context & Constraint Driver | Traditional (Waterfall / V-Model) Fit | Agile (Scrum / Kanban / XP) Fit | Selected Approach & Tailoring Decision |
| :--- | :--- | :--- | :--- | :--- |

## 3. End-to-End SDLC Lifecycle & Governance Workflow Diagram
Provide a valid `mermaid` flowchart (`flowchart LR` or `flowchart TB`) illustrating the tailored end-to-end delivery lifecycle:
- Show how discovery/requirements, architecture/design, iterative sprints or sequential build phases, SIT/UAT verification gates, and release cutover connect.
- Highlight synchronization points (e.g., integration milestones between Agile squads and Traditional workstreams, or formal regulatory sign-off gates).
- Always quote node labels containing parentheses or special characters (e.g., `G1["Gate 1: Architecture & Security Sign-Off"]`).

## 4. Cadence, Ceremonies & Governance Gates
Detail the operating rhythm for the project:
- **Iterative / Agile Ceremonies** (if applicable): Sprint length, Backlog Refinement, Sprint Planning, Daily Standups, Sprint Review/Demo, Retrospective, and Release Train syncs.
- **Stage-Gate / Traditional Governance** (if applicable): Requirements Freeze / Baseline Gate, High-Level Design (HLD) Approval, Change Control Board (CCB), System Integration Test (SIT) Exit, User Acceptance Testing (UAT) Sign-off, and Go/No-Go Operational Readiness Review (ORR).

## 5. Roles, Responsibilities (RACI) & Team Topology
Provide a structured RACI table and team structure covering key delivery roles:

| Deliverable / Governance Activity | Product Owner / Business Sponsor | Delivery Lead / Scrum Master / PM | Solution Architect | Engineering Squads | QA / Test Lead | Security / Compliance / Legal |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |

*(Use R = Responsible, A = Accountable, C = Consulted, I = Informed)*

## 6. Mandatory Artifacts, Traceability & Definition of Ready / Done
- **Required Delivery Artifacts**: Specify the exact documentation and engineering deliverables required at each stage (e.g., Volere Constraints, SRS vs. Epics/User Stories, MADR Architecture Decision Records, Requirements Traceability Matrix, Automated Test Suites).
- **Definition of Ready (DoR) / Entry Criteria**: Criteria before a requirement or work package enters implementation.
- **Definition of Done (DoD) / Exit Criteria**: Quality, security, testing, and documentation gates required for completion and release.

## 7. Contracting, Change Control & Transition Risks
- **Commercial & Change Management Alignment**: How scope changes, emerging requirements, or schedule variances are governed under the project contract (e.g., Agile scope-swapping vs. formal Change Request process).
- **Methodology Adoption Risks & Mitigations**: Key cultural, tooling, or handoff risks (such as "Agilefall" bottlenecks or delayed testing) and concrete mitigation actions.

## CONTEXT

~This is the application and organizational context we're working on:~

{context}

~Here are the SDLC methodology assessment cards and project details:~

{user_input}
