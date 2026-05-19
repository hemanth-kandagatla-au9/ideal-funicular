import { shouldHideHeader } from '../layoutUtils';

describe('shouldHideHeader', () => {
  it('should return true for specific hidden routes', () => {
    expect(shouldHideHeader('/app/workflow/myspace-add')).toBe(true);
    expect(shouldHideHeader('/app/workflow/helpcontent')).toBe(true);
  });

  it('should return false for capability root paths', () => {
    expect(shouldHideHeader('/app/workflow/capability')).toBe(false);
    expect(shouldHideHeader('/app/workflow/capability/')).toBe(false);
  });

  it('should return true for capability child routes', () => {
    expect(shouldHideHeader('/app/workflow/capability/123')).toBe(true);
    expect(shouldHideHeader('/app/workflow/capability/abc')).toBe(true);
  });

  it('should return false for all other routes', () => {
    expect(shouldHideHeader('/app/workflow/dashboard')).toBe(false);
    expect(shouldHideHeader('/random/path')).toBe(false);
  });
});
