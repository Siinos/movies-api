# --------------> The build image
FROM node:16.17.1-bullseye-slim
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build:prod

# --------------> The production image
FROM node:16.17.1-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
COPY .env.example ./.env
COPY database ./database
USER node
COPY --chown=node:node . /dist
EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]
