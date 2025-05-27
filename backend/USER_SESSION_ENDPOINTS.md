# User Session Management Endpoints

This document describes the new user session management endpoints that have been added to the API.

## Overview

The user session management system tracks user login sessions with detailed information about devices, browsers, IP addresses, and more. Each user can view and manage their own sessions.

## Endpoints

### 1. Login (Modified)

- **URL**: `POST /api/users/login`
- **Description**: Login endpoint now creates a user session in addition to returning the JWT token
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer"
  }
  ```
- **Session Information Captured**:
  - Device type (mobile, tablet, desktop)
  - Browser information
  - Operating system
  - IP address
  - User agent string
  - Login method

### 2. Get User Sessions

- **URL**: `GET /api/users/sessions`
- **Description**: Get all sessions for the current authenticated user
- **Authentication**: Required (Bearer token)
- **Query Parameters**:
  - `active_only` (boolean, optional): Filter to show only active sessions (default: false)
  - `skip` (integer, optional): Number of sessions to skip for pagination (default: 0)
  - `limit` (integer, optional): Maximum number of sessions to return (default: 100, max: 500)
- **Response**:
  ```json
  {
    "sessions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": "550e8400-e29b-41d4-a716-446655440001",
        "session_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "device_type": "desktop",
        "device_name": null,
        "browser": "Chrome",
        "os": "Windows",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
        "ip_address": "192.168.1.100",
        "location": null,
        "is_active": true,
        "last_activity": "2024-01-15T10:30:00",
        "login_method": "password",
        "failed_attempts": 0,
        "is_suspicious": false,
        "created_at": "2024-01-15T10:00:00",
        "expires_at": "2024-01-22T10:00:00",
        "revoked_at": null,
        "session_metadata": null
      }
    ],
    "total": 5
  }
  ```

### 3. Revoke Specific Session

- **URL**: `POST /api/users/sessions/revoke`
- **Description**: Revoke a specific user session
- **Authentication**: Required (Bearer token)
- **Request Body**:
  ```json
  {
    "session_id": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Session revoked successfully",
    "session_id": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Security**: Users can only revoke their own sessions

### 4. Revoke All Sessions

- **URL**: `POST /api/users/sessions/revoke-all`
- **Description**: Revoke all user sessions, optionally keeping the current session active
- **Authentication**: Required (Bearer token)
- **Query Parameters**:
  - `keep_current` (boolean, optional): Keep the current session active (default: true)
- **Response**:
  ```json
  {
    "message": "Successfully revoked 3 sessions",
    "revoked_count": 3,
    "current_session_kept": true
  }
  ```

## Security Features

1. **User Isolation**: Users can only view and manage their own sessions
2. **Session Validation**: The system tracks session expiration and revocation status
3. **Device Tracking**: Sessions include device and browser information for security monitoring
4. **IP Tracking**: Session IP addresses are recorded for security analysis
5. **Suspicious Activity Detection**: The system can flag suspicious sessions

## Session States

- **Active**: `is_active = true`, not expired, not revoked
- **Expired**: `expires_at < current_time`
- **Revoked**: `revoked_at` is set to a timestamp
- **Inactive**: `is_active = false`

## Database Schema

The `user_sessions` table includes the following fields:

- `id`: Unique session identifier
- `user_id`: Reference to the user
- `session_token`: JWT token (unique)
- `device_type`: mobile, tablet, desktop
- `device_name`: Specific device name
- `browser`: Browser name
- `os`: Operating system
- `user_agent`: Full user agent string
- `ip_address`: Client IP address
- `location`: Geographic location (optional)
- `is_active`: Session active status
- `last_activity`: Last activity timestamp
- `login_method`: How the user logged in
- `failed_attempts`: Number of failed attempts
- `is_suspicious`: Security flag
- `created_at`: Session creation time
- `expires_at`: Session expiration time
- `revoked_at`: Session revocation time
- `session_metadata`: Additional JSON metadata

## Usage Examples

### Get active sessions only

```bash
curl -X GET "http://localhost:8000/api/users/sessions?active_only=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Revoke a specific session

```bash
curl -X POST "http://localhost:8000/api/users/sessions/revoke" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "550e8400-e29b-41d4-a716-446655440000"}'
```

### Revoke all sessions except current

```bash
curl -X POST "http://localhost:8000/api/users/sessions/revoke-all?keep_current=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
