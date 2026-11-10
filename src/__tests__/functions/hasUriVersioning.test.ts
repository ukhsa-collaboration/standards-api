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

  it('passes when all paths use the same prefix before the version', () => {
    const document = {
      paths: {
        '/api/v1/users': {},
        '/api/v1/projects': {},
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
      },
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning(document);
    expect(result).toEqual([
      {
        message: 'Path "/users" must place an exact major version before the resource and use the same base prefix as every other path',
        path: ['paths', '/users'],
      },
      {
        message: 'Path "/users/v2" must place an exact major version before the resource and use the same base prefix as every other path',
        path: ['paths', '/users/v2'],
      },
      {
        message: 'Path "/v1beta/users" must place an exact major version before the resource and use the same base prefix as every other path',
        path: ['paths', '/v1beta/users'],
      },
    ]);
  });

  it('fails when paths use different prefixes before the version', () => {
    const document = {
      paths: {
        '/api/v1/x': {},
        '/other/v1/y': {},
      },
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning(document);
    expect(result).toEqual([
      {
        message: 'Path "/other/v1/y" must place an exact major version before the resource and use the same base prefix as every other path',
        path: ['paths', '/other/v1/y'],
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
        message: 'Path "/users" must place an exact major version before the resource and use the same base prefix as every other path',
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
        message: 'Path "/users" must place an exact major version before the resource and use the same base prefix as every other path',
        path: ['paths', '/users'],
      },
    ]);
  });
});
