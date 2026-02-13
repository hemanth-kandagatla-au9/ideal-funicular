describe('Configuration Validation', () => {
  it('should have environment variables set in test', () => {
    expect(process.env.REACT_APP_CLIENTID).toBe('test-client-id');
    expect(process.env.REACT_APP_AUTHORITY_URL).toBeDefined();
    expect(process.env.STAR_API_URL).toBeDefined();
  });

  it('should have webpack globals mocked', () => {
    expect(typeof (global as any).__webpack_init_sharing__).toBe('function');
    expect((global as any).__webpack_share_scopes__).toBeDefined();
  });

  it('should have MSAL globals mocked', () => {
    expect((global as any).__POWERED_BY_IASPHERE__).toBe(true);
    expect((global as any).__HOST_APP__).toBe(true);
    expect(typeof (global as any).__HOST_GET_TOKEN__).toBe('function');
  });

  it('should have sessionStorage mocked', () => {
    sessionStorage.setItem('test', 'value');
    expect(sessionStorage.getItem('test')).toBe('value');
    sessionStorage.clear();
    expect(sessionStorage.getItem('test')).toBeNull();
  });

  it('should have localStorage mocked', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    localStorage.clear();
    expect(localStorage.getItem('test')).toBeNull();
  });
});
