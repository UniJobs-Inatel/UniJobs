FROM node:20

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn add --dev bcrypt --build-from-source

RUN yarn build

COPY docs ./docs

EXPOSE 4000

CMD ["node", "--inspect=0.0.0.0:9229", "dist/main"]