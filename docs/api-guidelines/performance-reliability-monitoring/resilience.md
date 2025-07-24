# Resilience Patterns

## Overview

Resilience patterns are essential for building robust APIs that can gracefully handle unexpected failures or delays in dependent systems. This section provides guidelines for implementing retries, timeouts, circuit breakers, bulkheads, and fallbacks in API design. These patterns **SHOULD** be applied where appropriate to ensure reliability, scalability, and user experience.

## Retries

Retries allow APIs to recover from transient failures.

- APIs **SHOULD** implement retries for [idempotent operations](./api-design.md#http-methods--semantics) (e.g., `GET`, `PUT`, `DELETE`) where a transient failure is likely to succeed on subsequent attempts.
- Retries **SHOULD NOT** be used for [non-idempotent operations](./api-design.md#http-methods--semantics) (e.g., `POST`) unless specifically designed for retry safety.
- A backoff strategy (e.g., [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff) with [jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)) **SHOULD** be used to prevent cascading failures.
- Retries **MUST** be capped with a maximum retry count to avoid infinite loops or unnecessary resource consumption.

``` mermaid
sequenceDiagram
    participant Client
    participant API
    participant Dependency
    
    Client->>API: Request
    activate API
    
    API->>Dependency: Initial Request
    activate Dependency
    Dependency--xAPI: Transient Failure
    deactivate Dependency
    
    Note over API: Apply backoff strategy
    
    API->>Dependency: Retry #1
    activate Dependency
    Dependency--xAPI: Transient Failure
    deactivate Dependency
    
    Note over API: Increase backoff with jitter
    
    API->>Dependency: Retry #2
    activate Dependency
    Dependency-->>API: Success
    deactivate Dependency
    
    API-->>Client: Response
    deactivate API
    
    Note over Client,Dependency: If max retries reached, return error
```

### Example

In the following python example, we show data retrieval from a distributed database service that occasionally experiences network issues and use the [Tenacity](https://tenacity.readthedocs.io/en/latest/) library to handle retries with exponential backoff and jitter. The `@retry` decorator configures the retry behaviour to attempt up to 3 times for transient exceptions only, with exponential backoff starting at 100ms and built-in jitter.

``` python
import logging
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
    retry_if_exception_type,
    before_sleep_log
)

logger = logging.getLogger(__name__)

class TransientException(Exception):
    """Represents a temporary failure that may succeed on retry"""
    pass

class ServiceException(Exception):
    """Represents a permanent failure or failure after retries"""
    pass

@retry(
    retry=retry_if_exception_type(TransientException),
    stop=stop_after_attempt(3),
    wait=wait_random_exponential(multiplier=0.1, max=2),
    before_sleep=before_sleep_log(logger, logging.WARNING),
    reraise=True
)
def get_customer_data(customer_id):
    """
    Retrieve customer data with automatic retry handling for transient failures.
    
    This function will retry up to 2 times (3 attempts total) when transient
    exceptions occur, using exponential backoff with jitter to prevent
    overwhelming the database.
    """
    try:
        return database_service.get_customer(customer_id)
    except TransientException:
        # Will be automatically retried by Tenacity
        raise
    except Exception as e:
        # Convert unexpected exceptions to ServiceException (not retried)
        raise ServiceException(f"Failed to retrieve customer data: {str(e)}") from e
```

## Timeouts

Timeouts prevent operations from hanging indefinitely.

- APIs **SHOULD** define timeouts for all external calls to dependent systems or services.
- Timeout values **SHOULD** be carefully chosen based on the performance characteristics of the dependent system and the API's SLA requirements.
- APIs **SHOULD NOT** rely on default or unspecified timeout settings, as these can vary widely across libraries and tools.
- A timeout **SHOULD** trigger a [fallback](#fallbacks) mechanism or propagate an appropriate [error](./error-handling.md) to the client.

``` mermaid
sequenceDiagram
    participant Client
    participant API
    participant Dependency
    
    Client->>API: Request
    activate API
    
    API->>Dependency: Send Request
    activate Dependency
    Note over API: Start Timeout Timer
    
    alt Response within timeout period
        Dependency-->>API: Timely Response
        API-->>Client: Success Response
    else Timeout occurs
        Note over API: Timeout Threshold Exceeded
        API--xDependency: Cancel Request (if possible)
        deactivate Dependency
        API-->>Client: Timeout Error Response
    end

    deactivate API
```

### Example

In this python example, we set a 5-second timeout for the request to an external API using the [Requests](https://requests.readthedocs.io/en/latest/user/quickstart/#timeouts) library. If the request takes longer than this, a `Timeout` exception is raised, allowing us to handle it gracefully with a [fallback](#fallbacks) mechanism or propagate an appropriate [error](./error-handling.md) to the client.

``` python
import requests
from requests.exceptions import Timeout, RequestException

try:
    # Set a 5-second timeout for the request
    response = requests.get('https://api.example.com/data', timeout=5)
    data = response.json()
except Timeout:
    print("The request timed out")
except RequestException as e:
    print(f"Request error: {e}")
```

## Circuit Breakers

Circuit breakers protect systems from cascading failures by halting requests to unhealthy dependencies.

- Circuit breakers **SHOULD** be implemented for calls to external systems that are critical to the API's operation.
- APIs **SHOULD** configure circuit breakers with thresholds for failure rates and recovery intervals.
- When a circuit breaker is open, the API **MUST** provide a meaningful [error response](./error-handling.md) or [fallback mechanism](#fallbacks).
- Circuit breakers **MUST NOT** be used for internal components that are highly reliable and tightly coupled, as they introduce unnecessary complexity.

### Flowchart Diagram

``` mermaid
flowchart TD
    CLOSED((CLOSED)) -->|Failure threshold exceeded| OPEN((OPEN))
    OPEN -->|Delay| HALF((HALF OPEN))
    HALF -->|Success| CLOSED
    HALF -->|Failure| OPEN
    
    classDef closed fill:#59b259,stroke:#004d00,color:#fff
    classDef open fill:#ff6666,stroke:#800000,color:#fff
    classDef half fill:#ffcc00,stroke:#cc8800,color:#000
    
    class CLOSED closed
    class OPEN open
    class HALF half
```

### Sequence Diagram

``` mermaid
sequenceDiagram
    participant Client
    participant API with Circuit Breaker
    participant Dependency
    
    Note over API with Circuit Breaker: Circuit State: CLOSED
    
    Client->>API with Circuit Breaker: Request 1
    activate API with Circuit Breaker
    API with Circuit Breaker->>Dependency: Forward Request
    activate Dependency
    Dependency-->>API with Circuit Breaker: Success Response
    deactivate Dependency
    API with Circuit Breaker-->>Client: Response
    deactivate API with Circuit Breaker
    
    Client->>API with Circuit Breaker: Request 2
    activate API with Circuit Breaker
    API with Circuit Breaker->>Dependency: Forward Request
    activate Dependency
    Dependency--xAPI with Circuit Breaker: Failure
    deactivate Dependency
    API with Circuit Breaker-->>Client: Error Response
    deactivate API with Circuit Breaker
    
    Client->>API with Circuit Breaker: Request 3
    activate API with Circuit Breaker
    API with Circuit Breaker->>Dependency: Forward Request
    activate Dependency
    Dependency--xAPI with Circuit Breaker: Failure
    deactivate Dependency
    API with Circuit Breaker-->>Client: Error Response
    deactivate API with Circuit Breaker
    
    Note over API with Circuit Breaker: Failure threshold exceeded
    Note over API with Circuit Breaker: Circuit State: OPEN
    
    Client->>API with Circuit Breaker: Request 4
    activate API with Circuit Breaker
    Note over API with Circuit Breaker: Request rejected without calling dependency
    API with Circuit Breaker-->>Client: Circuit Open Error
    deactivate API with Circuit Breaker
    
    Note over API with Circuit Breaker: After timeout period
    Note over API with Circuit Breaker: Circuit State: HALF-OPEN
    
    Client->>API with Circuit Breaker: Request 5
    activate API with Circuit Breaker
    API with Circuit Breaker->>Dependency: Test Request
    activate Dependency
    Dependency-->>API with Circuit Breaker: Success Response
    deactivate Dependency
    API with Circuit Breaker-->>Client: Response
    deactivate API with Circuit Breaker
    
    Note over API with Circuit Breaker: Circuit State: CLOSED
```

### Example

In this python example, we use the [circuitbreaker](https://pypi.org/project/circuitbreaker/) library to protect calls to a recommendation service. The circuit breaker is configured to open after 3 failures out of 5 attempts (60% failure rate) and will stay open for 30 seconds before allowing a test request. When the circuit is open, we [fallback](#fallbacks) to a cache of popular products instead of personalised recommendations.

``` python
import logging
from circuitbreaker import circuit, CircuitBreakerError

logger = logging.getLogger(__name__)

# Configure the circuit breaker:
# - fails when 3 out of 5 attempts fail (60% failure rate)
# - resets after 30 seconds in open state
@circuit(failure_threshold=3, recovery_timeout=30, expected_exception=Exception)
def get_product_recommendations(user_id):
    """
    Retrieve product recommendations from the recommendation service.
    
    This function is protected by a circuit breaker that will open after
    3 failures out of 5 attempts, preventing further calls to the potentially
    failing service for 30 seconds.
    """
    try:
        return recommendation_service.get_recommendations(user_id)
    except Exception as e:
        logger.error(f"Recommendation service error: {str(e)}")
        raise  # The circuit breaker will catch this

def get_recommendations_with_fallback(user_id):
    """
    Get product recommendations with circuit breaker protection and fallback.
    """
    try:
        # This call is protected by the circuit breaker decorator
        return get_product_recommendations(user_id)
    except CircuitBreakerError:
        logger.warning(f"Circuit breaker open, using fallback for user {user_id}")
        # Fallback to a simpler recommendation strategy
        return get_fallback_recommendations(user_id)
    except Exception as e:
        logger.error(f"Unexpected error in recommendations: {str(e)}")
        return []

def get_fallback_recommendations(user_id):
    """
    Provides a fallback when the recommendation service is unavailable.
    Returns popular products instead of personalised recommendations.
    """
    return popular_products_cache.get_popular_items(5)
```

## Bulkheads

Bulkheads isolate failures to prevent them from impacting the entire system.

- APIs **SHOULD** use bulkheads to limit the impact of resource exhaustion (e.g., thread pools, connection pools) caused by a specific dependency or client.
- Bulkheads **MUST** be configured to allocate capacity proportionate to the criticality of the resource or operation.
- APIs **MUST NOT** allow a single poorly performing client or dependency to consume all available resources, degrading the experience for others.

### Examples

In an e-commerce platform, the payment service, user service, and search service can be isolated using bulkheads. If the search service experiences high traffic or failure, the payment and user services remain unaffected, ensuring critical operations like checkout continue to function.

#### Without Bulkhead Pattern

When `Search` service fails, it consumes all available resources in the shared pool, causing `Payment` and `User` services to suffer as well.

``` mermaid
graph TD
    Client[Client Requests] --> API[API Gateway]
    
    API --> Pool[Shared Thread Pool]
    
    Pool --> Service1[Payment Service]
    Pool --> Service2[User Service]
    Pool --> Service3[Search Service]
    
    Service3 -. "Failure/Overload" .-> Pool
    Pool -. "Resources Exhausted" .-> Service1
    Pool -. "Resources Exhausted" .-> Service2
    
    subgraph "Without Bulkhead Pattern"
        Pool
    end
    
    classDef overloaded fill:#FF6347,stroke:#8B0000;
    class Pool,Service1,Service2,Service3 overloaded
    
    %% Note: When Search Service fails,
    %% it consumes all available resources in the shared pool,
    %% causing Payment and User services to suffer as well
```

#### With Bulkhead Pattern

Even though `Search` service has failed, `Payment` and `User` services continue to function, because resources are isolated with bulkheads.

``` mermaid
graph TD
    Client[Client Requests] --> API[API Gateway]
    
    API --> Pool1[Thread Pool 1]
    API --> Pool2[Thread Pool 2]
    API --> Pool3[Thread Pool 3]
    
    Pool1 --> Service1[Payment Service]
    Pool2 --> Service2[User Service]
    Pool3 --> Service3[Search Service]
    
    Service3 -. "Failure/Overload" .-> Pool3
    
    subgraph "Bulkhead Pattern"
        Pool1
        Pool2
        Pool3
    end
    

    classDef failed fill:#FF6347,stroke:#8B0000;
    class Service3,Pool3 failed

    
    %% Note: Even though Search Service has failed,
    %% Payment and User services continue to function
    %% because resources are isolated with bulkheads
```

#### Python Example

In this Python example, we implement the bulkhead pattern using `ThreadPoolExecutor` from the `concurrent.futures` module. The code creates separate thread pools for critical and non-critical operations, preventing failures in one service from consuming resources needed by others.

``` python
import asyncio
from concurrent.futures import ThreadPoolExecutor
from functools import partial

class ServiceExecutors:
    def __init__(self):
        # Dedicated pool for critical operations
        self.critical_pool = ThreadPoolExecutor(
            max_workers=4,
            thread_name_prefix="critical"
        )
        # Pool for non-critical operations
        self.normal_pool = ThreadPoolExecutor(
            max_workers=10,
            thread_name_prefix="normal"
        )

    async def execute_critical(self, func, *args):
        return await asyncio.get_event_loop().run_in_executor(
            self.critical_pool,
            partial(func, *args)
        )

    async def execute_normal(self, func, *args):
        return await asyncio.get_event_loop().run_in_executor(
            self.normal_pool,
            partial(func, *args)
        )
```

Usage example:

``` python
executors = ServiceExecutors()

# Payment processing - uses the critical pool (4 threads max)
async def process_payment(payment_id):
    return await executors.execute_critical(payment_service.process, payment_id)

# Product search - uses the normal pool (10 threads max)
async def search_products(query):
    return await executors.execute_normal(search_service.find, query)

# Even if search_products overloads its thread pool,
# payment processing remains unaffected
```

This implementation demonstrates how:

- Critical operations like payments get dedicated resources (4 threads)
- Non-critical operations like search get separate resources (10 threads)
- If the search service becomes overloaded, payment processing continues normally
- Each service has its failure domain contained within its own thread pool

## Fallbacks

Fallbacks provide alternative behaviour when a dependency fails.

- APIs **MUST** implement fallbacks for critical operations where failure would significantly impact the user experience.
- Fallbacks **SHOULD** provide meaningful degraded functionality (e.g., cached data, placeholder values) rather than returning generic errors.
- APIs **MUST NOT** use fallbacks that violate business logic, security, or data integrity requirements.
- Where fallbacks are implemented, the API **SHOULD** log the use of fallback mechanisms for [monitoring](./monitoring.md) and debugging purposes.

### Example

If a weather API fails, the fallback could provide cached weather data from the last successful response. For a stock price API, a fallback might return the last known price or a default value.

``` python
import requests

# Simulate a cache (in a real app, this would be persistent storage)
weather_cache = {
    "London": {"temperature": 15, "condition": "Cloudy"},
    "New York": {"temperature": 20, "condition": "Sunny"}
}

def get_weather(city):
    """Get weather data with fallback to cache if API fails"""
    try:
        # Try to get fresh data from the API
        response = requests.get(
            f"https://api.weather.example.com/current?city={city}",
            timeout=2
        )
        response.raise_for_status()
        return response.json()
    
    except Exception:
        # API call failed, use fallback
        print(f"Weather API failed. Using cached data for {city}")
        
        # Return cached data if available, or a default
        if city in weather_cache:
            return weather_cache[city]
        else:
            return {"temperature": None, "condition": "Unknown"}

# Example usage
weather = get_weather("London")
print(f"Weather: {weather['temperature']}°C, {weather['condition']}")
```

## General Guidance

- Resilience patterns **MUST** be chosen based on the specific context and requirements of the API.
- Combinations of patterns **SHOULD** be used to address complex failure scenarios (e.g., retries with timeouts and circuit breakers).
- APIs **MUST** log and [monitor](./monitoring.md) resilience events (e.g., retries, circuit breaker state changes) to enable proactive troubleshooting and optimisation.
- Overuse or misuse of resilience patterns **MUST NOT** degrade overall performance or introduce unnecessary latency.
