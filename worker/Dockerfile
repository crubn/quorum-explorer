FROM node:18-alpine as base

WORKDIR /app
COPY package*.json /
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["node", "customServer.js"]
EXPOSE 3000