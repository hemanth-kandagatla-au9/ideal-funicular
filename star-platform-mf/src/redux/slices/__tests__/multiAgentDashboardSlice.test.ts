import multiAgentDashboardReducer, {
  setActiveTab,
  setSearchTerm,
} from '../multiAgentDashboardSlice';

describe('multiAgentDashboardSlice', () => {
  const initialState = {
    activeTab: 'All',
    searchTerm: '',
  };

  it('should return the initial state', () => {
    expect(multiAgentDashboardReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setActiveTab', () => {
    const actual = multiAgentDashboardReducer(initialState, setActiveTab('Active'));
    expect(actual.activeTab).toEqual('Active');
  });

  it('should handle setSearchTerm', () => {
    const actual = multiAgentDashboardReducer(initialState, setSearchTerm('search query'));
    expect(actual.searchTerm).toEqual('search query');
  });

  it('should handle empty string for setSearchTerm', () => {
    const stateWithSearch = { ...initialState, searchTerm: 'existing' };
    const actual = multiAgentDashboardReducer(stateWithSearch, setSearchTerm(''));
    expect(actual.searchTerm).toEqual('');
  });

  it('should maintain other state when updating activeTab', () => {
    const stateWithSearch = { ...initialState, searchTerm: 'test search' };
    const actual = multiAgentDashboardReducer(stateWithSearch, setActiveTab('Completed'));
    expect(actual.searchTerm).toEqual('test search');
    expect(actual.activeTab).toEqual('Completed');
  });

  it('should maintain other state when updating searchTerm', () => {
    const stateWithTab = { ...initialState, activeTab: 'Custom' };
    const actual = multiAgentDashboardReducer(stateWithTab, setSearchTerm('new search'));
    expect(actual.activeTab).toEqual('Custom');
    expect(actual.searchTerm).toEqual('new search');
  });

  it('should handle multiple updates', () => {
    let state = multiAgentDashboardReducer(initialState, setActiveTab('Pending'));
    state = multiAgentDashboardReducer(state, setSearchTerm('filter text'));
    expect(state).toEqual({
      activeTab: 'Pending',
      searchTerm: 'filter text',
    });
  });
});
