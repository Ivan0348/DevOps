ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app

# Eerst kopiëren we de package.json en package-lock.json bestanden
COPY package*.json ./

# Daarna voeren we npm install uit
RUN npm install

# De rest is zoals je eerst deed
USER node
COPY . .
EXPOSE $DOCKERPORT
CMD ["npm", "start"]