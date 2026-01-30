/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import '@testing-library/jest-dom';
import BinaryVersions from '../../../../../layouts/agent-management/components/versionmanagement/BinaryVersions';
jest.mock('../../../../../redux/selectors/agentManagement.selectors', () => ({
  getVersions: jest.fn(),
  isVersionManagementLoading: jest.fn(),
  getVersionError: jest.fn(),
  isCreateVersionLoading: jest.fn(),
  getCreateVersionError: jest.fn(),
  isManualSyncVersionsLoading: jest.fn(),
}));
jest.mock('../../../../../redux/actions/agentManagement.action', () => ({
  __esModule: true,
  default: {
    fetchVersions: jest.fn(() => ({ type: 'FETCH_VERSIONS' })),
    downloadFileExcel: jest.fn(() => ({ type: 'DOWNLOAD_FILE_EXCEL' })),
  },
}));
jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));
jest.mock('antd', () => ({
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Spin: ({ children }: { children: React.ReactNode }) => <div data-testid="loading-spinner">{children}</div>,
}));
jest.mock('../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsModal', () => {
  return function MockBinaryVersionsModal() {
    return <div data-testid="binary-versions-modal">Mock Modal</div>;
  };
});

jest.mock('../../../../../layouts/agent-management/components/DeleteModal', () => {
  return function MockDeleteModal() {
    return <div data-testid="delete-modal">Mock Delete Modal</div>;
  };
});

jest.mock('../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsHeader', () => {
  return function MockBinaryVersionsHeader() {
    return <div data-testid="binary-versions-header">Mock Header</div>;
  };
});

jest.mock('../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsTable', () => {
  return function MockBinaryVersionsTable() {
    return <div data-testid="binary-versions-table">Mock Table</div>;
  };
});

jest.mock('../../../../../layouts/agent-management/components/versionmanagement/BinaryFilterBar', () => {
  return function MockBinaryFilterBar() {
    return <div data-testid="binary-filter-bar">Mock Filter Bar</div>;
  };
});

const mockStore = createStore(() => ({}));

const mockSelectors = require('../../../../../redux/selectors/agentManagement.selectors');

describe('BinaryVersions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectors.getVersions.mockReturnValue([]);
    mockSelectors.isVersionManagementLoading.mockReturnValue(false);
    mockSelectors.getVersionError.mockReturnValue(null);
    mockSelectors.isCreateVersionLoading.mockReturnValue(false);
    mockSelectors.getCreateVersionError.mockReturnValue(null);
  });

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <BinaryVersions />
      </Provider>
    );
  };

  test('renders without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('binary-versions-header')).toBeInTheDocument();
    expect(screen.getByTestId('binary-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('binary-versions-table')).toBeInTheDocument();
  });

  test('shows loading spinner when loading', () => {
    mockSelectors.isVersionManagementLoading.mockReturnValue(true);
    renderComponent();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('shows create loading spinner when creating version', () => {
    mockSelectors.isCreateVersionLoading.mockReturnValue(true);
    renderComponent();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders with versions data', () => {
    const mockVersions = [
      {
        id: '1',
        version: '3.0.0',
        os: 'linux',
        type: 'Mandatory',
        description: 'Test version',
      },
    ];
    mockSelectors.getVersions.mockReturnValue(mockVersions);
    renderComponent();
    expect(screen.getByTestId('binary-versions-table')).toBeInTheDocument();
  });

  test('handles empty versions array', () => {
    mockSelectors.getVersions.mockReturnValue([]);
    renderComponent();
    expect(screen.getByTestId('binary-versions-table')).toBeInTheDocument();
  });

  test('handles null versions', () => {
    mockSelectors.getVersions.mockReturnValue(null);
    renderComponent();
    expect(screen.getByTestId('binary-versions-table')).toBeInTheDocument();
  });
});


