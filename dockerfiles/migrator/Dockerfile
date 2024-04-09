FROM node:20-alpine3.18
WORKDIR /app
COPY /src/infra/database/prisma/schema.prisma ./schema.prisma
COPY /src/infra/database/prisma/migrations ./migrations
RUN yarn add prisma