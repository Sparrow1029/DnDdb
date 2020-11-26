# pull official base image
FROM node:15.3.0-alpine

# set working directory
WORKDIR /webapp

# add node_modules/.bin to $PATH
ENV PATH /webapp/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

# start app
CMD npm run dev
