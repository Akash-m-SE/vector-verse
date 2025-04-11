FROM node:20.11.1-alpine3.19

RUN npm install pnpm --global
RUN pnpm config set store-dir ~/.pnpm-store

# Install PostgreSQL client tools
RUN apk update && apk add --no-cache postgresql-client

WORKDIR /app

COPY . .

RUN pnpm install
RUN pnpm prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm start"]