FROM node:14

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
RUN yarn build

# Bundle app source
COPY . .

EXPOSE 5000

CMD [ "yarn", "start" ]