import type { RulesetFunctionContext } from '@stoplight/spectral-core';
import hasValidLeadingCapability from '../../functions/hasValidLeadingCapability.js';

const createContext = (path: (string | number)[]): RulesetFunctionContext =>
  ({
    document: {} as any,
    documentInventory: {} as any,
    rule: {} as any,
    path,
  }) as unknown as RulesetFunctionContext;

describe('hasValidLeadingCapability', () => {
  it('returns no results when the capability exists in the controlled list', () => {
    const context = createContext(['info', 'x-leading-capability']);
    const result = hasValidLeadingCapability('Advice Management', {}, context);

    expect(result).toEqual([]);
  });

  it('returns an error when the capability is not recognised', () => {
    const context = createContext(['info', 'x-leading-capability']);
    const result = hasValidLeadingCapability('Unknown Capability', {}, context);

    expect(result).toEqual([
      {
        message:
          "Missing or wrong 'info.x-leading-capability', should be a valid UKHSA Business Capability.",
        path: ['info', 'x-leading-capability'],
      },
    ]);
  });

  it('returns an error when the value is not a string', () => {
    const context = createContext(['info', 'x-leading-capability']);
    const result = hasValidLeadingCapability(undefined, {}, context);

    expect(result).toEqual([
      {
        message: '`x-leading-capability` must be a string.',
        path: ['info', 'x-leading-capability'],
      },
    ]);
  });
});
