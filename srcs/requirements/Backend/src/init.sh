#!/bin/sh

npm install &&  npx prisma migrate dev --name dev --preview-feature
exec "$@"