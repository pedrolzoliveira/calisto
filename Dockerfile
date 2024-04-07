FROM node:20-alpine3.18 AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN node build-app.js

FROM node:20-alpine3.18 AS app
WORKDIR /app
COPY --from=builder /app/dist /app