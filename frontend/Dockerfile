FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    curl \
    aws-cli

RUN mkdir -p /root/.aws

COPY config /root/.aws/config
COPY credentials /root/.aws/credentials

RUN chmod 600 /root/.aws/credentials && \
    chmod 644 /root/.aws/config

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV HTTPS=true
ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
