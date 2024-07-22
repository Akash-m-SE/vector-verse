FROM node:20.11.1-alpine3.19

# Install PostgreSQL client tools
RUN apk update && apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

# Installing dependencies for npm packages, linux OS, sharp for Nextjs and others
RUN npm install --cpu=x64 --os=linux --libc=glibc sharp

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]