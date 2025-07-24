# Monitoring & Observability

## Overview

Effective monitoring and observability **MUST** be integrated into all APIs to ensure performance, reliability, continuous improvement, and meet any Service Level Agreements (SLAs) and compliance requirements. This section provides guidance on best practices, including the use of [OpenTelemetry](https://opentelemetry.io/) and [key metrics](#recommended-metrics) to track.

## Monitoring vs. Observability

While often used interchangeably, monitoring and observability serve distinct purposes in API management. **Monitoring** focuses on tracking predefined metrics and known system states, typically answering "_is the system working as expected?_" through dashboards and alerts. **Observability**, on the other hand, provides the capability to understand unknown system states and answer new questions without deploying additional instrumentation. It combines `metrics`, `logs`, and `traces` to give comprehensive insights into system behaviour.

Effective API management requires both, monitoring for known issues and observability for debugging complex, unforeseen problems that may emerge in distributed systems.

## General Guidance

- **MUST** implement monitoring to gain visibility into API performance and health.
- Monitoring **SHOULD** be designed to provide actionable insights for troubleshooting and optimisation.
- APIs **SHOULD** adopt the observability standard [OpenTelemetry](https://opentelemetry.io/) for distributed tracing, metrics, and logs and ensure consistency across all APIs regardless of language / frameworks.
- APIs **MUST NOT** rely on ad-hoc monitoring solutions that lack consistency and integration.
- Monitoring **MUST NOT** introduce significant performance overhead that degrades the API's functionality.
- APIs in development or testing environments **SHOULD** use monitoring to identify issues early but **MUST NOT** rely on it as a substitute for proper testing.
- Monitoring systems **MUST** integrate with alerting tools such as [Prometheus](https://prometheus.io/) to notify teams of critical issues.
- **SHOULD** implement health checks to regularly verify the availability of API endpoints.
- **SHOULD** establish a centralised logging system to aggregate logs from all API services for easier analysis.
- **MUST NOT** neglect documentation of monitoring setups, as this **MUST** be accessible to all relevant teams.

## Recommended Metrics

APIs **SHOULD** be tracking the following key metrics to ensure comprehensive monitoring:

### Latency

- **MUST** measure the time taken to process requests, including response times for various endpoints.
- **SHOULD** categorise latency measurements by percentiles (e.g., p50, p95, p99) to identify performance issues.
- High latency **MUST** trigger alerts for investigation.
- **MUST NOT** ignore latency spikes, as they can indicate underlying problems with the service.

### Traffic

- **MUST** monitor the volume of requests to understand usage patterns, traffic trends and detect anomalies.
- **SHOULD** include metrics such as requests per second (RPS) and client IP counts to gauge load.
- **MUST NOT** underestimate the importance of traffic analysis, as it helps in capacity planning.

### Errors

- **MUST** track error rates (e.g., `4xx` and `5xx` responses) to identify issues with API endpoints.
- **SHOULD** categorise errors by type where appropriate (e.g., client errors, server errors) to facilitate troubleshooting.
- **MUST NOT** ignore increasing error rates; they **MUST** prompt immediate investigation.

### Saturation

- **MUST** monitor resource utilisation (e.g., CPU, memory, database connections, thread pools) to detect saturation points.
- **SHOULD** set alerts for resource thresholds to proactively address potential bottlenecks.
- **MUST NOT** assume that higher resource utilisation is acceptable without appropriate scaling strategies.

## DORA Metrics

To align with industry best practices, API teams **SHOULD** implement the [four key metrics](https://dora.dev/guides/dora-metrics-four-keys/) of [DORA](https://dora.dev/) (DevOps Research and Assessment)  to measure development and operational performance:

### Throughput

- **Lead Time for Changes**: This metric measures the time it takes for a code commit or change to be successfully deployed to production. It reflects the efficiency of your software delivery process.
- **Deployment Frequency**: This metric measures how often application changes are deployed to production. Higher deployment frequency indicates a more efficient and responsive delivery process.

### Stability

- **Change Failure Rate**: This metric measures the percentage of deployments that cause failures in production, requiring hotfixes or rollbacks. A lower change failure rate indicates a more reliable delivery process.
- **Mean Time to Recovery (MTTR)**: Measure the time taken to recover from failures.

## Tools and Standards

| Tool/Standard | Description |
|----------------|-------------|
| [OpenTelemetry](https://opentelemetry.io/) | A vendor-neutral framework for collecting and exporting telemetry data, allowing teams to choose their preferred backend for analysis and visualisation. It supports various [programming languages and platforms](https://opentelemetry.io/), making it a versatile choice for API observability. |
| [Grafana](https://grafana.com/oss/grafana/) | A powerful open-source analytics and monitoring platform that integrates with various data sources, including [Prometheus](https://prometheus.io/). It provides rich visualisations and dashboards for real-time monitoring and analysis of API performance metrics. |
| [Grafana Loki](https://grafana.com/oss/loki/) | A log aggregation system designed to work seamlessly with Grafana. It allows for the collection, storage, and querying of logs, making it easier to correlate logs with metrics and traces for comprehensive observability. |
| [Prometheus](https://prometheus.io/) | An open-source monitoring and alerting toolkit designed for reliability and scalability, particularly suited for dynamic cloud environments. It collects metrics from configured targets at specified intervals, evaluates rule expressions, and can trigger alerts based on those evaluations. |
| [ELK Stack (Elasticsearch, Logstash, Kibana)](https://www.elastic.co/elastic-stack) | A popular open-source stack for log management and analysis. Elasticsearch stores and indexes logs, Logstash processes and ingests logs from various sources, and Kibana provides a web interface for visualising and exploring log data. |
