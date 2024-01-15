#############
### build ###
#############

# base image
FROM node:lts-alpine as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install

# add app
COPY . /app

# generate build
RUN ng build --configuration=production

############
### prod ###
############

# base image
FROM nginx:1.25.0

# copy artifact build from the 'build environment'
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# copy nginx configuration files
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./ssl/self-signed.conf /etc/nginx/snippets/self-signed.conf
COPY ./ssl/ssl-params.conf /etc/nginx/snippets/ssl-params.conf

# copy ssl certificate files
COPY ./ssl/nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt
COPY ./ssl/nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
COPY ./ssl/dhparam.pem /etc/nginx/dhparam.pem

# expose port 80 and 443
EXPOSE 80
EXPOSE 443

# run nginx
CMD ["nginx", "-g", "daemon off;"]
