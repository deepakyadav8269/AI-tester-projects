# Steps to Follow for Effective Prompt Engineering

- **Author:** Pramod Dutta
- **Role:** Principal SDET
- **Website:** [The Testing Academy](https://thetestingacademy.com/)
- **LinkedIn:** [linkedin.com/in/pramoddutta](https://www.linkedin.com/in/pramoddutta/)

---

**Purpose:** A systematic approach to crafting prompts
**Chapter:** 2 - Prompt Engineering

---

## The 7-Step Process

```
┌─────────────────────────────────────────────────────────┐
│           EFFECTIVE PROMPT ENGINEERING STEPS            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1. Define the Goal                                    │
│   2. Gather Context                                     │
│   3. Choose Prompting Strategy                          │
│   4. Structure the Prompt                               │
│   5. Add Constraints                                    │
│   6. Test and Iterate                                   │
│   7. Document and Reuse                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Define the Goal

**Ask yourself:**
- What exactly do I need?
- What will I do with the output?
- What does success look like?

```
❌ Vague: "Help me with testing"
✅ Clear: "Generate 10 test cases for login validation"
```

---

## Step 2: Gather Context

**Collect all relevant information:**
- [ ] PRD / Requirements document
- [ ] API documentation
- [ ] Screenshots / UI mockups
- [ ] Error logs
- [ ] Previous test cases
- [ ] Constraints / Limitations

**Rule:** More context = Better output

---

## Step 3: Choose Prompting Strategy

| Situation | Strategy |
|-----------|----------|
| Simple, standard task | Zero-Shot |
| Custom format needed | Few-Shot |
| Complex analysis | Chain-of-Thought |
| Domain expertise needed | Role-Based |

---

## Step 4: Structure the Prompt

**Use a framework (RICE POT recommended):**

```
ROLE: [Expertise]
INTENT: [Purpose]
CONTEXT: [Background info]
EXPECTED: [Success criteria]
PARAMETERS: [Constraints]
OUTPUT: [Format]
TASK: [Specific instruction]
```

---

## Step 5: Add Constraints (Critical for QA)

**Anti-Hallucination Constraints:**
```
CONSTRAINTS:
- Use ONLY the provided documentation
- Do NOT assume undocumented features
- Mark uncertainties as "[NEEDS CLARIFICATION]"
- If information is missing, state "Not specified"
```

---

## Step 6: Test and Iterate

**Iteration Process:**

```
┌──────────────────────────────────────┐
│  Run Prompt                          │
│       ↓                              │
│  Review Output                       │
│       ↓                              │
│  Identify Issues                     │
│       ↓                              │
│  Refine Prompt                       │
│       ↓                              │
│  Repeat until satisfactory           │
└──────────────────────────────────────┘
```

**Common Refinements:**
- Add more specific instructions
- Provide examples (few-shot)
- Tighten constraints
- Change output format

---

## Step 7: Document and Reuse

**Save successful prompts as templates:**

```
📁 prompts/
├── test_case_generation.md
├── bug_report_template.md
├── api_testing_prompt.md
└── code_review_prompt.md
```

---

## Quick Checklist

Before running any prompt:

- [ ] Goal is clearly defined
- [ ] All relevant context is included
- [ ] Appropriate strategy chosen
- [ ] Prompt is well-structured
- [ ] Anti-hallucination constraints added
- [ ] Output format specified
- [ ] Task instruction is specific

---

## Common Mistakes to Avoid

| Mistake | Impact | Fix |
|---------|--------|-----|
| Skipping context | Poor, generic output | Gather all docs first |
| No constraints | Hallucinations | Add anti-hallucination rules |
| Vague task | Inconsistent results | Be specific |
| No format | Unstructured output | Specify format |
| No iteration | Suboptimal results | Test and refine |

---

## See Also

- [RICE POT Framework](ch_02_rice_pot_framework.md)
- [Anatomy of a Prompt](ch_02_anatomy_of_prompt.md)
- [Prompt Types](ch_02_prompt_types.md)