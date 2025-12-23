import { lintDocument } from '../__helpers__/redocly-helper';

describe('ukhsa/must-not-define-request-body-for-get-requests', () => {
  it('flags GET request bodies as errors', async () => {
    const spec = `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /things:
    get:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
      responses:
        "200":
          description: ok
`;

    const results = await lintDocument(spec, ['ukhsa/must-not-define-request-body-for-get-requests']);
    expect(results[0]).toMatchObject({
      ruleId: 'ukhsa/must-not-define-request-body-for-get-requests',
      severity: 'error',
    });
  });
});

describe('ukhsa/must-define-critical-problem-responses', () => {
  it('warns when required error responses are missing', async () => {
    const spec = `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    post:
      responses:
        "201":
          description: created
`;

    const results = await lintDocument(spec, ['ukhsa/must-define-critical-problem-responses']);
    expect(results[0]).toMatchObject({
      ruleId: 'ukhsa/must-define-critical-problem-responses',
      severity: 'warn',
    });
    expect(results[0].message).toContain('400, 404, 500');
  });

  it('supports referenced responses with examples', async () => {
    const spec = `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    post:
      responses:
        "400":
          $ref: '#/components/responses/BadRequest'
        "404":
          description: not found
          content:
            application/problem+json:
              examples:
                not-found:
                  value:
                    title: Not Found
        "500":
          description: server error
          content:
            application/problem+json:
              examples:
                server-error:
                  value:
                    title: Server Error
components:
  schemas:
    ProblemDetails:
      type: object
      properties:
        title:
          type: string
  responses:
    BadRequest:
      description: bad request
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'
          examples:
            validation-error:
              value:
                title: Bad Request
`;

    const results = await lintDocument(spec, ['ukhsa/must-define-critical-problem-responses']);
    expect(results).toHaveLength(0);
  });
});

describe('rule/must-use-valid-problem-json-schema', () => {
  it('errors when problem schema is incomplete', async () => {
    const spec = `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        "500":
          description: error
          content:
            application/problem+json:
              schema:
                type: object
                properties:
                  title:
                    type: string
`;

    const results = await lintDocument(spec, ['rule/must-use-valid-problem-json-schema']);
    expect(results[0]).toMatchObject({
      ruleId: 'rule/must-use-valid-problem-json-schema',
      severity: 'error',
    });
  });
});
