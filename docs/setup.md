# Folder structure
## src/
- "This is the actual brain of your app, independent of Next.js."
## src/components and src/app/components
- React components
- src/components: more general components that can be used in other projects
- src/app/components more project-specific components
## src/contracts
- Holds zod schema and ts types derived from that
## Services
- The orchestration code that sit at the entry point
"Controllers are the “entry points” of your app."
"Receive external input/Translate it into something your core logic understands/Call services / use-cases/Translate the result back to an external response"
- "Put something in services/ only if it answers a “when X happens” question."
- "If the rule answers “should this happen?” instead of “is this valid?” — it belongs in the service."
- "Controllers validate input. Services decide behavior. Prisma persists data."
## Repositories
- See principles -> repositories
## lib/api
"API clients / integrations (lib/api/)
Classes or functions that wrap external APIs.
Example: StripeClient.ts, SendgridClient.ts, GithubApi.ts.
These are sometimes grouped inside services/ if they’re part of a larger flow."

# Principles
## Domain
- Seems to be all the non-changing business requirements ("needs to set up bank accounts") and the more specific invariants ("an accounts money cant be negative")
## Naming wisdom
"Name by intent, not mechanics
Mechanically, it creates a handler
Intentionally, it standardizes error handling"
## try/catch errors
- Service errors should not have HTTP error codes, they should be separate from the HTTP stuff. Better: 
if (err.code === "AUTH_TOKEN_EXPIRED") {
  throw new HttpError(401, "Session expired");
}
"Errors should be catchable by type
Not by message.
Bad:
throw new Error("permission denied")
Good:
throw new PermissionDeniedError()"
"A service error should describe what went wrong in the process, not how the outside world should react."
## Stub and mock repo
- Stub has hardcoded reply, "loadByEmail: (email: string) => ({ id: "1", email })"
- Mock also does some logging, like adding the member function "save: (user) => calls.push(user) "
## In-memory and sql repo
- You usually do all twice for each repo, so each repo has a function makeUser()
## Passing repository when creating a service object
- The repository represents how the internal db stuff is solved (so the sql version of the repo has different code for makeUser() than the in-memory version)
- The service object (like authService for the service flow) is what uses the repository (rich models don't)
- So you can change which db is used by passing a different repo
## Anemic Domain
"Entities are basically just data containers (like structs or simple classes), and all business logic lives in services."
## Application layer -> services -> aggregate -> repository flow
- Application layer does the main orchestration "generally does not contain business logic itself"
- Services are per flow, not by tables and can touch multiple tables. Example AuthService. They create/use/save aggregates/rich models (crate/save is done by calling repo). They are usually stateless. "Delegates creation, modification, and persistence to aggregates and repositories."
- Rich models represents a db tables row and holds state and enforces invariants 
- The repository hides the inner workings of the db "The repository is just plumbing: load & persist". "Provides methods like load, save, or delete."
"Why it often saves work later
Once the structure is in place:
Invariants are consistently enforced → fewer bugs
Adding new flows is easier → you reuse aggregates and services
Refactoring is safer → your models encapsulate rules"
## Rich models
"A rich model is basically the combination of three things for a row/entity:
State – the current values of the row (fields/data).
Actions – all the allowed ways to change that state.
Domain invariants – the rules that must always hold true, no matter what actions are taken."

- Aggregate/rich model is a matter of how much responsibility they have. Rich models draw the lines at db tables, aggregates at groups of invariants
- The opposite is anemic models that is just a class where each member variable is just the db-column
"Owns business rules, methods to mutate state safely"
"user.canLogin(), user.verifyEmail(), session.refresh()"
"A rich model is just a smart container for state: it doesn’t fetch or save data itself, it just operates on whatever state you give it."
- If it needs more data then the service passes it when using the rich model member method

## Invariants/flow
- You can write guards in the code that act as the invariants documentation
"Invariants define valid states
Flows define allowed transitions between those states"
“I design the state space with invariants first, then derive flows as valid transitions between those states.”
"These three are where “obvious” bugs cost real money.
Auth, billing, permissions?
Write it down."
## Invariants vs business logic
"“Could the product team decide this should be different?”
If yes → business logic
If no → invariant"
### Invariants
- A revoked session cannot authenticate
- An unverified user cannot log in
- Every authenticated request must map to an active session
### Business logic
- Session expires after 30 days
- Refresh tokens last 7 days
- User can have up to 5 concurrent sessions
- Admins bypass MFA
## Aggregate
- Is the class that enforces the invariants
- Can be created and written to db, or created from db, used, then written back to db
"Encapsulates state + invariants"
"Methods enforce rules: e.g., session.refresh(), user.verifyEmail()"
"Operates at the business-logic level, unaware of database internals"
"May be transient — exists in memory only while you perform operations"
"User clicks "refresh session" → API handler
          │
          ▼
Load session aggregate from repository
          │
          ▼
Call session.refresh() → invariants enforced
          │
          ▼
Repository saves updated session back to DB
          │
          ▼
DB now reflects new state"
## DB repository
- A class that has functions that hide the internal prisma (or other internal db code)
- Methods like addUser() and saveUser()
"The aggregate is where the rules live
The repository is just plumbing: load & persist
The DB has no logic — it’s dumb storage" 
"Keeps database access logic separate from business logic, letting aggregates stay focused on invariants."
## Services 
"Services group operations by meaningful flows, not by tables."
"Examples: AuthService, PurchaseService, OrderService."
"They coordinate multiple tables / models:
AuthService.login() might touch users, sessions, password_reset_tokens"
"login(email, password)"
## Learn
- Aggregate root, seems to be how the aggregate class 
- A common way seem to be have application level do the main orchestration, have it call flow-related service object (AuthService, PurchaseService , etc.), the flow-related creates/uses/saves an aggregate object. See code example A.
## Script, crud, services, rich models, aggregates


# Tech stack
## Docker
- .override is for testing on local computer (not staging/prod)
- docker-compose.yaml is the base
### services/web (nextjs)
- In dev the services/web/ is just mounted into the docker container and "npm install" is run
- In prod (1) dep. built (2) node_modules copied in and app is built (3) files are copied into runner and nextjs server starts

## Nginx 
- Common file that dev/prod setting file extends
### Dev
- Mount the config files into the nginx containers file system 
- Nginx simply passes all requests to 3000 where the nextjs dev server sits
- No need for a dev Dockerfile
### Production
- Nextjs automatically makes a /_next/static/ folder on the command "next build" that can be served by nginx directly
- Dockerfile first has nextjs build /_next/static/ "AS builder" and then imports it into nginx

## Postgresql
- Don't need a Dockerfile/settings folder for neither dev nor prod
- Password/username/db is given directly in docker-compose in override (local machine) and through github secrets in prod/staging

## Git
- Deleted the auto-created git repo in services/web (nextjs) and made a monorepo in docker projects root

## Prisma
https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres:
- npm install prisma @types/node @types/pg --save-dev 
- npm install @prisma/client @prisma/adapter-pg pg dotenv
- Make the prisma config file
- househub/services/web$ npx prisma init
- Add schema to web/prisma/schema.prisma
- "househub/services/web$ npx prisma generate" this gives a prisma client on the local machine (gets copied over in dev)
- make a __prisma global var that will hold the prisma client for dev (so that it doesn't spam new prisma clients)
- make a src/lib/prisma.ts that creates the running instance of prisma
- add prisma schema to web/prisma/schema.prisma
- generate prisma client
- start Docker containers and exec into it (docker exec -it househub-web-1 sh) and do "npx prisma migrate dev --name init"
- import the prisma client maker from src/lib/prisma.ts when prisma is needed

## Zod
- "Zod protects your system from the outside. TypeScript protects you from yourself."

## GitHub Action workflows
### Current setup
- One workflow for staging that run on each push
  - Copy the repo files
  - Connect to github image registry
  - Build/push nginx and nextjs server images
  - Connect to staging droplet
    - Get docker-compose files from repo
    - pull nginx/nextjs images
    - Build containers
- One workflow for production that run on pushing version
### Basics
- All in .github/workflows/ gets read and run
- You can have workflows that run regularly (for example every 10 min)


# Vocabulary
- "A boundary is where data enters your system from something you do not fully control."
- "HttpError (an error class) is basically your standardized way to repr
esent errors that should be returned to the client with an HTTP status code."


# Flows
## Remove tags
- Tags need to be removed both locally and on origin
- Just pushing to origin does not affect tags
git tag -d v1.0
git push origin --delete v1.0

## Log in to ghcr.io on docker
- Get a PAT (personal access token) from github (it is the password to log into ghcr.io)
- Log into Docker on the production server (the deploy user needs to be the one that runs "docker login ghcr.io)
sudo -u deploy bash -c 'echo "[PAT]" | docker login ghcr.io -u jacobwn --password-stdin'
- Test to log in on the production server
sudo -u deploy docker login ghcr.io

## Squash a local branch
- Create a temporary orphaned branch
git checkout --orphan temp-branch
- Stage all the files
- Do an initial commit
- Delete the old main branch and rename the orphaned branch to main
git branch -D main
git branch -m main
- Force push to origin
git push -f origin main

## Add a new cron job
- crontab -l to view cron jobs
- crontab -u to add cron jobs
## Set up HTTPS certificates
- Create certificates on the droplet
  ```bash
  sudo docker run -it --rm --name certbot \
    -p 80:80 \
    -v "/srv/househub-data/certs/letsencrypt:/etc/letsencrypt" \
    certbot/certbot certonly
  ```
- Mount the certificate folder into the nginx container
- Set up cron job that regularly looks for a new certificate (see other flow)

## Overriding an old github runner with a new one:
- Stop the systemd service:
sudo systemctl stop githubrunner.service
- Remove the old action-runner folder
- Use github instruction to get a new action-runner folder
sudo -i -u githubrunner [command]
- Make it so that the runner user owns the action-runner folder
sudo chown -R githubrunner:githubrunner /home/githubrunner/actions-runner
- Register the runner with github
- Start the runner again
sudo systemctl start githubrunner.service

## Connect GitHub Actions workflow to GitHub Packages (image registry)
- Make a PAT (personal access token) on github
- But it into a repo-side secret called GHCR_PAT
- Use the secret in the Actions workflow (password: ${{ secrets.GHCR_PAT }})

## Setting up connection between droplet and GitHub Actions workflow
### overview 
You get a ssh private/public pair and put the public one on the droplet, and give github secret the private one
- Make a ssh private/public pair
- Give public key to droplet user that will run "docker compose up" (usually called "deploy")
- Give private key to github secret
- Use secret when connecting to droplet in github actions workflow (key: ${{ secrets.STAGING_SSH_KEY }})
### Steps
### Droplet:
- Make the user that Actions will run as
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
####  Local:
- Create a ssh pair (should later be deleted), N is for extra password
ssh-keygen -t ed25519 -f ./key -C "prod server" -N ""
- The above creates a key pair in the current folder
#### Droplet:
ssh root@your_droplet_ip
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
####  Local:
cat staging_key.pub
####  Droplet:
nano /home/deploy/.ssh/authorized_keys
- Paste in the public key
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh (or just do "sudo -u deploy for all commands)
- Do the following in the folder where you made the ssh pair (local computer) to test
ssh -i staging_key deploy@your_droplet_ip (test)
#### Github:
- Make a secret called PROD_SSH_KEY
## Set up [appname]-infra folder
- Create a repo named [appname]-infra
- Have it be a separate folder named [appname]-infra
- Create a folder named /srv/[appname]-infra that the deploy user owns
sudo mkdir /srv/househub-infra
sudo chown deploy:deploy /srv/househub-infra
- Set up deploy key on github so that the server can pull from github
sudo -u deploy ssh-keygen -t ed25519 -C "deploy@househub-staging-sfo2"
udo -u deploy ssh -T git@github.com
- Do an initial clone of the repo into the srv folder
root@househub-prod-sfo2:/srv# sudo -u deploy git clone git@github.com:jacobwn/househub-infra.git
- Log in to ghcr (image registry) manually through docker and it will keep logged in
echo "[PAT (personal access token)]" | docker login ghcr.io -u jacobwn --password-stdin

## Make a local and remote tag
git tag -a v0.0.10 -m "Test version 0.0.10" 0066a7d
git tag -a v0.0.11 -m "Test version 0.0.11"
git push origin v0.0.11

## Remove a local and remote tag
git tag -d v0.0.1
git push origin --delete v0.0.1
