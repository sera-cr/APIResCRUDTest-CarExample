FROM node:20
# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./

COPY prisma ./prisma/

COPY .env ./

RUN npm install

ENV STATUS=production

RUN npx prisma generate

# Bundle app source
COPY . .

RUN npm run build:prod

# Port 3000 because it is specified in .env
# and the app binds to this port.
EXPOSE 3000