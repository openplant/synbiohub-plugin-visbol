FROM node:14

COPY dist .

EXPOSE 5012

CMD [ "node", "./server.js" ]
