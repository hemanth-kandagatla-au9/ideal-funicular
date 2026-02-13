import dashboardReducer, {
  setActiveTab,
  setSearchTerm,
  setApiCallTracking,
  setAllScriptOptions,
  setCapabilityVersionNumber,
} from '../dashboardSlice';

describe('dashboardSlice', () => {
  const initialState = {
    activeTab: 'All',
    searchTerm: '',
    apiCallTracking: {},
    allScriptOptions: [],
    capabilityVersionNumber: '',
  };

  it('should return the initial state', () => {
    expect(dashboardReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setActiveTab', () => {
    const actual = dashboardReducer(initialState, setActiveTab('Favorites'));
    expect(actual.activeTab).toEqual('Favorites');
  });

  it('should handle setSearchTerm', () => {
    const actual = dashboardReducer(initialState, setSearchTerm('test search'));
    expect(actual.searchTerm).toEqual('test search');
  });

  it('should handle setApiCallTracking', () => {
    const actual = dashboardReducer(
      initialState,
      setApiCallTracking({ key: 'apiKey1', value: true })
    );
    expect(actual.apiCallTracking).toEqual({ apiKey1: true });
  });

  it('should handle multiple setApiCallTracking calls', () => {
    let state = dashboardReducer(initialState, setApiCallTracking({ key: 'api1', value: true }));
    state = dashboardReducer(state, setApiCallTracking({ key: 'api2', value: false }));
    expect(state.apiCallTracking).toEqual({ api1: true, api2: false });
  });

  it('should handle setAllScriptOptions', () => {
    const scriptOptions = [
      { id: 1, name: 'Script 1' },
      { id: 2, name: 'Script 2' },
    ];
    const actual = dashboardReducer(initialState, setAllScriptOptions(scriptOptions));
    expect(actual.allScriptOptions).toEqual(scriptOptions);
  });

  it('should handle setCapabilityVersionNumber', () => {
    const actual = dashboardReducer(initialState, setCapabilityVersionNumber('v1.2.3'));
    expect(actual.capabilityVersionNumber).toEqual('v1.2.3');
  });

  it('should handle empty string for setSearchTerm', () => {
    const stateWithSearch = { ...initialState, searchTerm: 'existing' };
    const actual = dashboardReducer(stateWithSearch, setSearchTerm(''));
    expect(actual.searchTerm).toEqual('');
  });

  it('should maintain other state when updating activeTab', () => {
    const stateWithData = {
      ...initialState,
      searchTerm: 'test',
      allScriptOptions: [{ id: 1 }],
    };
    const actual = dashboardReducer(stateWithData, setActiveTab('Recent'));
    expect(actual.searchTerm).toEqual('test');
    expect(actual.allScriptOptions).toEqual([{ id: 1 }]);
    expect(actual.activeTab).toEqual('Recent');
  });
});
