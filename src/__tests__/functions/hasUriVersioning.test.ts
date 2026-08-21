import hasUriVersioning from '../../functions/hasUriVersioning.js';
import type { FunctionResult } from '../__helpers__/vacuum-helper.js';

describe('has-uri-versioning', () => {
  it('passes when the document has no paths', () => {
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning({});
    expect(result).toEqual([]);
  });

  it('passes when every path contains a version segment', () => {
    const document = {
      paths: {
        '/v1/users': {},
        '/v1/users/{id}': {},
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

  it('fails for paths without a version segment and no versioned servers', () => {
    const document = {
      paths: {
        '/users': {},
        '/users/v2': {},
      },
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = hasUriVersioning(document);
    expect(result).toEqual([
      { message: 'Path must use URI versioning', path: ['paths', '/users'] },
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
      { message: 'Path must use URI versioning', path: ['paths', '/users'] },
    ]);
  });
});
