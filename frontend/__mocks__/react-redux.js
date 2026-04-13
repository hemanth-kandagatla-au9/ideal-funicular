const mockStore = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn((action) => action),
  subscribe: jest.fn(() => () => {}),
};

const Provider = ({ children }) => children;

const useDispatch = jest.fn(() => mockStore.dispatch);

const useSelector = jest.fn((selector) => selector({}));

const connect = jest.fn((mapStateToProps, mapDispatchToProps) => (Component) => Component);

const bindActionCreators = jest.fn((actions, dispatch) => actions);

module.exports = {
  Provider,
  useDispatch,
  useSelector,  
  connect,
  bindActionCreators,
};
