#!/bin/sh
# just try connecting to DB, but don't push anything
until npx prisma db execute --raw "SELECT 1"; do
  echo "Waiting for DB..."
  sleep 2
done

npx prisma migrate deploy
npm run start