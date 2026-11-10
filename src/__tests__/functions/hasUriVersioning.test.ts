import hasUriVersioning from '../../functions/hasUriVersioning.js';
import type { FunctionResult } from '../__helpers__/vacuum-helper.js';

describe('has-uri-versioning', () => {
  it('passes when the document has no paths', () => {
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning({});
    expect(result).toEqual([]);
  });

  it('passes when every path starts with an exact major version segment', () => {
    const document = {
      paths: {
        '/v1': {},
        '/v1/users': {},
        '/v1/users/{id}': {},
        '/v10/users': {},
      },
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning(document);
    expect(result).toEqual([]);
  });

  it('passes when servers consistently prefix the version', () => {
    const document = {
      servers: [{ url: 'https://api.example.com/product/v1' }],
      paths: {
        '/': {},
        '/users': {},
      },
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning(document);
    expect(result).toEqual([]);
  });

  it('fails for paths without an exact leading major version segment', () => {
    const document = {
      paths: {
        '/users': {},
        '/users/v2': {},
        '/v1beta/users': {},
        '/api/v1/users': {},
      },
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning(document);
    expect(result).toEqual([
      {
        message: 'Path "/users" must start with a major version segment such as "/v1"',
        path: ['paths', '/users'],
      },
      {
        message: 'Path "/users/v2" must start with a major version segment such as "/v1"',
        path: ['paths', '/users/v2'],
      },
      {
        message: 'Path "/v1beta/users" must start with a major version segment such as "/v1"',
        path: ['paths', '/v1beta/users'],
      },
      {
        message: 'Path "/api/v1/users" must start with a major version segment such as "/v1"',
        path: ['paths', '/api/v1/users'],
      },
    ]);
  });

  it('fails when servers are versioned inconsistently', () => {
    const document = {
      servers: [{ url: 'https://api.example.com/v1' }, { url: 'https://api.example.com' }],
      paths: {
        '/users': {},
      },
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning(document);
    expect(result).toEqual([
      {
        message: 'Path "/users" must start with a major version segment such as "/v1"',
        path: ['paths', '/users'],
      },
    ]);
  });

  it('fails when a server URL contains but does not end with a version segment', () => {
    const document = {
      servers: [{ url: 'https://api.example.com/v1/users' }],
      paths: {
        '/users': {},
      },
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning(document);
    expect(result).toEqual([
      {
        message: 'Path "/users" must start with a major version segment such as "/v1"',
        path: ['paths', '/users'],
      },
    ]);
  });
});
