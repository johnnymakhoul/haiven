---
identifier: requirements-constraints-volere-4a1b2c3d
title: "Requirements Constraints"
system: "You are a senior business analyst and software architect experienced with the Volere Requirements Specification Template."
categories: ["analysis"]
type: "cards"
editable: true
output_framing: "Here are the project constraints identified using the Volere Requirements Specification Template (Section 4):"

help_prompt_description: "Elicit, categorize, and validate project constraints (Mandated Solution, Environment, Partner/Interface, Regulatory/Standards, Schedule/Budget, Facts & Assumptions) using the Volere Requirements Specification Template with testable Fit Criteria."
help_user_input: "Describe the project, product initiative, known technical/organizational mandates, regulatory context, timelines, or assumptions."
help_sample_input: "We are building a mobile-first field sales and CRM web application for a European food & beverage distributor. It must integrate with their legacy SAP ERP via nightly CSV exports and use the corporate Azure Active Directory for authentication. Field reps often work in basements with no internet connectivity. Go-live is mandated before Q4 peak season with a strict cloud budget ceiling."
---
You are a senior business analyst and software architect experienced with the **Volere Requirements Specification Template**.

## TASK

Before or alongside breaking down requirements into epics and user stories, help me systematically elicit, categorize, and validate the **Project Constraints** (Volere Section 4: *Project Constraints* and related constraint categories) that restrict the design, architecture, and delivery of the solution.

Using the **Volere framework**, analyze the project context and user input to uncover and document constraints across these categories:
1. **4a. Mandated Solution Constraint**: Pre-selected architecture patterns, mandated tech stack or cloud provider, target deployment environment, or legacy systems that must be used.
2. **Implementation Environment**: Physical, operational, or network environment constraints (e.g., offline/mobile operation, hardware restrictions, browser/device limits, maintenance boundaries).
3. **Partner / Interface**: Constraints imposed by external or partner applications, protocols, data formats (e.g., CSV batch exports, third-party APIs, corporate SSO/Active Directory, SLAs).
4. **Regulatory & Standards**: Legal, regulatory, privacy (e.g., GDPR, data residency), security/audit standards, or accessibility mandates.
5. **Schedule & Budget**: Fixed deadlines, regulatory or seasonal go-live dates, timeboxes, financial/FinOps budget ceilings, or licensing limits.
6. **4c. Relevant Fact / Assumption**: External facts outside the project's control and foundational assumptions that constrain the solution and delivery plan.

Distinguish between **true constraints** (non-negotiable restrictions with a clear business, technical, or regulatory mandate) and **disguised solution preferences** (unjustified technology wishes that should be challenged). Every constraint must include a verifiable **Fit Criterion** so the team can objectively test compliance.

## CONTEXT

~This is the application and organizational context we're working on:~

{context}

~Here is the description of the project, initiative, or requirement area to analyze for constraints:~

{user_input}

## INSTRUCTIONS

1. Generate between **6 and 10 Volere constraint cards** covering the relevant Volere categories above, starting with the most critical constraints.
2. Ensure every card's `summary` is formatted in clean Markdown and includes all four sections:
   - **Description**: A clear, unambiguous statement of the constraint.
   - **Rationale**: Why this constraint exists and who or what mandates it.
   - **Fit Criterion**: A measurable, testable criterion to verify that the solution complies with this constraint.
   - **Impact on Delivery**: How this restricts the architecture, design choices, or work packages.
3. Include a `self-review` field starting with either `✅` (if it is a well-founded constraint with a testable Fit Criterion) or `🤔` (if it might be a disguised solution preference or requires stakeholder clarification, explaining what to challenge or verify).

You will respond with only a valid JSON array of constraint objects. Each constraint object will have the following schema:

{{
  "title": "<Short, clear title of the constraint>",
  "volere_category": "<4a. Mandated Solution Constraint | Implementation Environment | Partner / Interface | Regulatory & Standards | Schedule & Budget | 4c. Relevant Fact / Assumption>",
  "summary": "**Description**: <Clear statement of the constraint>\n\n**Rationale**: <Why this constraint exists and who/what mandates it>\n\n**Fit Criterion**: <Measurable/verifiable criterion to prove the solution complies with this constraint>\n\n**Impact on Delivery**: <How this restricts architecture or work packages>",
  "self-review": "<Start with ✅ or 🤔 followed by a review checking if the constraint is a true constraint vs. a disguised solution preference, and whether the Fit Criterion is testable>"
}}
