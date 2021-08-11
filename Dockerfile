FROM node:16-buster
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get --yes --force-yes install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb


RUN gcc --version
RUN node -v
RUN npm -v

ENTRYPOINT "bin/startup"
