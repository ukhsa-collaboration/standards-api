# SDLC

This page provides guidance and policy regarding the software delivery lifecycle (SDLC) &mdash; i.e. the sequence of activities required and recommended to ensure the quality of individual work items such as user stories or bugs. See also [Environments](environments.md).

## Work items

Work is delivered as a series of work item (such as user story or a bug fix) that represent the unit of delivery. A work item MUST be completed in its entirety to be considered done. If at any stage it becomes clear that this is infeasible or undesirable then the work item MUST be split, or moved back to a pending state, or closed as not done.

Different work item types represent different types of work. For software delivery initiatives, work item types MUST include the following and should usually be restricted to only these options:

- **User story**: A user-focused requirement written from the end user's perspective that describes a software feature, the type of user, what they want, and why. This SHOULD be formatted as "As a [type of user], I want [goal] so that [benefit]."
- **Enabler**: Changes such as refactoring or retrofitting missing tests that improve the quality of the system but do not deliver functional changes. 
- **Bug**: A defect in the system that causes it to behave incorrectly or unexpectedly. Bugs MUST include steps to reproduce, expected behavior, actual behavior, and information about the environment in which the bug occurs.
- **Spike**: A time-boxed investigation activity aimed at exploring alternative approaches or to determine the feasibility of a possible design. Any code developed during the spike SHOULD be discarded.
- **Tasks**: Clearly defined activity that has business benefit but does not involve code changes.

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

We discuss each of this high level groupings in more detail in the sections that follow.

## Pending

### Backlog ordering

> [!IMPORTANT]
> 
> Pending work items SHOULD be split into a loosely ordered backlog and a strictly ordered _Next up_ stage, which SHOULD contain 10&ndash;20 items at all times.

``` mermaid
flowchart LR
    a(Loosely ordered backlog) --> b(Strictly ordered Next up)
```

Conceptually the backlog of pending work items should be ordered strictly in the sequence that they should be delivered. In practice, it is not practical to insist that the entire backlog should be kept in order like this and a couple of pragmatic options are available:

1. Agree tha the top _N_ items of the backlog will be kept in order.
1. Keep the main backlog loosely in order and introduce a _Next up_ stage which is kept strictly ordered and periodically topped up to ensure the team have a ready list of work items to pick up.

The second option is preferred as it tends to be easier to enforce.

In addition to being strictly ordered, work items MUST be [refined](#refinement) before being considered ready to move to the Next up queue to ensure the goal is clear.

### Refinement

_Next up_ is a holding stage indicating that items are ready to move into implementation. Refinement is the process that ensures items are ready to move into that stage. 

After refinement, work items SHOULD NOT contain much detail beyond what is described below. The work to add further detail should be deferred to the elaboration **(TO DO — add link)** stage where there is richer information. 

#### User stories

- The **title** MUST briefly state who will benefit from the change and what the proposed change is, using the form "[user] can [action]".
    - e.g. _New user can register with email address and password"_
- The **description** MUST be a statement that clearly states who will benefit from the change, what the proposed change is, and why it is beneficial.
    - e.g. _"As a new user, I can register with my email address and password, so that I can control access to my account without requiring a social login."_

#### Enablers

- The **title** MUST briefly state the proposed change and what it enables.
    - e.g. _Refactor user registration code to enable social log in options."_
- The **description** MUST be a statement that clearly states the need that the enabler will meet and how it will do so.
    - e.g. _"The user registration code currently assumes users will register and subsequently log in by providing a password. To enable the addition of social log in options, this must be made more generic, allowing for other authentication mechanisms."_

#### Bugs

- The **title** MUST briefly state the user, action and unexpected result.
    - e.g. _New user can register with same email address as an existing account"_
- The **description** MUST be a statement that clearly states who triggered the defect, what they did, the expected result, and the actual result. If not implicit, the description MUST also describe why the expected result is correct.
    - e.g. _"When a new user tries to register with the same email address as an existing account, they should be prevented from doing so and presented with an error message, but instead they can do so without error. This allows duplicate accounts to be created which will break subsequent log ins and other functionality."_

#### Spikes


#### Tasks



### In progress

``` mermaid
flowchart LR
    a(Elaboration) --> i(Implementation) --> v(Validation)
```

1. All work items must TODO

- The **test** approach MUST be specified, and SHOULD include acceptance criteria using given/when/then form.
    - e.g. _"Given I am on the registration screen, when I enter an email address for an existing user, then I see an error message explaining this."_
- An **implementation approach** MUST be documented.

### Done