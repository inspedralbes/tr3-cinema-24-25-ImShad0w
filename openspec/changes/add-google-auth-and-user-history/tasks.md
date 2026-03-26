## 1. Setup and Dependencies

- [x] 1.1 Install Laravel Socialite package via Composer
- [x] 1.2 Configure Google OAuth credentials in .env
- [x] 1.3 Add Google OAuth configuration to config/services.php
- [x] 1.4 Ensure Laravel Sanctum is installed and configured

## 2. Database Migrations

- [x] 2.1 Create migration to add OAuth fields to users table (google_id, provider, provider_avatar)
- [x] 2.2 Create migration to add user_id foreign key to tickets table
- [x] 2.3 Run migrations and verify schema changes

## 3. Backend Email/Password Authentication

- [x] 3.1 Create AuthController with login and register methods
- [x] 3.2 Add authentication routes to api.php (login, register, logout)
- [x] 3.3 Implement registration validation and user creation
- [x] 3.4 Implement login with email/password authentication
- [x] 3.5 Implement logout and token invalidation
- [x] 3.6 Add password validation rules (minimum 8 characters)

## 4. Backend Google OAuth Implementation

- [x] 4.1 Create GoogleAuthController with redirect and callback methods
- [x] 4.2 Add OAuth routes to web.php (redirect, callback)
- [x] 4.3 Update User model with OAuth fields and relationships
- [x] 4.4 Implement user creation/retrieval logic in OAuth callback
- [x] 4.5 Handle existing user with same email (link accounts)

## 5. Backend Ticket-User Association

- [x] 5.1 Update Ticket model to include user relationship
- [x] 5.2 Modify ticket creation logic to associate with authenticated user
- [x] 5.3 Ensure backward compatibility for unauthenticated ticket purchases

## 6. Backend API Endpoints

- [x] 6.1 Create user profile API endpoint (GET /api/user)
- [x] 6.2 Create user ticket history API endpoint (GET /api/user/tickets)
- [x] 6.3 Implement pagination for ticket history
- [x] 6.4 Add authorization checks for ticket ownership

## 7. Frontend Email/Password Authentication

- [x] 7.1 Create login page with email/password form
- [x] 7.2 Create registration page with name, email, password fields
- [x] 7.3 Implement form validation and error handling
- [x] 7.4 Store authentication token after successful login/register
- [x] 7.5 Add logout functionality

## 8. Frontend Google OAuth Integration

- [x] 8.1 Add Google login button component
- [x] 8.2 Implement OAuth redirect flow
- [x] 8.3 Store authentication token after successful OAuth
- [x] 8.4 Handle OAuth errors and edge cases

## 9. Frontend User Profile and History

- [x] 9.1 Create user profile page
- [x] 9.2 Create ticket history page
- [x] 9.3 Display ticket history with event details
- [x] 9.4 Add loading states and error handling

## 10. Testing

- [x] 10.1 Test email/password registration
- [x] 10.2 Test email/password login
- [x] 10.3 Test Google OAuth flow with test credentials
- [x] 10.4 Test ticket association with authenticated users
- [x] 10.5 Test ticket history API endpoint
- [x] 10.6 Test backward compatibility for unauthenticated purchases