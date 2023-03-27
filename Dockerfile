# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app
COPY . .
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache --virtual .gyp \
  python3 \
  make \
  g++ \
  && npm ci --legacy-peer-deps \
  && apk del .gyp

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build
RUN sed -i -e "s/const path = require('path')/const path = require('path')\nrequire('dotenv').config()/g" ./.next/standalone/server.js



FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=deps /app/.next/standalone ./
COPY --from=deps /app/.next/static ./.next/static
COPY --from=deps /app/public ./public
COPY --from=deps /app/docker.env ./.env
RUN npm i dotenv
EXPOSE 25000
CMD ["node", "server.js"]
