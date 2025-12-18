import pluginFactory from '../../redocly/plugin';

const plugin = pluginFactory();

const makeLoc = (label = 'loc') => ({
  label,
  child(key: any) {
    const next = Array.isArray(key) ? key.join('.') : key;
    return makeLoc(`${this.label}.${next}`);
  },
});

describe('plugin assertions', () => {
  it('objectSchema flags non-object and map schemas', () => {
    const schema = { type: 'string', additionalProperties: true };
    const results = plugin.assertions.objectSchema(schema, {}, makeLoc('schema'));
    expect(results.map((r) => r.message)).toEqual(
      expect.arrayContaining(['Schema type is not `object`', 'Schema is a map'])
    );
  });

  it('objectSchema short-circuits on $ref and recurses anyOf', () => {
    const refResult = plugin.assertions.objectSchema({ $ref: '#/t' }, {}, makeLoc('ref'));
    expect(refResult).toHaveLength(0);

    const recurseResult = plugin.assertions.objectSchema(
      { anyOf: [{ type: 'string' }] },
      {},
      makeLoc('recurse')
    );
    expect(recurseResult[0].message).toContain('Schema type is not `object`');
  });

  it('objectSchema passes when already an object', () => {
    const result = plugin.assertions.objectSchema(
      { type: 'object', properties: {} },
      {},
      makeLoc('objectOk')
    );
    expect(result).toHaveLength(0);
  });

  it('problemJsonSchema recurses through anyOf', () => {
    const schema = { anyOf: [{ type: 'string' }] };
    const results = plugin.assertions.problemJsonSchema(schema, {}, makeLoc('problem'));
    expect(results[0].message).toContain("Problem json must have type 'object'");
  });

  it('problemJsonSchema passes when valid', () => {
    const schema = {
      type: 'object',
      properties: {
        type: { type: 'string', format: 'uri-reference' },
        title: { type: 'string' },
        status: { type: 'integer', format: 'int32' },
        detail: { type: 'string' },
        instance: { type: 'string' },
      },
    };
    expect(plugin.assertions.problemJsonSchema(schema, {}, makeLoc('problemOk'))).toHaveLength(0);
  });

  it('apiInfoSchema validates required properties', () => {
    const schema = { type: 'array', properties: {} };
    const results = plugin.assertions.apiInfoSchema(schema, {}, makeLoc('info'));
    const messages = results.map((r) => r.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        "ApiInfo json must have type 'object'",
        "ApiInfo json must have property 'name' with type 'string' and format 'uri-reference'",
        "ApiInfo json must have property 'version' with type 'string' and pattern for semver.",
        'ApiInfo json must have property \'status\' with x-extensible-enum values: ALPHA, BETA, DEPRECATED, LIVE.',
        "ApiInfo json must have property 'releaseDate' with type 'string' and format 'date'",
        "ApiInfo json must have property 'documentation' with type 'string' and format 'uri'",
        "ApiInfo json must have property 'releaseNotes' with type 'string' and format 'uri'",
      ])
    );
  });

  it('apiInfoSchema recurses anyOf and checks status enum completeness', () => {
    const recurse = plugin.assertions.apiInfoSchema(
      { anyOf: [{ type: 'string' }] },
      {},
      makeLoc('apiInfo')
    );
    expect(recurse[0].message).toContain('ApiInfo json must have type \'object\'');

    const statusPartial = plugin.assertions.apiInfoSchema(
      {
        type: 'object',
        properties: {
          name: { type: 'string' },
          version: { type: 'string', pattern: '' },
          status: { type: 'string', 'x-extensible-enum': ['ALPHA'] },
          releaseDate: { type: 'string', format: 'date' },
          documentation: { type: 'string', format: 'uri' },
          releaseNotes: { type: 'string', format: 'uri' },
        },
      },
      {},
      makeLoc('apiInfoStatus')
    );
    expect(statusPartial.find((r) => r.message.includes('x-extensible-enum values'))).toBeTruthy();
  });

  it('apiInfoSchema passes when fully valid', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: {
          type: 'string',
          pattern:
            '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
        },
        status: { type: 'string', 'x-extensible-enum': ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED'] },
        releaseDate: { type: 'string', format: 'date' },
        documentation: { type: 'string', format: 'uri' },
        releaseNotes: { type: 'string', format: 'uri' },
      },
    };
    expect(plugin.assertions.apiInfoSchema(schema, {}, makeLoc('apiInfoOk'))).toHaveLength(0);
  });

  it('countResourceTypes warns when max is exceeded', () => {
    const paths = { '/a': {}, '/b': {}, '/c': {} };
    const [result] = plugin.assertions.countResourceTypes(paths, { max: 2 }, makeLoc('paths'));
    expect(result.message).toContain('More than 2 resource types found');
  });

  it('forbidEnum warns when enum is present', () => {
    const [result] = plugin.assertions.forbidEnum(['ONE'], {}, makeLoc('enum'));
    expect(result.message).toBe('Should use x-extensible-enum instead of enum');
  });

  it('infoApiType validates allowed values', () => {
    const missing = plugin.assertions.infoApiType(undefined, {}, makeLoc('info'));
    const invalid = plugin.assertions.infoApiType('legacy', {}, makeLoc('info'));
    expect(missing[0].message).toContain('Missing or wrong');
    expect(invalid[0].message).toContain('Valid values: standard, pygeoapi.');
  });

  it('infoContainsSensitiveData requires boolean', () => {
    const [result] = plugin.assertions.infoContainsSensitiveData('yes', {}, makeLoc('info'));
    expect(result.message).toContain('should be \'boolean\'');
  });

  it('locationHeader validates description, type, and example', () => {
    const headers = { Location: { schema: { type: 'integer' } } };
    const messages = plugin.assertions.locationHeader(headers, {}, makeLoc('headers')).map(
      (r) => r.message
    );
    expect(messages).toEqual(
      expect.arrayContaining([
        'Location header should include a description',
        'Location header schema should be a string with uri format',
        'Location header schema should include an example',
      ])
    );
  });

  it('locationHeader reports missing Location header without child-aware location', () => {
    const [result] = plugin.assertions.locationHeader({}, {}, {} as any);
    expect(result.message).toContain('201 responses SHOULD define a Location header');
  });

  it('locationHeader handles missing baseLocation child gracefully', () => {
    const [result] = plugin.assertions.locationHeader(
      { Location: { schema: {} } },
      {},
      undefined as any
    );
    expect(result.message).toContain('Location header should include a description');
  });

  it('locationHeader falls back when schema is missing', () => {
    const messages = plugin.assertions
      .locationHeader({ Location: { description: 'desc' } }, {}, makeLoc('headersNoSchema'))
      .map((r) => r.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        'Location header schema should be a string with uri format',
        'Location header schema should include an example',
      ])
    );
  });

  it('locationHeader passes when valid', () => {
    const headers = {
      Location: {
        description: 'resource',
        schema: { type: 'string', format: 'uri', example: 'http://example.com' },
      },
    };
    expect(plugin.assertions.locationHeader(headers, {}, makeLoc('headersOk'))).toHaveLength(0);
  });

  it('skips validation when assertion inputs are not objects', () => {
    expect(plugin.assertions.objectSchema(undefined, {}, makeLoc())).toHaveLength(0);
    expect(plugin.assertions.problemJsonSchema('oops', {}, makeLoc())).toHaveLength(0);
    expect(plugin.assertions.apiInfoSchema(null, {}, makeLoc())).toHaveLength(0);
    expect(plugin.assertions.countResourceTypes({ '/a': {} }, {}, makeLoc())).toHaveLength(0);
    expect(plugin.assertions.countResourceTypes(['a'], { max: 1 }, makeLoc())).toHaveLength(0);
    expect(plugin.assertions.countResourceTypes({ '/a': {} }, { max: 5 }, makeLoc())).toHaveLength(
      0
    );
    expect(plugin.assertions.countResourceTypes({ '/a': {} }, undefined, makeLoc())).toHaveLength(
      0
    );
    expect(plugin.assertions.forbidEnum(undefined, {}, makeLoc())).toHaveLength(0);
    expect(plugin.assertions.locationHeader(undefined, {}, makeLoc())).toHaveLength(0);
  });

  it('countResourceTypes returns when resource type count stays within max', () => {
    const paths = {
      '/a/1': {},
      '/a/2': {},
      '/a/3': {},
      '/a/4': {},
      '/a/5': {},
    };
    const results = plugin.assertions.countResourceTypes(paths, { max: 2 }, makeLoc('paths'));
    expect(results).toHaveLength(0);
  });

  it('countResourceTypes treats identical resource types as within max', () => {
    const paths = {
      'a/one': {},
      '/a/two': {},
      '/a/three': {},
      '/b': {},
    };
    const results = plugin.assertions.countResourceTypes(paths, { max: 3 }, makeLoc('paths'));
    expect(results).toHaveLength(0);
  });
});

describe('plugin rules', () => {
  const runRule = (rule: any, operation: any, root: any = {}) => {
    const reports: any[] = [];
    const ctx = {
      key: 'get',
      location: makeLoc('op'),
      report: (r: any) => reports.push(r),
    };
    if (rule.Root) {
      rule.Root(root);
    }
    if (rule.Operation) {
      rule.Operation(operation, ctx);
    }
    return reports;
  };

  it('required-problem-responses-critical reports missing response, content, and examples', () => {
    const rule = plugin.rules.oas3['required-problem-responses-critical']();
    const reports = runRule(rule, {
      responses: {
        '400': {
          content: {
            'application/problem+json': {
              schema: { type: 'object' },
              examples: {},
            },
          },
        },
      },
    });

    const messages = reports.map((r) => r.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining('400 (missing example)'),
        expect.stringContaining('404 (missing response)'),
        expect.stringContaining('500 (missing response)'),
      ])
    );
  });

  it('required-problem-responses-critical reports missing content types', () => {
    const rule = plugin.rules.oas3['required-problem-responses-critical']();
    const reports = runRule(rule, {
      responses: {
        '400': { description: 'bad' },
        '404': { description: 'bad' },
        '500': { description: 'bad' },
      },
    });

    expect(reports.find((r) => r.message.includes('missing application/problem+json'))).toBeTruthy();
  });

  it('required-problem-responses-critical passes when content and examples present', () => {
    const rule = plugin.rules.oas3['required-problem-responses-critical']();
    const reports = runRule(rule, {
      responses: {
        '400': {
          content: {
            'application/problem+json': { schema: {}, examples: { ex: {} } },
          },
        },
        '404': {
          content: {
            'application/problem+json': { schema: {}, examples: { ex: {} } },
          },
        },
        '500': {
          content: {
            'application/problem+json': { schema: {}, examples: { ex: {} } },
          },
        },
      },
    });
    expect(reports).toHaveLength(0);
  });

  it('required-problem-responses-security does nothing when security disabled', () => {
    const rule = plugin.rules.oas3['required-problem-responses-security']();
    const reports = runRule(
      rule,
      { responses: {}, security: [] },
      {
        security: undefined,
      }
    );
    expect(reports).toHaveLength(0);
  });

  it('required-problem-responses-security triggers when global security is enabled', () => {
    const rule = plugin.rules.oas3['required-problem-responses-security']();
    const reports = runRule(
      rule,
      { responses: {} },
      {
        security: [{}],
      }
    );

    expect(reports[0].message).toContain('401, 403');
  });

  it('required-problem-responses-security handles per-operation security disable with global security set', () => {
    const rule = plugin.rules.oas3['required-problem-responses-security']();
    const reports = runRule(
      rule,
      { security: [] },
      {
        security: [{}],
      }
    );

    expect(reports).toHaveLength(0);
  });

  it('no-get-request-body reports on GET request bodies', () => {
    const rule = plugin.rules.oas3['no-get-request-body']();
    const reports = runRule(rule, { requestBody: {} });
    expect(reports[0].message).toContain('MUST NOT accept a request body.');
  });

  it('no-get-request-body ignores other methods', () => {
    const reports: any[] = [];
    const ctx = {
      key: 'post',
      location: makeLoc('op'),
      report: (r: any) => reports.push(r),
    };
    const rule = plugin.rules.oas3['no-get-request-body']();
    rule.Operation({ requestBody: {} }, ctx);
    expect(reports).toHaveLength(0);
  });
});
