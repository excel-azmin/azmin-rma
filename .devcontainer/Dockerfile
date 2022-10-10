FROM node:16

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Configure dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get upgrade -y && apt-get install -y apt-utils git procps sudo

# Add user to sudoer group
RUN usermod -G sudo $USERNAME \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Install dev tools
RUN npm i -g @nestjs/cli@7.5.4 @angular/cli@11.0.7 lerna@3.22.1

ENV DEBIAN_FRONTEND=dialog

# Set the default shell to bash instead of sh
USER $USERNAME
ENV SHELL /bin/bash

CMD [ "tail", "-f", "/dev/null" ]
