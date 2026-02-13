import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GridDropdown from '../GridPopup';

// Mock useHistory
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
}));

describe('GridDropdown', () => {
    const mockOnToggleSelect = jest.fn();
    const mockOnClose = jest.fn();
    const mockSetOpenon = jest.fn();

    const mockApps = [
        {
            id: 'app1',
            name: 'Workflow',
            icon: <div data-testid="icon-app1">WorkflowIcon</div>,
            route: '/app/workflow',
        },
        {
            id: 'app2',
            name: 'Users',
            icon: <div data-testid="icon-app2">UsersIcon</div>,
            route: '/app/users',
        },
        {
            id: 'app3',
            name: 'Settings',
            icon: <div data-testid="icon-app3">SettingsIcon</div>,
            route: '/app/settings',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (selectedIds: string[] = []) => {
        return render(
            <BrowserRouter>
                <GridDropdown
                    apps={mockApps}
                    selectedIds={selectedIds}
                    onToggleSelect={mockOnToggleSelect}
                    onClose={mockOnClose}
                    setOpenon={mockSetOpenon}
                />
            </BrowserRouter>
        );
    };

    it('should render all apps', () => {
        renderComponent();

        expect(screen.getByText('Workflow')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render instructions text', () => {
        renderComponent();

        expect(screen.getByText('Pin up to 3 menu items to the top. Drag to rearrange their order.')).toBeInTheDocument();
    });

    it('should render all app icons', () => {
        renderComponent();

        expect(screen.getByTestId('icon-app1')).toBeInTheDocument();
        expect(screen.getByTestId('icon-app2')).toBeInTheDocument();
        expect(screen.getByTestId('icon-app3')).toBeInTheDocument();
    });

    it('should navigate to app route when icon is clicked', () => {
        renderComponent();

        const icon = screen.getByTestId('icon-app1').parentElement;
        fireEvent.click(icon!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith('/app/workflow');
    });

    it('should navigate to app route when label is clicked', () => {
        renderComponent();

        const label = screen.getByText('Users');
        fireEvent.click(label);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith('/app/users');
    });

    it('should show pin button on hover', () => {
        renderComponent();

        const appItem = screen.getByText('Workflow').closest('div');

        // Initially, pin button might not be visible
        let pinButtons = screen.queryAllByRole('button');
        const initialCount = pinButtons.length;

        // Hover over the app item
        fireEvent.mouseEnter(appItem!);

        // Pin button should appear
        pinButtons = screen.getAllByRole('button');
        expect(pinButtons.length).toBeGreaterThan(initialCount);
    });

    it('should hide pin button on mouse leave', () => {
        renderComponent();

        const appItem = screen.getByText('Workflow').closest('div');

        // Hover to show button
        fireEvent.mouseEnter(appItem!);
        let pinButtons = screen.queryAllByRole('button');
        expect(pinButtons.length).toBeGreaterThan(0);

        // Leave to hide button
        fireEvent.mouseLeave(appItem!);

        // Button should be hidden (unless app is selected)
        pinButtons = screen.queryAllByRole('button');
        expect(pinButtons.length).toBe(0);
    });

    it('should call onToggleSelect when pin button is clicked', () => {
        renderComponent();

        const appItem = screen.getByText('Workflow').closest('div');

        // Hover to show pin button
        fireEvent.mouseEnter(appItem!);

        // Click the pin button
        const pinButton = screen.getAllByRole('button')[0];
        fireEvent.click(pinButton);

        expect(mockOnToggleSelect).toHaveBeenCalledWith('app1');
        expect(mockOnToggleSelect).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when pin button is clicked', () => {
        renderComponent();

        const appItem = screen.getByText('Workflow').closest('div');
        fireEvent.mouseEnter(appItem!);

        const pinButton = screen.getAllByRole('button')[0];
        fireEvent.click(pinButton);

        // onClose should NOT be called when clicking pin button
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should show pin button for selected apps', () => {
        renderComponent(['app1', 'app2']);

        // Pin buttons should be visible for selected apps without hover
        const pinButtons = screen.getAllByRole('button');
        expect(pinButtons.length).toBe(2);
    });

    it('should show check icon for selected apps', () => {
        const { container } = renderComponent(['app1']);

        // lucide-react CheckCircle2 renders as svg
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThan(0);
    });

    it('should handle multiple selected apps', () => {
        renderComponent(['app1', 'app2', 'app3']);

        const pinButtons = screen.getAllByRole('button');
        expect(pinButtons.length).toBe(3);
    });

    it('should maintain hovered state correctly across different apps', () => {
        renderComponent();

        const app1Item = screen.getByText('Workflow').closest('div');
        const app2Item = screen.getByText('Users').closest('div');

        // Hover over app1
        fireEvent.mouseEnter(app1Item!);
        let pinButtons = screen.getAllByRole('button');
        expect(pinButtons.length).toBe(1);

        // Move to app2
        fireEvent.mouseLeave(app1Item!);
        fireEvent.mouseEnter(app2Item!);

        pinButtons = screen.getAllByRole('button');
        expect(pinButtons.length).toBe(1);
    });

    it('should render with empty selectedIds array', () => {
        renderComponent([]);

        expect(screen.getByText('Workflow')).toBeInTheDocument();

        // No pin buttons should be visible initially
        const pinButtons = screen.queryAllByRole('button');
        expect(pinButtons.length).toBe(0);
    });

    it('should handle apps with different routes correctly', () => {
        renderComponent();

        fireEvent.click(screen.getByText('Workflow'));
        expect(mockPush).toHaveBeenCalledWith('/app/workflow');

        fireEvent.click(screen.getByText('Users'));
        expect(mockPush).toHaveBeenCalledWith('/app/users');

        fireEvent.click(screen.getByText('Settings'));
        expect(mockPush).toHaveBeenCalledWith('/app/settings');
    });
});
