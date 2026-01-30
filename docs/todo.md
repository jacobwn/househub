1. Set up prisma the same way as the first nextjs project ✅
2. Try out the api nextjs CRUD stuff ✅
3. Try out the layout.tsx to make a basic menu/footer (using <header>, <footer> etc.) ✅
4. Try out putting a new image in public/ and linking to it ✅
5. Set up ci/cd github pipeline (runner, environment, secrets) for staging. ✅
6. Set up so that the page can be reached from jacobvn.com (records pointing to the droplets ip and so on) ✅
7. Set up https ✅
8. Set up staging.jacobvn.com without -infra repo ✅
9. Set up staging.jacobvn.com with -infra repo ✅
9. Set up jacobvn.com production with cd workflow file 
10. Set up actual postgresql passwords/username and save in github secrets
11. Set up staging.jacobvn.com ✅
12. Set up jacobvn.com production with cd workflow file ✅
13. Set up 

## Set up auth without OAuth
### Flow with application layer -> services -> rich models -> repository
1. Make prisma tables for sessions and users
2. Decide basic invariants on the data state of the rows and what functions
    - Session:
    - 



### Flow
1. Make prisma tables for sessions and users
2. Set up account creation
    - Make simple account creating page (form with action to send data to account creating endpoint)
    - New row in user table
    - Email confirmation
        - (user table has isEmailVerified=false, create token in email_verification_token table, send email with token in url param, user clicks the link and site checks token against table, site reroutes to success page)
    - 
3. Set up login
    - Make simple login page (form with action to send data to login endpoint)
    - Confirm email/password
    - Create row in sessions table
    - Make a session id, session secret and csrf token and save in row
    - Make access jwt (user id, hashed session id, etc)
    - Make refresher/access/csrf cookies and add to http response
4. Set up accessing protected route on server
    - Middleware verifies access cookie and jwt and otherwise return error code or redirect
        - Get access and CSRF cookies
        - Confirm access cookies JWT and get session id and user id
        - (A) Confirm that session is active (look up hashed session id in session table)
        - (A) Look at the session and see that the session secret is the same as in the refresher cookie
        - (A) Look at the session and see that its CSRF token is the same as the one in CSRF cookie
        - Confirm that the role is correct
        - On missing cookie/not auth then redirect or give error code
    - page.tsx/route.ts handler function does auth again (using same functions) and uses user id to get role/user data
5. Set up /refresh route (it serves both refresh and access token)
    - Client sends GET request to /refresh
    - Get refresh and CSRF cookies
    - Do 4 A (confirm CSRF token and session id/secret)
    - Push forward the session expiration date in the session row
    - Create a new session secret and save it in the session row
    - Create new refresher/access cookies with new expire dates (also new session secret in refresher cookie) and attach to HTTP response
6. Client accesses protected route
    - Handles error codes to hit /refresh, and if that fails sends to login page/prints error message
7. Set up logout
    - Delete session row
    - Redirect to starting page
8. Set up password reset
    - Similar to confirmation email

### Data shape
User:
user id: uuidv7
email: email
name: string
is email verified: bool
hashed password: string
role: text

Session:
Is revoked: bool
Hashed session id: string
CSRF token: string
expires at: timestamp
created at: timestamp
user id or user table key

email_verification_tokens
-------------------------
id            uuid (pk)
user_id       uuid
token_hash    text
expires_at    timestamp
created_at    timestamp

password_reset_tokens
---------------------
id            uuid (pk)
user_id       uuid
token_hash    text
expires_at    timestamp
used          boolean
created_at    timestamp

### Invariants ()
User:
- 

### Implementation
- Refresher/access http-only cookies that can be refreshed on /refresh endpoint for refresher/access token (new ones, also updates session row)
- non-http only CSRF cookie issued once per session and stored in session row
- Client reads CSRF token from cookie with its JS and sends it to server in header on each request
- When doing auth then the server checks both the JWT cookie (checking client)
- Access token is jwt with user id being the main field and also session id to check if session is active
- Refresher token stores hashed session id, expiration date and session secret
- Set up middleware that checks access cookie and CSRF header on protected api/pages and adds user id/role to req object and redirects to login on fail
- Put protected pages under (protected)
- The middleware just re-routes to login page
- The rest of the page/api server logic is in the route handler functions (in app/dashboard/page.ts for example)
- Session table holds CSRF tokens and hashed refresher tokens and a flag that can be revoked and when session expires (can be refreshed), and a session secret that is refreshed when the refresher cookie is refreshed
- Logout is deleting the session row
- Login is creating new row in session table with csrf token and session id, and giving them to refresh/csrf cookie, and also giving refresh jwt cookie
- Create account is making a new row in the user table, and also doing the login stuff
- Email for confirming email (user table has isEmailVerified=false, create token in email_verification_token table, send email with token in url param, user clicks the link and site checks token against table)
- Email for resetting password (similar to confirmation email)
- Use an email provider (100 free per day) and you just specify sender(in env var)/receiver/message/subject
- The CSRF cookie has no expiration date and you just check if its session is still active
- Check both that the CSRF token has a session, and that the session id in the access cookie is that same session (in the auth functions that auth the cookies)

# Unstructured
- Set up function-only (the ones used by API behind the scenes (route handler functions)) integrated testing with in-memory db using the prisma schema
- Set up unit tests
- Set up ci workflow file that runs on push to any branch
- Change staging to only start on push to develop branch
- Make sure that prisma works in prod, applies the correct migrations, and make sure that the db-volume is unhurt
- Test that cerbot service actually
- Set up logging for prod/dev with pino
- Set up linting/static tests in ci
- Add manually triggered rollback workflow file



docker network create staging_network

POSTGRES_PASSWORD='[password]' docker compose -f docker-compose.db.staging.yaml up -d

