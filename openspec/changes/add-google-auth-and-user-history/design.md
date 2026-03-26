## Context

The cinema application currently allows anonymous ticket purchases with name/email. We need to add user authentication (email/password first, then Google OAuth via Laravel Socialite) and associate tickets with authenticated users to provide purchase history.

Current state:
- Users table has standard Laravel auth fields (name, email, password)
- Tickets table has name, email, event_id, seat_id but no user_id
- Frontend is Next.js with API backend

## Goals / Non-Goals

**Goals:**
- Add email/password login and registration system
- Add Google OAuth login via Laravel Socialite
- Link tickets to authenticated users
- Provide user ticket history API and UI
- Maintain backward compatibility with existing ticket purchases

**Non-Goals:**
- Social login for other providers (Facebook, Twitter, etc.)
- User profile editing (name, avatar changes)
- Advanced ticket management (cancellations, transfers)
- Email verification system (can be added later)

## Decisions

### 1. Email/Password Authentication
**Decision**: Implement standard Laravel authentication with email/password login and registration.

**Rationale**: Basic authentication requirement. Uses Laravel's built-in auth scaffolding. Provides foundation for OAuth integration.

**Implementation**:
- Login page with email/password fields
- Registration page with name, email, password, password confirmation
- Use Laravel Sanctum for API token authentication
- Password hashing with bcrypt

### 2. OAuth Fields on Users Table
**Decision**: Add `google_id`, `provider`, `provider_avatar` columns to users table, make `password` nullable.

**Rationale**: Standard Socialite pattern. Users authenticated via OAuth don't need passwords. Maintains single users table.

**Alternatives considered**: 
- Separate `social_accounts` table (over-engineered for single provider)
- Separate `oauth_providers` table (unnecessary complexity)

### 3. Ticket-User Association
**Decision**: Add `user_id` foreign key to tickets table (nullable for backward compatibility).

**Rationale**: Simple direct relationship. Existing tickets remain unassociated. New tickets from authenticated users get linked.

**Alternatives considered**:
- Pivot table `user_tickets` (unnecessary for one-to-many)
- Polymorphic relationship (over-engineered)

### 4. Authentication Flow
**Decision**: Use Laravel Sanctum for API authentication after Socialite login.

**Rationale**: Sanctum provides simple token-based auth for SPAs. Already used in Laravel ecosystem.

**Alternatives considered**:
- Session-based auth (less suitable for API-first architecture)
- JWT tokens (more complex, Sanctum sufficient)

### 5. Ticket History API
**Decision**: Add `/api/user/tickets` endpoint returning paginated ticket history with event details.

**Rationale**: RESTful endpoint, includes event information for context. Paginated for performance.

## Risks / Trade-offs

- **Risk**: Google OAuth credentials not yet configured → **Mitigation**: Document setup in deployment guide
- **Risk**: Existing tickets won't have user associations → **Mitigation**: Accept orphaned tickets, optionally allow linking via email
- **Risk**: Frontend changes required for OAuth flow → **Mitigation**: Provide clear API documentation and example flows
- **Trade-off**: Nullable user_id means some tickets remain unlinked → **Acceptable** for gradual migration

## Migration Plan

1. Add OAuth columns to users table (backward compatible)
2. Add user_id foreign key to tickets table (nullable)
3. Deploy backend changes
4. Update frontend with OAuth flow
5. Test with existing data

## Open Questions

- Should we allow users to link existing tickets by email after OAuth login?
- Do we need admin interface to manage OAuth users?