FROM node:lts-alpine

WORKDIR /application

COPY build/. /application

RUN echo '{"type":"module"}' > package.json

ENTRYPOINT ["node", "."]