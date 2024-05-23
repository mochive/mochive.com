FROM alpine:latest

RUN apk update && apk upgrade && apk add nodejs

WORKDIR /application

COPY build/. /application

RUN echo '{"type":"module"}' > package.json

ENTRYPOINT ["node", "."]