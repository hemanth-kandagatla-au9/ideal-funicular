# Global Configuration Mock Data

## Overview
This directory contains mock data for the Global Configuration feature. The mock data simulates backend API responses for development and testing purposes.

## Files
- **globalConfigMock.ts**: Contains mock data and helper functions for global configuration

## Usage

### Switching Between Mock and Real API

In `services/agent/agentManagement.service.ts`, you can toggle between mock data and real API:

```typescript
// Using mock data for development
const USE_MOCK_DATA = true; // Set to false to use real API
```

### Mock Data Structure

The mock data follows this structure:

```typescript
{
  flag: "success",
  data: {
    configs: [
      {
        propertyName: string,
        propertyValue: string,
        canModify: boolean,
        isVisible: boolean
      },
      // ... more config items
    ]
  }
}
```

### Configuration Properties

- **propertyName**: The name/key of the configuration property
- **propertyValue**: The current value of the property
- **canModify**: Whether the property can be edited by the user
- **isVisible**: Whether the property should be displayed in the UI

### Password Fields

Fields with "password" in the `propertyName` (case-insensitive) are automatically treated as password fields with show/hide functionality.

## Features

### 1. Fetch Configuration
- API endpoint: GET `/agents/global-configuration`
- Returns all configuration items
- Simulates 500ms network delay

### 2. Save Configuration
- API endpoint: POST `/agents/global-configuration`
- Accepts payload: `{ riseBot: ConfigItem[] }`
- Simulates 700ms network delay
- Persists changes in memory during the session

### 3. Reset Mock Data
```typescript
import { resetMockGlobalConfig } from '@/mocks/globalConfigMock';

// Reset to initial values
resetMockGlobalConfig();
```

## Testing

The mock data is useful for:
- Frontend development without backend dependency
- Unit testing components
- Integration testing workflows
- Demo and presentation purposes

## Configuration Items

The mock includes 39 configuration properties covering:
- Network settings (IP, ports)
- OpenSearch configuration
- Authentication credentials
- System limits and timeouts
- Script execution settings
- API endpoints
- Monitoring intervals

## Notes

- Mock data is stored in memory and resets on page reload
- Password fields are hidden by default but can be toggled visible
- Only fields with `canModify: true` can be edited
- Only fields with `isVisible: true` are displayed in the UI
