#!/bin/sh
# line endings must be \n, not \r\n !

CONFIG=`cat ./config/config.json`
WORKER_ENV=`cat ./worker/prod.env`
echo "$WORKER_ENV" > ./worker/docker.env
echo -n $'\nCONFIG_STRING=' >> ./worker/docker.env
echo "$CONFIG"|tr '\n' ' ' >> ./worker/docker.env

NEXTJS_ENV=`cat ./.env.production`
echo "$NEXTJS_ENV" > ./docker.env
echo -n $'\nCONFIG_STRING=' >> ./docker.env
echo "$CONFIG"|tr '\n' ' ' >> ./docker.env


docker-compose --env-file ./.env.production up $1