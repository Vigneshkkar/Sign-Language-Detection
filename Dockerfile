FROM node:16-alpine

WORKDIR /usr/src/app

# COPY package*.json ./

RUN yarn add serve

COPY build/ build/
# RUN REACT_APP_STAGE=production yarn build

EXPOSE 8080

CMD ["yarn","serve", "-s", "-C", "-l", "8080", "build"]