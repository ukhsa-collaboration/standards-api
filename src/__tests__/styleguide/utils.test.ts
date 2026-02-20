import { asResults, getLocation, safeChild } from '../../redocly/assertions/utils';

describe('assertion utils', () => {
  it('getLocation returns ctx.location when present', () => {
    const location = { line: 1 };
    expect(getLocation({ location })).toBe(location);
  });

  it('getLocation falls back to ctx when location is missing', () => {
    const ctx = { other: true };
    expect(getLocation(ctx)).toBe(ctx);
  });

  it('asResults prefers issue location when provided', () => {
    const baseLocation = { line: 2 } as any;
    const issueLocation = { line: 3 } as any;
    const results = asResults([{ message: 'msg', location: issueLocation }], baseLocation);
    expect(results[0].location).toBe(issueLocation);
  });

  it('asResults falls back to base location when issue location missing', () => {
    const baseLocation = { line: 2 } as any;
    const results = asResults([{ message: 'msg' }], baseLocation);
    expect(results[0].location).toBe(baseLocation);
  });

  it('safeChild returns child location when available', () => {
    const child = { line: 4 };
    const location = {
      child: () => child,
    };
    expect(safeChild(location, 'a')).toBe(child);
  });

  it('safeChild returns original location when child is unavailable', () => {
    const location = { line: 5 };
    expect(safeChild(location, 'a')).toBe(location);
  });
});
