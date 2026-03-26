## ADDED Requirements

### Requirement: User can register with email and password
The system SHALL allow new users to register with name, email, and password.

#### Scenario: Successful registration
- **WHEN** user provides valid name, email, and password
- **THEN** system creates new user account and issues authentication token

#### Scenario: Registration with existing email
- **WHEN** user attempts to register with an email already in use
- **THEN** system returns validation error indicating email is already registered

### Requirement: User can login with email and password
The system SHALL allow registered users to authenticate with email and password.

#### Scenario: Successful login
- **WHEN** user provides valid email and password
- **THEN** system issues authentication token

#### Scenario: Invalid credentials
- **WHEN** user provides invalid email or password
- **THEN** system returns authentication error

### Requirement: User can logout and invalidate token
The system SHALL allow authenticated users to logout and invalidate their current session.

#### Scenario: User logout
- **WHEN** authenticated user requests logout
- **THEN** system invalidates current authentication token

### Requirement: System validates password strength
The system SHALL enforce minimum password requirements during registration.

#### Scenario: Weak password during registration
- **WHEN** user attempts to register with password shorter than 8 characters
- **THEN** system returns validation error requiring stronger password

### Requirement: System provides authentication state
The system SHALL provide current user information for authenticated requests.

#### Scenario: Authenticated user requests profile
- **WHEN** authenticated user requests their profile
- **THEN** system returns current user information (name, email, created_at)