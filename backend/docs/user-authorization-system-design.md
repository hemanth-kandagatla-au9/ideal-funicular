# User Authorization System - Simple & Clean Design

## Requirements Summary

Here's what I think your requirement is right now. I'll keep it high-level so you can just say "yes/no" on each line.

### 1. Tech / storage
- MongoDB is the main data store.
- We are designing only the data model + REST endpoints + JSON responses (no UI code).

### 2. Users (User Authorisation page)
- There is a table of users.
- You can create a user with at least: username, password, and some basic fields (name, email, createdAt, createdBy, etc).
- From each user row you can open a modal to assign permissions to that user.

### 3. Global permissions (Permission List page)
- There is a separate "Permission List" screen.
- On this screen, you can create permissions at a global level (not tied to any user).
- Each permission belongs to:
  - a Project (example: "agent") – project list is more or less fixed/hardcoded.
  - a Module under that project (example: "status").
  - an action/permission name (example: "read" or "sync_config").
- A permission is represented as a single string code built from those parts, like:
  - `agent:status:read`
- The Permission List lets you:
  - filter by project / module / permission
  - view existing permission entries
  - add new permissions
  - delete a permission (if allowed).

### 4. Assigning permissions to users (Assign Permission modal)
- From the User Authorisation page, clicking an action on a user opens a modal.
- In this modal you see permissions grouped by project and module (like in your screenshot: Project card -> multiple Module cards -> inside each card a list of permission toggles).
- For a given user:
  - already assigned permissions must appear as toggled ON.
  - when the admin changes toggles and clicks "Grant : Permissions", the backend should update that user's permissions.

### 5. How user permissions are stored
- For each user, we want to have an array of permission codes (roles) like:
  - `roles: ["agent:status:read", "agent:metric:read", ...]`.
- This roles array is the most important thing and will be used for:
  - attaching to JWT tokens,
  - checking access in APIs.
- There also needs to be some way (collection / structure) to know which global permissions are available and which of them are assigned to the user so the modal can be built correctly and show toggles.

### 6. What you want from me
- A clear, final design for:
  - MongoDB collections and fields (users, global permissions, user-permission assignments, etc.).
  - The REST endpoints for:
    - managing users,
    - managing global permissions,
    - assigning permissions to users,
    - and the JSON response shapes.
- The design must exactly match how your three screens work and support the `roles` array concept.

This is my understanding.

---

## MongoDB Collections (Simple Design)

High-level: **Only 2 core collections are required:**
- `users` → includes roles: [ "agent:status:read", ... ]
- `permissions` → global permission definitions entered via (project, module, permission) inputs

Everything else (screens, toggles, JWT auth) is built on top of these.

### A) users
One row per user in "User Authorisation". Example document:

```javascript
{
  _id: ObjectId("..."),
  username: "JJT-APP-RISE-TEST",   // unique
  passwordHash: "bcrypt-hash-here",
  fullName: "Rise Test User",
  email: "test@example.com",
  isActive: true,
  
  // IMPORTANT: assigned permissions
  roles: [
    "agent:status:read",
    "agent:metric:read"
  ],
  
  createdBy: ObjectId("adminId"),
  updatedBy: ObjectId("adminId"),
  createdAt: ISODate("2025-04-29T06:15:00Z"),
  updatedAt: ISODate("2025-04-29T06:15:00Z")
}
```

**Indexes:**
- unique index on `{ username: 1 }`

### B) permissions (GLOBAL permission list)
This powers the "Permission List" page and the Assign-Permission modal.
Each document is ONE global permission:
- project ← first input (e.g. "agent")
- module ← second input (e.g. "status") 
- permission ← third input (e.g. "read")
- code = ${project}:${module}:${permission}

Example document:

```javascript
{
  _id: ObjectId("perm1"),
  project: "agent",          // from dropdown / input
  module: "status",          // from dropdown / input
  permission: "read",        // from dropdown / input
  code: "agent:status:read", // unique, stored once here
  description: "Can read agent status",
  
  createdBy: ObjectId("adminId"),
  createdAt: ISODate("2025-04-29T06:15:00Z"),
  updatedBy: ObjectId("adminId"),
  updatedAt: ISODate("2025-04-29T06:15:00Z")
}
```

**Indexes:**
- unique index on `{ code: 1 }`
- optional compound index on `{ project: 1, module: 1, permission: 1 }`

**Note:**
- No extra collections for project/module are mandatory.
- You can still hardcode the project list in UI while storing them as strings here.

---

## REST API Endpoints

### 1. Global Permissions Screen
These drive your "User Authorisation / Permissions" page.

#### List permissions (with filters)
```http
GET /permissions
```

**Query params:**
- project (optional)
- module (optional)  
- permission (optional)
- page, limit

**Response:**
```json
{
  "data": [
    {
      "id": "perm1",
      "project": "agent",
      "module": "status",
      "permission": "read",
      "code": "agent:status:read",
      "description": "Can read agent status",
      "createdAt": "2025-04-29T11:45:00+05:30",
      "createdBy": "name"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 200,
    "pages": 10
  }
}
```

#### Create a global permission (Add button)
```http
POST /permissions
```

**Body:**
```json
{
  "project": "agent",
  "module": "status",
  "permission": "read",
  "description": "Can read agent status"
}
```

**Server:**
- build code = project + ":" + module + ":" + permission
- ensure code is unique
- insert into permissions collection

**Response:**
```json
{
  "id": "perm1",
  "project": "agent",
  "module": "status", 
  "permission": "read",
  "code": "agent:status:read",
  "description": "Can read agent status",
  "createdAt": "2025-04-29T11:45:00+05:30"
}
```

#### Delete permission (trash icon)
```http
DELETE /permissions/:id
```

Either hard-delete or soft delete (add isActive: false and filter it out everywhere).

### 2. User Authorisation List

#### List users (table + pagination)
```http
GET /users?page=1&limit=20&search=JJT
```

**Response:**
```json
{
  "data": [
    {
      "id": "user1",
      "username": "JJT-APP-RISE-TEST",
      "Password":"hello",
      "isActive": true,
      "createdBy": "name",
      "updatedBy": "name",
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
```

#### Create user (Add User button)
```http
POST /users
```

**Body:**
```json
{
  "username": "JJT-APP-RISE-TEST",
  "password": "Strong@123",
  "fullName": "Rise Test User",
  "email": "test@example.com",
  "isActive": true
}
```

**Server:**
- hash password
- create user with roles: []

**Response:**
```json
{
  "id": "user1",
  "username": "JJT-APP-RISE-TEST",
  "fullName": "Rise Test User",
  "email": "test@example.com",
  "isActive": true,
  "createdAt": "2025-04-29T11:45:00+05:30",
  "createdBy": "name"
}
```

#### Update user
```http
PUT /users/:id
```

**Body (subset):**
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "isActive": false
}
```

#### Delete / deactivate user
```http
DELETE /users/:id
```

(or PATCH /users/:id/status to toggle isActive)

### 3. Assign Permission Modal – Backend Design

**Goal:**
- Show all permissions grouped by project/module.
- For a given user, any permission already in user.roles must be toggled ON.

#### A) Load data for modal
```http
GET /users/:id/permission-matrix
```

**Server:**
- user = users.findOne({ _id: id })
- userRolesSet = new Set(user.roles)  // e.g. ["agent:status:read", ...]
- perms = permissions.find({ /* isActive if you add it */ })
- Group perms by project/module, and for each permission mark granted = userRolesSet.has(perms[i].code).

**Example response:**
```json
{
  "user": {
    "id": "user1",
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
              "granted": true   // toggle ON
            },
            {
              "code": "agent:status:update",
              "permission": "update", 
              "description": "Can update agent status",
              "granted": false  // toggle OFF
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
    }
  ]
}
```

**UI mapping:**
- Project Name label = project
- Each card = one module
- Inside card, each row = one permissions[] entry, bound to granted boolean.
- "Select All" per module = set all permissions[].granted to true/false.

#### B) Save permissions from modal

When admin clicks "Grant : Permissions", front-end sends list of codes that are ON.

```http
PUT /users/:id/permissions
```

**Body:**
```json
{
  "codes": [
    "agent:status:read",
    "agent:metric:read",
    "agent:config:update"
  ]
}
```

**Server:**
1. Validate codes exist in permissions collection:
   ```javascript
   const existing = await db.permissions.find({ code: { $in: codes } }).toArray()
   if (existing.length !== codes.length) → reject invalid codes.
   ```

2. Update user document:
   ```javascript
   await db.users.updateOne(
     { _id: userId },
     {
       $set: {
         roles: codes,
         updatedBy: currentAdminId,
         updatedAt: new Date()
       }
     }
   )
   ```

**Response:**
```json
{
  "userId": "user1",
  "roles": [
    "agent:status:read",
    "agent:metric:read",
    "agent:config:update"
  ]
}
```

That's all – **no extra mapping table is strictly required**.

The "assigned permissions" information lives in users.roles and is cross-checked against permissions for validity.

#### Optional extra endpoint to list a user's permissions with details:
```http
GET /users/:id/permissions
```

→ join users.roles with permissions collection:

```json
{
  "userId": "user1",
  "permissions": [
    {
      "project": "agent",
      "module": "status",
      "permission": "read",
      "code": "agent:status:read",
      "description": "Can read agent status"
    }
  ]
}
```

---

## How Auth Uses Roles Array

### At login:
```http
POST /auth/login
```

**Response:**
```json
{
  "accessToken": "",
  "user": {
    "id": "user1",
    "username": "JJT-APP-RISE-TEST",
    "roles": [
      "agent:status:read",
      "agent:metric:read"
    ]
  }
}
```

### Middleware on protected APIs:
```javascript
function hasPermission(user, requiredCode) {
  return user.roles?.includes(requiredCode);
}

// Example:
if (!hasPermission(req.user, "agent:status:read")) {
  return res.status(403).json({ message: "Forbidden" });
}
```

---

## Frontend Integration Requirements

The frontend needs to consume these APIs to power the three main screens:

### 1. Permission List Screen
- Call `GET /permissions` with filters for project/module/permission dropdowns
- Call `POST /permissions` when admin adds new global permission
- Call `DELETE /permissions/:id` when admin removes permission
- **Project/Module dropdowns**: Can be hardcoded in frontend or derived from existing permissions

### 2. User Authorization Screen
- Call `GET /users` with pagination and search
- Call `POST /users` when admin creates new user
- Call `PUT /users/:id` for basic user updates
- Call `DELETE /users/:id` when admin removes user
- Trigger permission assignment modal from each user row

### 3. Assign Permissions Modal
- Call `GET /users/:id/permission-matrix` to load modal with current user permissions
- Group response data by project → module → permissions with granted toggles
- Call `PUT /users/:id/permissions` with selected permission codes when admin clicks "Grant Permissions"
- Show success/error feedback and refresh user list

### Key Frontend Considerations:
- **Project list**: Can be hardcoded (agent, cybersphere, insights, script, workflow) or derived from permissions API
- **Module list**: Derived dynamically from permissions for each project
- **Permission validation**: Frontend should validate against available permissions from the global list
- **Real-time updates**: After permission changes, refresh the user list to show updated role counts
- **Error handling**: Handle cases where permissions are deleted while assigned to users