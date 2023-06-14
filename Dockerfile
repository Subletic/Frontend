#############
### build ###
#############

# base image
FROM node:19.5.0-alpine as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli

# add app
COPY . /app

# generate build
RUN ng build

############
### prod ###
############

# base image
FROM nginx:1.25.0

# copy artifact build from the 'build environment'
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
