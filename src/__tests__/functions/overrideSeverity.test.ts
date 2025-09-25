import type { RulesetFunctionContext } from '@stoplight/spectral-core';
import { DiagnosticSeverity } from '@stoplight/types';
import overrideSeverity from '../../functions/overrideSeverity.js';

type RulesetFunctionContextLike = RulesetFunctionContext | {
  rule: {
    owner: {
      rules: Record<string, any>;
    };
  };
};

const createContext = (rules: Record<string, any>): RulesetFunctionContextLike => ({
  rule: {
    owner: {
      rules,
    },
  },
});

describe('overrideSeverity target option', () => {
  it('downgrades severities when a JSONPath selector matches', () => {
    const rules = {
      'demo-rule': {
        severity: DiagnosticSeverity.Error,
        message: 'Original message',
      },
    };

    const context = createContext(rules);
    const targetValue = {
      metadata: {
        'x-api-type': 'pygeoapi',
      },
    };

    overrideSeverity(targetValue, {
      value: 'pygeoapi',
      target: '$.metadata["x-api-type"]',
      rulesToAdjust: {
        'demo-rule': 'warn',
      },
    }, context as unknown as any);

    expect(rules['demo-rule'].severity).toBe('warn');
    expect(rules['demo-rule'].message).toContain('Severity has been downgraded from `error`');
    expect(rules['demo-rule'].message).toContain('`metadata.x-api-type`');
  });

  it('leaves severities unchanged when the selector does not match', () => {
    const rules = {
      'demo-rule': {
        severity: DiagnosticSeverity.Error,
        message: 'Original message',
      },
    };

    const context = createContext(rules);

    overrideSeverity({
      metadata: {
        'x-api-type': 'standard',
      },
    }, {
      value: 'pygeoapi',
      target: '$.metadata["x-api-type"]',
      rulesToAdjust: {
        'demo-rule': 'warn',
      },
    }, context as unknown as any);

    expect(rules['demo-rule'].severity).toBe(DiagnosticSeverity.Error);
    expect(rules['demo-rule'].message).toBe('Original message');
  });

  it('supports @key selectors when matching the configured value', () => {
    const rules = {
      'demo-rule': {
        severity: DiagnosticSeverity.Error,
        message: 'Initial',
      },
    };

    const context = createContext(rules);

    overrideSeverity({
      pygeoapi: true,
      standard: true,
    }, {
      value: 'pygeoapi',
      target: '@key',
      rulesToAdjust: {
        'demo-rule': 'warn',
      },
    }, context as unknown as any);

    expect(rules['demo-rule'].severity).toBe('warn');
    expect(rules['demo-rule'].message).toContain('due to `pygeoapi` of `pygeoapi`');
  });

  it('leaves severity untouched when JSONPath matches nothing', () => {
    const rules = {
      'demo-rule': {
        severity: DiagnosticSeverity.Warning,
        message: 'Stable message.',
      },
    };

    const context = createContext(rules);

    overrideSeverity({
      metadata: {},
    }, {
      value: 'pygeoapi',
      target: '$.metadata["x-api-type"]',
      rulesToAdjust: {
        'demo-rule': 'warn',
      },
    }, context as unknown as any);

    expect(rules['demo-rule'].severity).toBe(DiagnosticSeverity.Warning);
    expect(rules['demo-rule'].message).toBe('Stable message.');
  });

  it('handles numeric severity values and non-string messages', () => {
    const rules = {
      'demo-rule': {
        severity: DiagnosticSeverity.Error,
        message: null,
      },
    };

    const context = createContext(rules);

    overrideSeverity({
      info: {
        'x-api-type': 'pygeoapi',
      },
    }, {
      value: 'pygeoapi',
      target: 'info.x-api-type',
      rulesToAdjust: {
        'demo-rule': 'warn',
      },
    }, context as unknown as any);

    expect(rules['demo-rule'].severity).toBe('warn');
    expect(rules['demo-rule'].message).toBe('Severity has been downgraded from `error` due to `info.x-api-type` of `pygeoapi`');
  });

  it('falls back to a generic label when target selector is empty', () => {
    const rules = {
      'demo-rule': {
        severity: DiagnosticSeverity.Error,
        message: 'Primitive override',
      },
    };

    const context = createContext(rules);

    expect(() => overrideSeverity('pygeoapi', {
      value: 'pygeoapi',
      target: '',
      rulesToAdjust: {
        'demo-rule': 'warn',
      },
    }, context as unknown as any)).toThrow('overrideSeverity requires a non-empty target selector');

    expect(rules['demo-rule'].severity).toBe(DiagnosticSeverity.Error);
    expect(rules['demo-rule'].message).toBe('Primitive override');
  });
});
