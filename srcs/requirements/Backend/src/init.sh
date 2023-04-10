#!/bin/sh

until pg_isready -h $DATABASE_HOST -p 5432 -U $POSTGRES_USER
do
  echo "$(date) - waiting for database to start"
  sleep 2
done


npm install
npx prisma migrate dev --name dev --preview-feature
npx prisma generate
npx prisma db seed

exec "$@"
