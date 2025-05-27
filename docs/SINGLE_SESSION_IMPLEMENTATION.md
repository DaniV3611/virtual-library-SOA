# Single Session Per User Implementation

## Overview

This implementation ensures that each user can only have one active session at a time across all devices and browsers. When a user logs in from a new location, all previous sessions are automatically revoked.

## Why Single Session Approach?

### Security Benefits

- **Prevents Session Hijacking**: Stolen tokens become useless when user logs in elsewhere
- **Reduces Attack Surface**: Minimizes the number of valid tokens in circulation
- **Clear Security Model**: Users know exactly where they're logged in
- **Eliminates Confusion**: No accidental actions from wrong accounts

### User Experience Benefits

- **Simple to Understand**: One login = one active session
- **Clear Feedback**: Users know when they've been logged out
- **Prevents Account Mixing**: No confusion between multiple accounts in same browser
- **Consistent Behavior**: Same behavior across all devices

## Implementation Details

### Backend Changes

#### 1. Automatic Session Revocation on Login (`app/api/routes/users.py`)

```python
@router.post("/login", response_model=Token)
def login_for_access_token(request: Request, session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()):
    # ... authentication logic ...

    # Revoke all existing sessions for this user before creating new one
    # This ensures only one active session per user across all devices/browsers
    revoke_all_user_sessions(session, user_id=user.id, except_session_id=None)

    # Create new session
    create_user_session(session, session_data)
```

**Key Features:**

- **Immediate Revocation**: All previous sessions are revoked before creating the new one
- **Cross-Device**: Works across all devices, browsers, and tabs
- **No Exceptions**: No sessions are spared (except_session_id=None)

### Frontend Changes

#### 1. User Change Detection Hook (`src/hooks/useUserChangeDetection.ts`)

Detects when a different user logs in and handles cleanup:

```typescript
export const useUserChangeDetection = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (
      user?.id &&
      previousUserIdRef.current &&
      user.id !== previousUserIdRef.current
    ) {
      // User has changed - show notification
      toast.info(`Switched to account: ${user.name}`, {
        description: "Previous session has been automatically closed.",
      });

      // Notify other components
      window.dispatchEvent(
        new CustomEvent("user-switched", {
          detail: { previousUserId, currentUserId: user.id },
        })
      );
    }
  }, [user?.id]);
};
```

#### 2. Cross-Tab Synchronization

Handles user changes across browser tabs:

```typescript
useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "library-authToken") {
      if (event.newValue !== event.oldValue && event.newValue !== null) {
        // Token changed in another tab (different user login)
        window.location.reload();
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);
}, []);
```

#### 3. Session Management Integration

Updated `useUserSessions` to refresh when user switches:

```typescript
useEffect(() => {
  const handleUserSwitch = () => {
    setSessions([]);
    if (authToken) {
      fetchSessions();
    }
  };

  window.addEventListener("user-switched", handleUserSwitch);
}, [authToken, fetchSessions]);
```

## User Experience Flow

### Scenario 1: Same User, Different Tab

1. **User A** logged in Tab 1
2. **User A** opens Tab 2
3. **Result**: Both tabs work normally (same user)

### Scenario 2: Different User, Same Browser

1. **User A** logged in Tab 1
2. **User B** logs in Tab 2
3. **Backend**: User A's session revoked, User B's session created
4. **Tab 1**: Automatically shows "Switched to account: User B"
5. **Tab 2**: Normal login flow continues
6. **Result**: Only User B is logged in across all tabs

### Scenario 3: User Login from Different Device

1. **User A** logged in on Computer
2. **User A** logs in on Phone
3. **Computer**: Next API call returns 401 "Session has been revoked"
4. **Computer**: Automatic logout with notification
5. **Phone**: Normal session continues
6. **Result**: Only phone session is active

## Technical Benefits

### Security

- **Token Rotation**: Fresh tokens with each login
- **Session Cleanup**: No orphaned sessions in database
- **Immediate Effect**: Previous sessions stop working instantly

### Performance

- **Database Efficiency**: Fewer active sessions to validate
- **Reduced Memory**: Less session data stored
- **Faster Queries**: Smaller session tables

### Maintenance

- **Simplified Debugging**: Only one session per user to track
- **Clear Audit Trail**: Easy to see user's current session
- **Reduced Complexity**: No need to handle multiple concurrent sessions

## Configuration Options

### Future Enhancements

If needed, this could be made configurable:

```python
# Environment variable to control session behavior
ALLOW_MULTIPLE_SESSIONS = False  # Current implementation

# Alternative configurations:
# ALLOW_MULTIPLE_SESSIONS = True   # Allow multiple sessions
# MAX_SESSIONS_PER_USER = 3        # Limit to N sessions
# SESSION_LIMIT_BY_DEVICE = True   # One per device type
```

## Monitoring and Analytics

### Metrics to Track

- **Session Revocation Rate**: How often users get logged out
- **Login Frequency**: How often users re-login
- **User Complaints**: About unexpected logouts
- **Security Incidents**: Reduced due to single session

### Logging

```python
# Log session revocations for monitoring
logger.info(f"Revoked {revoked_count} sessions for user {user.id} on new login")
```

## Testing Scenarios

### Manual Testing

1. **Basic Flow**: Login from two browsers, verify second logs out first
2. **Cross-Tab**: Login different users in same browser tabs
3. **Mobile/Desktop**: Login from phone after desktop session
4. **Refresh Test**: Refresh page after session revoked elsewhere

### Automated Testing

```python
def test_single_session_per_user():
    # Login user from device 1
    token1 = login_user("user@example.com", "password")

    # Verify session works
    assert get_user_profile(token1).status_code == 200

    # Login same user from device 2
    token2 = login_user("user@example.com", "password")

    # Verify first session is revoked
    assert get_user_profile(token1).status_code == 401

    # Verify second session works
    assert get_user_profile(token2).status_code == 200
```

## Troubleshooting

### Common Issues

1. **"Frequent Logouts"**

   - **Cause**: User logging in from multiple devices
   - **Solution**: User education about single session behavior

2. **"Session Lost on Page Refresh"**

   - **Cause**: Token revoked by login elsewhere
   - **Solution**: Check for other login attempts

3. **"Can't Use Multiple Accounts"**
   - **Cause**: By design - single session per user
   - **Solution**: Use incognito/private browsing for second account

## Migration Notes

### From Multi-Session to Single-Session

If migrating from a multi-session system:

1. **User Communication**: Notify users about the change
2. **Gradual Rollout**: Consider feature flag for testing
3. **Monitor Metrics**: Watch for increased support tickets
4. **Rollback Plan**: Keep old system available if needed

### Database Cleanup

```sql
-- Clean up orphaned sessions after migration
DELETE FROM user_sessions
WHERE is_active = false
AND revoked_at < NOW() - INTERVAL '30 days';
```

This implementation provides a secure, simple, and user-friendly approach to session management while maintaining excellent security posture.
