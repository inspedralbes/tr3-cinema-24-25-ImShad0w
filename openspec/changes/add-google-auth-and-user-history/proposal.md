## Why

Users currently need to manually enter name and email for each ticket purchase. Adding user authentication (first via email/password, then Google OAuth) provides a seamless login experience, enables personalized ticket history for each user, and improves security.

## What Changes

- Add email/password login and registration system
- Add Google OAuth authentication using Laravel Socialite
- Add OAuth fields to users table (google_id, provider, avatar, etc.)
- Associate tickets with authenticated users (add user_id foreign key)
- Create user ticket history API and frontend interface
- Update ticket purchase flow to link tickets to authenticated users

## Capabilities

### New Capabilities
- `user-auth`: Email/password login and registration system
- `user-google-auth`: Google OAuth authentication via Laravel Socialite
- `user-ticket-history`: User ticket purchase history and management

### Modified Capabilities
- (none - no existing specs)

## Impact

- **Backend**: Auth controllers, Socialite controller, OAuth routes, user model updates, ticket-user relationship
- **Frontend**: Login/register pages, Google login button, user profile page, ticket history page
- **Database**: Migration for OAuth fields, user_id foreign key on tickets
- **Dependencies**: Laravel Socialite package, Google OAuth credentials
- **API**: New endpoints for authentication and ticket history