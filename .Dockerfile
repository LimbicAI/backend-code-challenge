FROM node:16.15.0-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci --only=production
COPY . .
RUN npm run tsc
CMD [ "npm", "start" ]
EXPOSE 8000
ENTRYPOINT PORT=8000 NODE_ENV=production node app.js