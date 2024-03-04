FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN node build-scraper.js

FROM node:20 AS runner
WORKDIR /app
COPY --from=builder /app/dist/scraper /app
COPY --from=builder /app/node_modules/.prisma/client/libquery_engine* /app/
CMD [ "node", "run-scraper.js" ]
