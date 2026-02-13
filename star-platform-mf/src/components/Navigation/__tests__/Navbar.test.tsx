import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

jest.mock('../../Gridpopup/GridPopup', () => ({
  __esModule: true,
  default: () => <div data-testid="grid-dropdown">Mock Dropdown</div>,
}));

jest.mock('../Navbar.module.scss', () => ({
  navParent: 'navParent',
  navWrap: 'navWrap',
  tab: 'tab',
  activeTab: 'activeTab',
  tabContent: 'tabContent',
}));

jest.mock('../../../assets/gridpopup.svg', () => 'gridpopup.svg');
jest.mock('../../../assets/capability.svg', () => 'capability.svg');
jest.mock('../../../assets/executions.svg', () => 'executions.svg');
jest.mock('../../../assets/myspace.svg', () => 'myspace.svg');
jest.mock('../../../assets/metrics.svg', () => 'metrics.svg');
jest.mock('../../../assets/approval.svg', () => 'approval.svg');
jest.mock('../../../assets/auditlogs.svg', () => 'auditlogs.svg');
jest.mock('../../../assets/cmdb.svg', () => 'cmdb.svg');
jest.mock('../../../assets/codemarketplace.svg', () => 'codemarketplace.svg');
jest.mock('../../../assets/lucide.svg', () => 'lucide.svg');
jest.mock('../../../assets/reportstatus.svg', () => 'reportstatus.svg');
jest.mock('../../../assets/sapfacts.svg', () => 'sapfacts.svg');
jest.mock('../../../assets/user.svg', () => 'user.svg');
jest.mock('../../../assets/reports.svg', () => 'reports.svg');
jest.mock('../../../assets/users.svg', () => 'users.svg');
jest.mock('../../../assets/settings.svg', () => 'settings.svg');
jest.mock('../../../assets/node-management.svg', () => 'node-management.svg');

describe('Navbar Component', () => {
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'pinnedApps') {
        return JSON.stringify(['workflow', 'execution']);
      }
      return null;
    });
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render navbar without crashing', () => {
    const { container } = renderNavbar();
    const navbar = container.querySelector('.navParent');
    expect(navbar).toBeInTheDocument();
  });

  it('should display pinned navigation links', () => {
    renderNavbar();
    const mySpaceLink = screen.getByText('My Space');
    const executionsLink = screen.getByText('Executions');
    expect(mySpaceLink).toBeInTheDocument();
    expect(executionsLink).toBeInTheDocument();
  });
});
