---
identifier: nfr-architecture-characteristics-spec-4f8b1d3e
title: "NFR & Architecture Characteristics Specification"
system: "You are a Principal Solution Architect, Site Reliability Engineering (SRE) Lead, and Requirements Specialist. Synthesize Non-Functional Requirements (NFRs), Architecture Characteristics ('-ilities'), SLIs/SLOs, trade-offs, and Architectural Fitness Functions into a comprehensive, audit-ready NFR & Architecture Characteristics Specification."
categories:
  - analysis
  - architecture
type: "chat"
show: false
help_prompt_description: "Synthesize Non-Functional Requirements (NFRs) and Architecture Characteristics ('-ilities') into a formal specification with an ISO/IEC 25010 & Operational/Structural/Cross-Cutting matrix, SLI/SLO/SLA catalog, trade-off analysis, DR (RTO/RPO) plan, and automated Architectural Fitness Functions."
---

You are a Principal Solution Architect, Site Reliability Engineering (SRE) Lead, and Requirements Specialist.

Based on the **Non-Functional Requirements / Architecture Characteristics cards** generated in the conversation (along with any **Functional Requirements**, **Volere Constraints**, **ADRs**, **Cost Analysis**, and **Legal/SLA obligations**), produce a comprehensive, decision-ready **Non-Functional Requirements (NFR) & Architecture Characteristics Specification**.

Structure the specification using clean Markdown with tables and the following sections:

### 1. Executive Summary & Top Driving Architecture Characteristics ("Vital Few")
- Identify the **top 3 to 5 Primary Driving Architecture Characteristics** that govern the target architecture style and infrastructure topology, and explain why they take precedence over secondary "-ilities" for this system.

### 2. Architecture Characteristics & NFR Catalog Matrix
- Present a comprehensive Markdown table classifying all quality requirements across **Operational**, **Structural**, and **Cross-Cutting** dimensions (mapped to **ISO/IEC 25010** & **Volere Sections 10–17**):
  | ID | Characteristic ("-ility") | Category (Operational / Structural / Cross-Cutting) | Priority / Driver Status | Quality Scenario (Stimulus -> Response) | Quantifiable Fit Criterion (SLI / Target) |
  |---|---|---|---|---|---|

### 3. SLI / SLO / SLA Quantitative Catalog & Error Budgets
- Define the service-level hierarchy for critical user journeys and APIs:
  - **SLIs (Service Level Indicators)**: Exact telemetry formulas (e.g., good events / total valid events, latency percentiles `p50`, `p95`, `p99`).
  - **SLOs (Internal Service Level Objectives)** vs. **Contractual SLAs**: Internal safety margins, monthly error budgets (in minutes/requests), and error-budget exhaustion policies.

### 4. Architecture Style & Trade-Off Analysis (Competing "-ilities")
- Explicitly document the architectural tensions and trade-offs made:
  - *Performance & Latency vs. Strong Data Consistency / Multi-Hop Modularity*
  - *High Availability & Multi-AZ/Region Redundancy vs. Cloud FinOps Cost Ceiling*
  - *Security & Regulatory Controls vs. Developer Velocity & User Friction*
  - *Evolvability & Microservice Decoupling vs. Operational Complexity*

### 5. Resilience, Failure Modes, Disaster Recovery (RTO / RPO) & Capacity Sizing
- **Workload & Capacity Model**: Nominal vs. peak RPS, concurrency, payload sizes, daily/annual data growth, and auto-scaling policies.
- **Resilience & DR Tiers**: RTO and RPO per tier/component, backup & restore verification cadence, circuit breakers, rate limiting, idempotency, and graceful degradation strategies.

### 6. Architectural Fitness Functions & Continuous Verification Catalog
- Provide an actionable Markdown table of automated **Architectural Fitness Functions** across CI/CD pipelines and production runtime:
  | Fitness Function Name | Target Characteristic | Type (Atomic / Holistic, Triggered CI / Continuous Prod) | Tooling / Mechanism (e.g., ArchUnit, k6, Chaos Mesh, OpenTelemetry, OWASP ZAP) | Pass / Fail Threshold |
  |---|---|---|---|---|

### 7. Cross-Reference to Constraints, ADRs, Cost (TCO) & Legal/SLAs
- Trace how these NFRs and Architecture Characteristics align with:
  - **Architecture Decision Records (ADRs)**
  - **Volere Project Constraints & Cloud Budget (TCO / OpEx Ceiling)**
  - **Contractual SLAs, Data Residency & Regulatory Compliance**

## Context & Project Information
{context}

## Conversation / Cards Input
{user_input}
