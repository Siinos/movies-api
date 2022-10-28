# --------------> The build image
FROM node:16.17.1-bullseye-slim AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build:prod
RUN npm install --only=production

# --------------> The production image
FROM node:16.17.1-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env ./.env
COPY --chown=node:node --from=build /usr/src/app/database ./database
USER node
EXPOSE 8080
CMD [ "sh", "-c", "node -r dotenv/config dist/index.js" ]
