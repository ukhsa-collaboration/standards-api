# DORA metrics

The [DORA metrics](https://www.atlassian.com/devops/frameworks/dora-metrics) are an important tool in measuring and optimising the fast and safe flow of value from code commit to production. They are [Deployment frequency](#deployment-frequency), [Lead time for changes](#lead-time-for-changes), [Change failure rate](#change-failure-rate), and [Time to restore service](#time-to-restore-service).

## Deployment frequency

_Deployment frequency_ is the mean number of production deployments per day. More, small deployments are preferred, because:

- This gives fast feedback and allows for rapid iteration and learning.
- It reduces the risk of each deployment. Since each deployment contains less, there is less to go wrong. And it's easier to identify the cause when something does go wrong, meaning it is quicker to diagnose and fix any issues.
- It shortens the time to value, getting changes into the hands of users earlier.

Deployment frequency MUST be measured and reviewed at least every two weeks. Frequency SHOULD be at least weekly, and ideally daily or multiple times per day.

## Lead time for changes

_Lead time for changes_ is the mean time for items to progress from code being merged to the default branch to it running in production. This specific measure focuses on the path to live, not the implementation of changes (see [cycle time](sdlc.md#cycle-time)). Shorter lead time for changes is preferred, because:

- It reduces the dead time between change being implemented and the resultant learning and value being realised.
- It reduced complexity by reducing the amount of undeployed work being held in the system.
- It allows more rapid correction of any issues.

Lead time for changes MUST be measured and reviewed at least every two weeks. Lead time SHOULD ideally be minutes or hours, and at most a small number of days.

## Change failure rate

_Change failure rate_ is the proportion of deployments that cause a failure in production.

- Lower failure rate is of course desirable, but the focus should be more on reducing the time to restore service than aiming for zero failure rate.
- High failure rates clearly indicate a quality issue, but some failures are normal.
- An over-focus on driving out any failures is not the best use of time and small gains typically take a big investment of time and leads to increased lead time for changes (and consequently time to restore service).

Change failure rate MUST be measured and reviewed at least every two weeks. Failure rate SHOULD normally be single digit percentages.

## Time to restore service

_Time to restore service_ is the mean time between an issue occurring in the production environment and when it is resolved. Short times are preferred because:

- This minimises user and business impact.
- Being able to fix issues faster enables teams to iterate faster.

Time to restore service MUST be measured and reviewed at least every two weeks. Time SHOULD ideally be minutes or at most hours.
