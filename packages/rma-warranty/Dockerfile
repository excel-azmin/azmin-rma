FROM node:16
# Copy and build server
COPY . /home/arcapps/rma-warranty
WORKDIR /home/arcapps/
RUN cd rma-warranty \
    && npm install \
    && npm run build -- --prod

FROM nginx:latest

COPY --from=0 /home/arcapps/rma-warranty/www /var/www/html
COPY ./docker/nginx-default.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./docker/docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
