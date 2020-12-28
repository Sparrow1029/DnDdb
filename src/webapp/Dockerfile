# pull official base image
FROM node:15.3.0-alpine

# set working directory
WORKDIR /usr/src/webapp

# install app dependencies
# COPY package.json ./
# COPY package-lock.json ./

# add app
COPY . ./
RUN npm install && npm cache clean --force

# add node_modules/.bin to $PATH
ENV PATH /usr/src/webapp/node_modules/.bin:$PATH

# Did we copy 'public' or 'node_modules' directory?
RUN ls -lA node_modules/.bin

# start app
CMD npm run dev