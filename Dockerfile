FROM node:17

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install

COPY . .

RUN npx tsc

EXPOSE 4000

CMD ["node", "build/src/lib/index.js"]