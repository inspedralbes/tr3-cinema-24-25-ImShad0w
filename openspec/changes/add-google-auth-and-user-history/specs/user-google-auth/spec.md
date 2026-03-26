## ADDED Requirements

### Requirement: User can authenticate with Google OAuth
The system SHALL allow users to authenticate using their Google account via Laravel Socialite.

#### Scenario: Successful Google authentication
- **WHEN** user initiates Google OAuth flow
- **THEN** system redirects to Google consent screen

#### Scenario: Google OAuth callback with valid credentials
- **WHEN** Google redirects back with valid OAuth credentials
- **THEN** system creates or retrieves user account and issues authentication token

### Requirement: System creates user account for new Google users
The system SHALL automatically create user accounts for first-time Google authentication.

#### Scenario: New user first-time Google login
- **WHEN** user authenticates with Google for the first time
- **THEN** system creates new user record with Google profile information

#### Scenario: Existing user Google login
- **WHEN** user with existing Google ID authenticates
- **THEN** system retrieves existing user account

### Requirement: System stores Google profile information
The system SHALL store relevant Google profile data for authenticated users.

#### Scenario: Store Google profile data on authentication
- **WHEN** user authenticates with Google
- **THEN** system stores google_id, email, name, and avatar URL

### Requirement: System issues authentication token after OAuth
The system SHALL provide authentication tokens for API access after successful OAuth.

#### Scenario: Issue token after successful OAuth
- **WHEN** user completes Google OAuth flow successfully
- **THEN** system issues Sanctum authentication token

### Requirement: User can logout and invalidate token
The system SHALL allow users to logout and invalidate their authentication token.

#### Scenario: User logout
- **WHEN** user requests logout
- **THEN** system invalidates current authentication token