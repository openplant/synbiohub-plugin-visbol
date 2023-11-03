FROM node:14

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

EXPOSE 5012

CMD [ "yarn", "start" ]
