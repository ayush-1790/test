Here is the JSON data and the corresponding API endpoints to create the permissions, roles, and users manually.

### 1. Create Permissions

Send a `POST` request to `/permissions` for each permission you want to create.

**Endpoint:** `POST /permissions`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_auth_token>"
}
```

**Body for "post:create":**
```json
{
  "name": "post:create",
  "description": "Create a new post"
}
```

**Body for "post:read":**
```json
{
  "name": "post:read",
  "description": "Read a post"
}
```

**Body for "post:update":**
```json
{
  "name": "post:update",
  "description": "Update a post"
}
```

**Body for "post:delete":**
```json
{
  "name": "post:delete",
  "description": "Delete a post"
}
```

---

### 2. Create Roles

Send a `POST` request to `/roles` for each role you want to create. Make sure to save the `_id` from the response for each role, as you will need it to assign permissions.

**Endpoint:** `POST /roles`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_auth_token>"
}
```

**Body for "editor" role:**
```json
{
  "name": "editor",
  "description": "Editor role"
}
```

**Body for "viewer" role:**
```json
{
  "name": "viewer",
  "description": "Viewer role"
}
```

---

### 3. Assign Permissions to Roles

Send a `POST` request to `/roles/:roleId/permissions`, replacing `:roleId` with the ID of the role you created in the previous step.

**Endpoint:** `POST /roles/:roleId/permissions`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_auth_token>"
}
```

**Body for "editor" role:**
```json
{
  "permissions": ["post:create", "post:read", "post:update"]
}
```

**Body for "viewer" role:**
```json
{
  "permissions": ["post:read"]
}
```

---

### 4. Create Users

Send a `POST` request to `/auth/signup` for each user you want to create. Save the `_id` of each user from the response.

**Endpoint:** `POST /auth/signup`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body for "Editor User":**
```json
{
  "name": "Editor User",
  "email": "editor@example.com",
  "password": "password"
}
```

**Body for "Viewer User":**
```json
{
  "name": "Viewer User",
  "email": "viewer@example.com",
  "password": "password"
}
```

---

### 5. Assign Roles to Users

Send a `POST` request to `/user-roles` to assign a role to a user.

**Endpoint:** `POST /user-roles`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_auth_token>"
}
```

**Body for assigning "editor" role to "Editor User":**
```json
{
  "userId": "<userId of editor@example.com>",
  "roleId": "<roleId of editor role>"
}
```

**Body for assigning "viewer" role to "Viewer User":**
```json
{
  "userId": "<userId of viewer@example.com>",
  "roleId": "<roleId of viewer role>"
}
```
