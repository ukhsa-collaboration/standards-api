# Non-functional requirements

## Context

In addition to the user needs or wants that are identified, users have expectations for the **quality** of the product or service. Traditionally these are called non-functional requirements. But in the same way that we now recognise that it is better to capture (functional) user needs as user stories, we **SHOULD** consider these additional expectations to be (usually unstated) user **quality** needs, which can be captured as quality acceptance criteria or quality user stories.

For example, a functional user story might be:

> As a customer, I want to search for products by category so that I can find items I'm interested in purchasing.

And a related quality user story might be:

> As a customer, I want search results to load within 2 seconds so that I can browse efficiently without frustration.

## Considerations

When scoping a piece of work, quality needs **MUST** be considered up front alongside functional needs. Specifically, the following **MUST** all be considered:

- [Performance](#performance): Response times, throughput, and resource utilisation under normal and peak loads.
- [Reliability](#reliability): System availability, fault tolerance, and error recovery capabilities.
- [Security](#security): Data protection, authentication, authorisation, and compliance with relevant standards.
- [Usability](#usability): User experience, accessibility, and ease of use across different user groups.
- [Scalability](#scalability): Ability to handle increased load and growth in users or data volume.
- [Maintainability](#maintainability): Code quality, documentation, and ease of future modifications.
- [Compatibility](#compatibility): Cross-platform support, browser compatibility, and integration capabilities.
- [Portability](#portability): Ability to deploy across different environments and infrastructure.
- [Compliance](#compliance): Adherence to industry standards, regulations, and organisational policies.
- [Monitoring](#monitoring): Observability, logging, and alerting capabilities for operational support.

Quality characteristics **MUST** be built into systems from the beginning rather than added as an afterthought. Teams **MUST** consider the architectural and design decisions needed to meet quality requirements during the [elaboration phase](./sdlc.md#elaboration) of each work item.

## Performance

### Building for performance

Systems **MUST** be designed with performance in mind from the outset:

- **Database design**: Consider indexing strategies, query optimisation, and connection pooling to support expected load patterns.
- **Caching strategies**: Consider caching at multiple levels (browser, CDN, application, database) to reduce response times and server load.
- **Resource management**: Design for efficient memory usage, implement proper resource cleanup, and avoid resource leaks.
- **Asynchronous processing**: Use background jobs, message queues, and event-driven architectures to handle time-consuming operations without blocking user interactions.
- **Data pagination**: Implement pagination for large datasets to maintain acceptable response times.

### Validating performance

Load and performance testing evaluates how the system behaves under various load conditions, measuring response times, throughput, and resource consumption.

The following **MUST** be tested under low/normal load and at maximum expected load (recommend testing to 1.5 x expected peak). Load profiles **MUST** mimic both normal and exceptional scenarios, typically including organic/steady rise and fall through the day and week, as well as spikes where load rapidly increases from a low level to the peak.

- Response times and stability for critical user journeys or processes.
- Network latency impact on responsiveness.
- Database query performance for key operations.
- API endpoint response times.
- Performance degradation patterns as load increases.
- Resource utilisation (CPU, memory, disk, network).

## Reliability

### Building for reliability

Systems **MUST** be designed for resilience and fault tolerance:

- **Redundancy**: Eliminate single points of failure through redundant components and failover mechanisms.
- **Failure handling**: Implement robust failure handling with graceful degradation when components or dependencies fail.
- **Circuit breakers**: Consider circuit breaker patterns to prevent cascade failures when upstream services are unavailable.
- **Retry mechanisms**: Consider retry policies with exponential backoff for transient failures.
- **Health checks**: Enable monitoring and automated recovery, for example by building in health check endpoints.
- **Data backup**: Design systems with automated backup and restore capabilities.

### Validating reliability

Reliability testing ensures the system operates consistently over time and recovers gracefully from failures.

### **MUST** be tested:

- Failure detection and automatic recovery mechanisms.
- Data backup and restore procedures.
- Graceful degradation under component failures.

### **SHOULD** be tested:

- Chaos engineering and fault injection testing.
- Disaster recovery scenarios.
- Data consistency and integrity under failure conditions.

### **MUST** be monitored:

- System uptime and availability.
- Mean time between failures (MTBF) and mean time to recovery (MTTR).

## Security

Security **MUST** be built into the system architecture and design as described in the [Security](./security/index.md) section.

## Usability

### Building for usability

Usability **MUST** be considered in system design and user interface development:

- **Responsive design**: Build interfaces that work across different screen sizes and devices.
- **Accessibility**: Implement accessibility features (ARIA labels, keyboard navigation, screen reader support) to meet WCAG 2.1 AA standards.
- **Progressive enhancement**: Design systems to provide basic functionality that is progressively enhanced with advanced features as the consuming platform allows (for example, websites that are usable without JavaScript but **MAY** lack non-essential features).
- **Error messaging**: Provide clear, actionable error messages that help users understand and resolve issues.
- **Loading states**: Implement appropriate loading indicators and progress feedback for long-running operations.
- **Consistent design**: Use design systems and style guides to ensure consistent user experience across the application.

### Validating usability

Usability testing evaluates how easily users can interact with the system to accomplish their goals, focusing on user experience and accessibility.

#### **MUST** be tested:

- Critical user journeys can be completed by target users.
- Accessibility compliance (WCAG 2.1 AA minimum).
- Mobile responsiveness and touch interactions.
- Error handling and user feedback mechanisms.
- Cross-browser compatibility testing.

#### **SHOULD** be tested:

- User satisfaction and task completion rates.
- Navigation intuitiveness and information architecture.
- Performance on low-specification devices.

## Scalability

### Building for scalability

Systems **MUST** be designed to scale with demand:

- **Horizontal scaling**: Design stateless applications that can be easily scaled by adding more instances.
- **Auto-scaling**: Design systems that can automatically scale based on demand metrics.
- **Load balancing**: Implement load balancing strategies to distribute traffic across multiple instances.
- **Database scaling**: Consider database sharding, read replicas, or partitioning strategies if required, while avoiding unnecessary complexity.
- **Microservices architecture**: Where appropriate, design loosely coupled services that can be scaled independently.
- **Resource optimisation**: Implement efficient algorithms and data structures to minimise resource usage per operation.

### Validating scalability

Scalability testing determines the system's ability to scale up or down based on demand while maintaining acceptable performance levels.

#### **MUST** be tested:

- Horizontal scaling capabilities (adding more instances).
- Database scaling and sharding strategies (if present).
- Auto-scaling configuration and thresholds.
- Resource allocation and optimisation.

### **SHOULD** be tested:

- Vertical scaling limits (adding more power to existing instances).
- Geographical distribution and content delivery networks.
- Microservices scaling independence.
- Cost implications of scaling strategies.
- Performance impact of scaling operations.

## Maintainability

### Building for maintainability

Systems **MUST** be designed for long-term maintainability:

- **Clean code**: Write readable, well-structured code that follows established coding standards and patterns.
- **Documentation**: Include comprehensive inline documentation, API documentation, and architectural decision records.
- **Modular design**: Implement loose coupling and high cohesion principles to make changes easier and safer.
- **Testing**: Build comprehensive automated test suites to enable confident refactoring and changes.
- **Configuration management**: Externalise configuration to enable easy deployment across different environments.
- **Logging and monitoring**: Implement structured logging and monitoring to aid in debugging and performance analysis.

### Validating maintainability

Maintainability is primarily validated through code quality practices and ongoing monitoring as described in the [SDLC](./sdlc.md).

## Compatibility

### Building for compatibility

Systems **MUST** be designed to work across required platforms and integrate with necessary systems:

- **Cross-browser compatibility**: Implement progressive enhancement and test across supported browsers.
- **API versioning**: Design APIs with versioning strategies to maintain backward compatibility.
- **Standards compliance**: Follow relevant web standards.
- **Integration patterns**: Implement robust integration patterns (REST APIs, message queues, webhooks) for third-party systems.
- **Mobile responsiveness**: Design interfaces that work effectively on mobile devices.

### Validating compatibility

Compatibility testing verifies the system works correctly across different environments, platforms, and integration points.

#### **MUST** be tested:

- Supported operating systems and versions.
- Required browser versions and JavaScript compatibility.
- Mobile device compatibility (iOS, Android).
- Integration with mandatory third-party systems.
- API versioning and deprecation handling.

#### **SHOULD** be tested:

- Backward compatibility with previous system versions.
- Cross-platform data format compatibility.
- Legacy system integration requirements.
- Different screen sizes and resolutions.

## Portability

### Building for portability

Systems **MUST** be designed for deployment flexibility:

- **Containerisation**: Consider using containers to ensure consistent deployment across environments.
- **Environment configuration**: Implement the twelve-factor app methodology for environment-specific configuration.
- **Infrastructure as code**: Define infrastructure requirements as code to enable consistent provisioning.
- **Cloud-native design**: Design systems that can leverage cloud platform services while avoiding needless vendor lock-in.

### Validating portability

Portability is primarily validated through deployment and environment testing:

#### **MUST** be tested:

- Deployment across different target environments.
- Configuration management across environments.
- Infrastructure provisioning and teardown processes.

#### **SHOULD** be tested:

- Migration between different cloud providers or platforms.
- Performance consistency across different deployment targets.

## Compliance

### Building for compliance

Systems **MUST** be designed to meet relevant regulatory and organisational requirements:

- **Data protection**: Implement privacy by design principles to support GDPR.
- **Audit requirements**: Build in audit logging and reporting capabilities to meet regulatory requirements.
- **Retention policies**: Implement data retention and deletion policies as required by regulations.

### Validating compliance

Compliance validation ensures systems meet regulatory and organisational requirements:

#### **MUST** be validated:

- Data protection compliance (GDPR, Data Protection Act 2018).
- Audit trail completeness and accuracy.
- Data retention and deletion policy implementation.
- Access control and authorisation mechanisms.

#### **SHOULD** be validated:

- Regulatory reporting capabilities.
- Privacy impact assessments.

## Monitoring

### Building for monitoring

Systems **MUST** be designed with observability from the outset:

- **Application metrics**: Implement business and technical metrics collection using appropriate monitoring tools.
- **Distributed tracing**: In microservices architectures, implement distributed tracing to track requests across services.
- **Log aggregation**: Implement structured logging with centralised log aggregation and analysis.
- **Alerting**: Design alerting strategies that notify operations teams of critical issues without creating alert fatigue.
- **Performance monitoring**: Implement application performance monitoring to identify bottlenecks and optimisation opportunities.

### Validating monitoring

Monitoring capabilities are validated through operational readiness testing:

#### **MUST** be tested:

- Metrics collection and reporting accuracy.
- Alert triggering and escalation procedures.
- Log aggregation and searchability.
- Dashboard functionality and real-time updates.

#### **SHOULD** be tested:

- Monitoring system resilience and failover.
- Performance impact of monitoring on system resources.
- Integration with incident management processes.
