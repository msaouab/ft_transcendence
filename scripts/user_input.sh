#!/bin/bash
# Colors
RED='\033[0;31m'
ED='\033[0m'
GREEN='\033[0;32m'
BOLD='\033[1m'
HOST=`hostname`

echo -e "${RED}${BOLD}Make sure you did setup in your Intra the redirect URI to http://${HOST}:3000/api/v1/login/42/return $ED"  
echo -e "${RED}${BOLD}You can access to the website from: http://${HOST}:5173 $ED"  
sleep 2 
if grep -q "FORTYTWO_CLIENT_ID=UID" ./srcs/requirements/Backend/src/db-env-example; then \
    read -p "From Intra enter the UID: " uid;\
    sed -i '' "s/FORTYTWO_CLIENT_ID=UID/FORTYTWO_CLIENT_ID="$uid"/g" ./srcs/requirements/Backend/src/db-env-example;\
    echo -e "${GREEN}${BOLD}FORTYTWO_CLIENT_ID changed successfully $ED";\
fi

if grep -q "FORTYTWO_CLIENT_SECRET=SECRET" ./srcs/requirements/Backend/src/db-env-example; then \
    read -p "From Intra enter the SECRET: " s;\
    sed -i '' "s/FORTYTWO_CLIENT_SECRET=SECRET/FORTYTWO_CLIENT_SECRET="$s"/g" ./srcs/requirements/Backend/src/db-env-example;
    echo -e "${GREEN}${BOLD}FORTYTWO_CLIENT_SECRET changed successfully $ED";\
fi
