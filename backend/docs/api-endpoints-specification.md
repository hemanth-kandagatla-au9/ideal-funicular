# User Authorization API Endpoints & Responses

## 1. User Management APIs

### 1.1 List Users (User Authorization Page)
```http
GET /api/users
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page
- `search` (optional) - Search by username
- `isActive` (optional) - Filter by active status

**Response:**
```json
{
  "flag": "success",
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "username": "JJT-APP-RISE-TEST",
        "isActive": true,
        "rolesCount": 3,
        "createdBy": "admin",
        "updatedBy": "admin", 
        "createdAt": "2025-04-29T11:45:00+05:30",
        "updatedAt": "2025-04-29T11:45:00+05:30"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 640,
      "pages": 32
    }
  }
}
```

**Error Response:**
```json
{
  "flag": "error",
  "error": "Failed to fetch users"
}
```

### 1.2 Create User (Add User Modal)
```http
POST /api/users
```

**Request Body:**
```json
{
  "username": "JJT-APP-RISE-TEST",
  "password": "Strong@123"
}
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "JJT-APP-RISE-TEST",
    "isActive": true,
    "rolesCount": 0,
    "createdBy": "admin",
    "createdAt": "2025-04-29T11:45:00+05:30"
  }
}
```

**Error Response:**
```json
{
  "flag": "error",
  "error": "Username already exists"
}
```

### 1.3 Update User
```http
PUT /api/users/:id
```

**Request Body:**
```json
{
  "isActive": false
}
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "JJT-APP-RISE-TEST",
    "isActive": false,
    "rolesCount": 3,
    "updatedBy": "admin",
    "updatedAt": "2025-04-29T11:45:00+05:30"
  }
}
```

**Error Response:**
```json
{
  "flag": "error",
  "error": "User not found"
}
```

### 1.4 Delete User (Soft Delete)
```http
DELETE /api/users/:id
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "message": "User deactivated successfully"
  }
}
```

**Error Response:**
```json
{
  "flag": "error",
  "error": "User not found"
}
```

### 1.5 Get User Details
```http
GET /api/users/:id
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "JJT-APP-RISE-TEST",
    "isActive": true,
    "roles": [
      "agent:status:read",
      "agent:metric:read"
    ],
    "rolesCount": 2,
    "createdBy": "admin",
    "updatedBy": "admin",
    "createdAt": "2025-04-29T11:45:00+05:30",
    "updatedAt": "2025-04-29T11:45:00+05:30"
  }
}
```

## 2. Permission Management APIs

### 2.1 List Permissions (Permission List Page)
```http
GET /api/permissions
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page
- `project` (optional) - Filter by project
- `module` (optional) - Filter by module
- `permission` (optional) - Filter by permission name
- `search` (optional) - General search across all fields

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "permissions": [
      {
        "id": "507f1f77bcf86cd799439012",
        "project": "agent",
        "module": "status",
        "permission": "read",
        "code": "agent:status:read",
        "description": "Can read agent status",
        "createdBy": "admin",
        "createdAt": "2025-04-29T11:45:00+05:30"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 200,
      "pages": 10
    }
  }
}
```

### 2.2 Create Permission (Add Permission Modal)
```http
POST /api/permissions
```

**Request Body:**
```json
{
  "project": "agent",
  "module": "status",
  "permission": "read",
  "description": "Can read agent status"
}
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "project": "agent",
    "module": "status",
    "permission": "read",
    "code": "agent:status:read",
    "description": "Can read agent status",
    "createdBy": "admin",
    "createdAt": "2025-04-29T11:45:00+05:30"
  }
}
```

**Error Response:**
```json
{
  "flag": "error",
  "error": "Permission code 'agent:status:read' already exists"
}
```

### 2.3 Update Permission
```http
PUT /api/permissions/:id
```

**Request Body:**
```json
{
  "description": "Updated description for agent status read"
}
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "project": "agent",
    "module": "status", 
    "permission": "read",
    "code": "agent:status:read",
    "description": "Updated description for agent status read",
    "updatedBy": "admin",
    "updatedAt": "2025-04-29T11:45:00+05:30"
  }
}
```

### 2.4 Delete Permission (Soft Delete)
```http
DELETE /api/permissions/:id
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "message": "Permission deleted successfully"
  }
}
```

**Error Response:**
```json
{
  "flag": "error",
  "error": "Cannot delete permission - currently assigned to users"
}
```

## 3. User Permission Assignment APIs

### 3.1 Get Permission Matrix for User (Assign Permission Modal)
```http
GET /api/users/:id/permission-matrix
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "JJT-APP-RISE-TEST"
    },
    "projects": [
      {
        "project": "agent",
        "modules": [
          {
            "module": "status",
            "permissions": [
              {
                "code": "agent:status:read",
                "permission": "read",
                "description": "Can read agent status",
                "granted": true
              },
              {
                "code": "agent:status:update",
                "permission": "update",
                "description": "Can update agent status",
                "granted": false
              }
            ]
          },
          {
            "module": "metric",
            "permissions": [
              {
                "code": "agent:metric:read",
                "permission": "read",
                "description": "Can read agent metrics",
                "granted": true
              }
            ]
          }
        ]
      },
      {
        "project": "cybersphere",
        "modules": [
          {
            "module": "dashboard",
            "permissions": [
              {
                "code": "cybersphere:dashboard:view",
                "permission": "view",
                "description": "Can view cybersphere dashboard",
                "granted": false
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 3.2 Assign Permissions to User (Grant Permissions Button)
```http
PUT /api/users/:id/permissions
```

**Request Body:**
```json
{
  "codes": [
    "agent:status:read",
    "agent:metric:read",
    "cybersphere:dashboard:view"
  ]
}
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "roles": [
      "agent:status:read",
      "agent:metric:read",
      "cybersphere:dashboard:view"
    ],
    "rolesCount": 3,
    "updatedBy": "admin",
    "updatedAt": "2025-04-29T11:45:00+05:30"
  }
}
```

**Error Response:**
```json
{
  "flag": "error",
  "error": "Invalid permission codes: ['invalid:code:here']"
}
```

### 3.3 Get User Permissions (Optional - for detailed view)
```http
GET /api/users/:id/permissions
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "permissions": [
      {
        "project": "agent",
        "module": "status",
        "permission": "read",
        "code": "agent:status:read",
        "description": "Can read agent status"
      },
      {
        "project": "agent",
        "module": "metric",
        "permission": "read", 
        "code": "agent:metric:read",
        "description": "Can read agent metrics"
      }
    ]
  }
}
```

## 4. Authentication Integration

### 4.1 Login (Returns roles in JWT)
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "JJT-APP-RISE-TEST",
  "password": "Strong@123"
}
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "JJT-APP-RISE-TEST",
      "roles": [
        "agent:status:read",
        "agent:metric:read"
      ]
    }
  }
}
```

## 5. Utility APIs

### 5.1 Get Available Projects (for dropdowns)
```http
GET /api/permissions/projects
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "projects": [
      "agent",
      "cybersphere", 
      "insights",
      "script",
      "workflow"
    ]
  }
}
```

### 5.2 Get Modules by Project (for dropdowns)
```http
GET /api/permissions/projects/:project/modules
```

**Success Response:**
```json
{
  "flag": "success",
  "data": {
    "project": "agent",
    "modules": [
      "status",
      "metric",
      "config",
      "sync"
    ]
  }
}
```

## 6. Error Response Format

All endpoints follow consistent error response format:

```json
{
  "flag": "error",
  "error": "Descriptive error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## 7. Validation Rules

### User Creation:
- `username`: Required, unique, 3-50 characters, alphanumeric with hyphens
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, number, special character

### Permission Creation:
- `project`: Required, 1-50 characters
- `module`: Required, 1-50 characters  
- `permission`: Required, 1-50 characters
- `description`: Optional, max 500 characters
- Generated `code` must be unique

### Permission Assignment:
- All permission codes must exist in permissions collection
- User must exist and be active
- Maximum 100 permissions per user