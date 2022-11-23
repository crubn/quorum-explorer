FROM node:16-slim AS build

# Create and change to the app directory.
WORKDIR /usr/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY tsconfig.json ./
COPY . ./
COPY prod.env ./.env

RUN npm run build

FROM node:16-slim

WORKDIR /usr/app
COPY package.json ./
COPY config.json ./
RUN npm install --production --legacy-peer-deps
COPY --from=build /usr/app/dist dist

EXPOSE 3000

# Run the web service on container startup.
CMD [ "node", "./dist/index.js" ]