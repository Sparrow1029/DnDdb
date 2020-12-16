# pull official base image
FROM node:15.3.0-alpine

# set working directory
WORKDIR /usr/src/webapp

# add node_modules/.bin to $PATH
ENV PATH /usr/src/webapp/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install && npm cache clean --force

# add app
COPY . ./
# Did we copy 'public' or 'node_modules' directory?
RUN ls -lA

# start app
CMD npm run dev
