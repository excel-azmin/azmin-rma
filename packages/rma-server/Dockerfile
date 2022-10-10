FROM node:latest
# Copy app
COPY . /home/arcapps/rma-server
WORKDIR /home/arcapps/
RUN cd rma-server \
    && npm install \
    && npm run build \
    && rm -fr node_modules \
    && npm install --only=production

FROM node:slim

# Install packages
RUN apt-get update && apt-get install -y gettext-base && apt-get clean

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Add non root user
RUN useradd -ms /bin/bash arcapps
WORKDIR /home/arcapps/rma-server
COPY --from=0 /home/arcapps/rma-server .

RUN chown -R arcapps:arcapps /home/arcapps

# set project directory
WORKDIR /home/arcapps/rma-server

# Expose port
EXPOSE 8800

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
