# SDLC

This page provides guidance and policy regarding the software delivery lifecycle (SDLC) &mdash; i.e. the sequence of activities required and recommended to ensure the quality of individual work items such as user stories or bugs. See also [Environments](environments.md).

## Work items

Work is delivered as a series of work item (such as user story or a bug fix) that represent the unit of delivery. A work item MUST be completed in its entirety to be considered done. If at any stage it becomes clear that this is infeasible or undesirable then the work item MUST be split, or moved back to a pending state, or closed as not done.

Different work item types represent different types of work. For software delivery initiatives, work item types MUST include the following and SHOULD usually be restricted to only these options:

- **User story**: A user need/want written from the end user's perspective that describes a software feature and clearly indicates the type of user, what they want, and why. 
- **Enabler**: Changes such as refactoring or retrofitting missing tests that improve the quality of the system but do not deliver functional changes. 
- **Bug**: A defect in the system that causes it to behave incorrectly or unexpectedly. Bugs MUST include steps to reproduce, expected behavior, actual behavior, and information about the environment in which the bug occurs.
- **Spike**: A time-boxed investigation activity aimed at exploring alternative approaches or to determine the feasibility of a possible design. Any code developed during the spike SHOULD be discarded.
- **Tasks**: Clearly defined activity that has business value but does not involve code changes.

User stories MUST be formulated following the INVEST principal as described below. Most of these characteristics are also desirable for other types of work item.

- **Independent** of each other.
- **Negotiable**, leaving room for details of the solution to emerge during implementation.
- **Valuable** on their own, with the value clearly indicated.
- **Estimable**, meaning they are well enough understood for the required effort to be estimated, at least approximately.
- **Small**, ideally requiring hours or a small number of days to deliver, but not more.
- **Testable**, so that correctness can be validated.

## Flow of work

In high level terms, [work items](#work-items) are created in a pending state, move through various in-progress states, and when complete move to a done state.

``` mermaid
flowchart LR
    P[[Pending]] --> IP[[In progress]] --> D[[Done/<br>Closed not done]]
```

We discuss each of these high level groupings in more detail in the sections that follow.

## Pending

### Backlog ordering

Conceptually the backlog of pending work items should be ordered strictly in the sequence that they should be delivered. In practice, it is not practical to insist that the entire backlog should be kept in order like this and a couple of pragmatic options are available:

1. Agree tha the top _N_ items of the backlog will be kept in order.
1. Keep the main backlog loosely in order and introduce a _Next up_ stage which is kept strictly ordered and periodically topped up to ensure the team have a ready list of work items to pick up.

The second option is preferred as it tends to be easier to enforce.


> [!TIP]
> 
> Pending work items SHOULD be split into:
> 
> 1. a loosely ordered backlog, and
> 2. a strictly ordered _Next up_ stage, which SHOULD contain 10&ndash;20 items at all times.

``` mermaid
flowchart LR
    a("Backlog<br/>(Loosely ordered)") --> b("Next up<br/>(Strictly ordered)")
```

In addition to being ordered, work items MUST be [refined](#refinement) before being considered ready to move to the Next up queue to ensure the goal is clear.

### Refinement

_Next up_ is a holding stage indicating that items are ready to move into implementation. Refinement is the process that ensures items are ready to move into that stage. 

``` mermaid
flowchart LR
    a(Backlog) -->|Refinement| b(Next up)
```

After refinement, work items SHOULD NOT contain much detail beyond what is described below. The work to add further detail SHOULD be deferred to the [elaboration](#elaboration) stage. Since elaboration happens just in time, there is the richest possible information available. 

Specific guidance and policy for the **title** and **description** in each item type is provided below. No other properties should be populated at this stage.

<details class="tip" markdown>

<summary>User stories</summary>

- The **title** MUST briefly state who will benefit from the change and what the proposed change is, using the form "[user] can [action]".
    - e.g. _"New user can register with email address and password."_
- The **description** MUST be a statement that clearly states who will benefit from the change, what the proposed change is, and why it is beneficial.
    - e.g. _"As a new user, I can register with my email address and password, so that I can control access to my account without requiring a social login."_

</details>

<details class="tip" markdown>

<summary>Enablers</summary>

- The **title** MUST briefly state what needs to be done any why.
    - e.g. _"Refactor user registration code to enable social log in options."_
- The **description** MUST be a statement that clearly states the need that the enabler will meet and how it will do so.
    - e.g. _"The user registration code currently assumes users will register and subsequently log in by providing a password. To enable the addition of social log in options, this must be made more generic, allowing for other authentication mechanisms."_

</details>

<details class="tip" markdown>

<summary>Bugs</summary>

- The **title** MUST briefly state the user, action and unexpected result.
    - e.g. _"New user can register with same email address as an existing account."_
- The **description** MUST be a statement that clearly states who triggered the defect, what they did, the expected result, and the actual result. If not implicit, the description MUST also describe why the expected result is correct.
    - e.g. _"When a new user tries to register with the same email address as an existing account, they should be prevented from doing so and presented with an error message, but instead they can do so without error. This allows duplicate accounts to be created which will break subsequent log ins and other functionality."_

</details>

<details class="tip" markdown>

<summary>Spikes</summary>

- The **title** MUST briefly state the decision that will be enabled by the information coming from the spike.
    - e.g. _"Determine PDF library to use for customer invoices."_
- The **description** MUST be a statement that clearly explains the decision that needs to be made, constraints, and how the spike should provide the information to support it.
    - e.g. _"Users will have the option to download their invoice as a PDF. We need to choose a PDF library to support this."_

</details>

<details class="tip" markdown>

<summary>Tasks</summary>

- The **title** MUST briefly state what non-coding activity needs to be done and why.
    - e.g. _"Determine initial payment provider for MVP."_
- The **description** MUST be a statement that explains what the task is, how it will be done and the definition of done.
    - e.g. _"To enable the MVP to go live as early as possible, we wish to launch with a single payment provider. Work with the CFO to determine which that should be, based on cost to implement and expected usage."_

</details>

## In progress

While in progress, items MUST pass through each of the following states, described below. 

``` mermaid
flowchart LR
    e(Elaboration) --> i(Implementation) --> v(Validation) --> m(Merge & Deploy)
    click e "#elaboration"
    click i "#implementation"
    click v "#validation"
    click m "#merge-deploy"
```

### Elaboration

Elaboration MUST be performed for every work item before implementation to define and document the following properties.

**Title and description**

MUST be reviewed and refreshed to ensure they're clear and accurate.

| User story | Enabler | Bug | Spike | Task 
| :- | :- | :- | :- | :- 
| MUST | MUST | MUST | MUST | MUST

**Functional acceptance criteria** (ACs)

In Given/When/Then form. e.g. _"Given I am on the registration screen, when I enter an email address for an existing user, then I see an error message explaining this."_

| User story | Enabler | Bug | Spike | Task 
| :- | :- | :- | :- | :- 
| MUST | - | SHOULD | - | - 

**Non-functional ACs**

To capture quality requirements in user-centric terms using Given/When/Then form.

| User story | Enabler | Bug | Spike | Task 
| :- | :- | :- | :- | :- 
| MUST | - | - | SHOULD | - 

**Technical approach**

In enough detail that everyone in the team would take a similar approach to implementing the item using the approach described.

<details class="note" markdown>

<summary>Example</summary>

e.g. For the spike **_Determine PDF library to use for customer invoices_**, the technical approach may be: 

> _Users will have the option to download their invoice as a PDF. We need to choose a PDF library to support this. It should ideally be free and open source, be able to generate a PDF for a typical invoice is under 100ms, and enable easy and flexible layout and styling of the PDF. Given the attached sample invoice data sets, identify candidate libraries, filter based on feature set and by reviewing documentation, and select a few (suggest 3) to build proof or concept implementations for._

</details>

| User story | Enabler | Bug | Spike | Task 
| :- | :- | :- | :- | :- 
| MUST | MUST | - | MUST | - 

**Test approach**

To augment the ACs, to similar detail as the technical approach.

| User story | Enabler | Bug | Spike | Task 
| :- | :- | :- | :- | :- 
| MUST | MUST | MUST | - | -  

**Estimate**

All items MUST be estimated in story points, derived by whole-team blind estimation ("planning poker" style).

| User story | Enabler | Bug | Spike | Task 
| :- | :- | :- | :- | :- 
| MUST | MUST | MUST | MUST | MUST

### Implementation

- All **acceptance criteria** MUST be met.
- For **user stories**, **enablers**, and **bugs**, appropriate unit testing MUST be implemented. This SHOULD achieve at least 80% code coverage.
- All **unit tests** MUST be run and pass
- **Static code analysis** to UKHSA standards MUST be run and all issues resolved.
- Appropriate **automated testing** at other levels (e.g. component, integration, API, UI, system) and to validate non-functional requirements MUST be implemented and pass.
- All code MUST be **peer reviewed** and all issues addressed.

### Validation

- All work items MUST be validated by **exploratory testing** by a peer or dedicated tester and evidence MUST be documented in the work item.
- The **Product Owner** or other responsible party MUST approve each item before it is considered done.
- Minor issues can be addressed while the item is in validation, but if significant issues are found then it SHOULD be moved back to implementation.

### Merge & Deploy

- Once implementation and validation are complete, the code MUST be promptly **merged**. This will trigger an automated deployment as described in [environments](environments.md).
- The work item MUST be closed once this has been done.

### Closed/Done

- Once all work is complete, the item moves to done.
- If an item is deemed infeasible or no longer desirable then it MUST be moved to a Closed (not done) state.
