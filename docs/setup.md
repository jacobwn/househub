# Folder structure
## Components
- src/components: more general components that can be used in other projects
- src/app/components more project-specific components
## Contracts
- Holds zod schema and ts types derived from that
## Services
- "Put something in services/ only if it answers a “when X happens” question."
- "If the rule answers “should this happen?” instead of “is this valid?” — it belongs in the service."
- "Controllers validate input. Services decide behavior. Prisma persists data."
## Repositories
- "A repository is a thin layer that talks to the database and nothing else."
- "findUserByEmail This is not a service. It answers a data question, not a use-case question."

# Docker
- .override is for testing on local computer (not staging/prod)
- docker-compose.yaml is the base
## services/web (nextjs)
- In dev the services/web/ is just mounted into the docker container and "npm install" is run
- In prod (1) dep. built (2) node_modules copied in and app is built (3) files are copied into runner and nextjs server starts

# Nginx 
- Common file that dev/prod setting file extends
## Dev
- Mount the config files into the nginx containers file system 
- Nginx simply passes all requests to 3000 where the nextjs dev server sits
- No need for a dev Dockerfile
## Production
- Nextjs automatically makes a /_next/static/ folder on the command "next build" that can be served by nginx directly
- Dockerfile first has nextjs build /_next/static/ "AS builder" and then imports it into nginx

# Postgresql
- Don't need a Dockerfile/settings folder for neither dev nor prod
- Password/username/db is given directly in docker-compose in override (local machine) and through github secrets in prod/staging

# Git
- Deleted the auto-created git repo in services/web (nextjs) and made a monorepo in docker projects root

# Prisma
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

# Zod
- "Zod protects your system from the outside. TypeScript protects you from yourself."


# Vocabulary
- "A boundary is where data enters your system from something you do not fully control."
- "HttpError is basically your standardized way to represent errors that should be returned to the client with an HTTP status code."


Overriding an old github runner with a new one:
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




Setup to make github staging gi workflow file work:
- Make a new user in the staging droplet (that will run docker compose up)
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
- Add repo wide github secrets, STAGING_HOST (droplet ip), STAGING_USER (user named deploy)

ssh deploy@droplet_ip "mkdir -p ~/.ssh && chmod 700 ~/.ssh"
cat staging_key.pub | ssh user@droplet_ip "cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

ssh deploy@167.71.127.111 "mkdir -p ~/.ssh && chmod 700 ~/.ssh"
cat staging_key.pub | ssh deploy@167.71.127.111 "cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

Droplet:
ssh root@your_droplet_ip
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
Local:
cat staging_key.pub
nano /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh (or just do "sudo -u deploy for all commands)
ssh -i staging_key deploy@your_droplet_ip (test)



curl -X POST http://localhost:8080/api/houses \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main St",
    "price": 350000,
    "bedrooms": 3,
    "bathrooms": 2
  }'

  curl -X POST http://localhost:8080/api/houses \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main St",
    "price": 350000,
    "bedrooms": 3,
    "bathrooms": 2
  }'