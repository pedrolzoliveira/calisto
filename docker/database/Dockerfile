FROM alpine:latest AS builder

WORKDIR /usr/src/app
RUN mkdir migrations
ADD src/infra/database/prisma/migrations migrations
COPY copy_sql_files.sh .

# RUN chmod +x copy_sql_files.sh
RUN sh copy_sql_files.sh

FROM postgres:latest AS runner

WORKDIR /docker-entrypoint-initdb.d

COPY --from=builder /usr/src/app/dest/*.sql ./


