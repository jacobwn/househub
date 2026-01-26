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
## Log in to ghcr.io on docker
- Get a PAT (personal access token) from github (it is the password to log into ghcr.io)
- Log into Docker on the production server (the deploy user needs to be the one that runs "docker login ghcr.io)
sudo -u deploy bash -c 'echo "[PAT]" | docker login ghcr.io -u jacobwn --password-stdin'
- Test to log in on the production server
sudo -u deploy docker login ghcr.io

## Squash a local branch
- Create a temporary orphaned branch
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


git tag -a v0.0.6 -m "Release version 0.0.6"
git push origin v0.0.6

