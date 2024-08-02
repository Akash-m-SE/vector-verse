# Vector-Verse

<img src="https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/vector-verse.png" alt="Logo" width="400" height="400"/>

**Vector-Verse** is a Next.js web application designed to facilitate interaction with PDF documents through an intuitive chat interface. Users can create and manage projects by uploading PDFs, which are then processed to extract and analyze the content. Project details are securely stored in a database. The application features a comprehensive dashboard for users to view and manage their projects, and provides contextual responses to queries based on the content of the PDFs.

## Features 🌟

- **Dashboard:** Users can efficiently manage their projects through a personalized dashboard, allowing them to view, delete, and monitor the status of all their projects.

- **PDF Processing:** The application processes PDF files by extracting, cleaning, and chunking their content to generate vector embeddings, enhancing the ability to analyze and search the document's information.

- **Database Integration:** Vector embeddings and corresponding text chunks are stored in a PostgreSQL database, utilizing the pgvector extension to facilitate efficient vector similarity searches.

- **RAG-based Chat Interface:** Users can engage with their PDF content via an advanced conversational interface, which provides contextual responses based on vector similarity search, powered by a language model (LLM).

## Screenshots 📸

![App Screenshot](https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Main+Page.jpg)

![App Screenshot](https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Create+New+Project.jpg)

![App Screenshot](https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Dashboard.jpg)

![App Screenshot](https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Chat+Interface.jpg)

## Deployment 🚀

You can access the live version of Vector-Verse here: [Live Demo](https://vector-verse.vercel.app/)

## Environment Setup 🛠️ {#environment-setup}

To run this project, you will need to add the following environment variables to your .env file (a template has been provided as .env.example)

`DATABASE_URL`

`POSTGRES_USER` `POSTGRES_PASSWORD` `POSTGRES_HOST` `POSTGRES_PORT` `POSTGRES_DB`

`NEXTAUTH_SECRET`

`GOOGLE_CLIENT_ID` `GOOGLE_CLIENT_SECRET`

`AWS_S3_REGION` `AWS_S3_ACCESS_KEY_ID` `AWS_S3_SECRET_ACCESS_KEY` `AWS_S3_BUCKET_NAME`

`REDIS_HOST`
`REDIS_PORT`
`REDIS_PASSWORD`

`GROQ_API_KEY`

**Note :-**

- When using postgres in cloud you only need the `DATABASE_URL`, but for postgres via docker-compose or as a standalone container, you would need all of the postgres credentials **(more information in .env.example)**.

- If you are using postgres as a standalone container, then you would need to install the pgvector extension inside your docker container. Check out the pgvector documentation here - **https://github.com/pgvector/pgvector**

## Installation 🔧

**Docker-Compose**

**1.** Git Clone the Repository

**2.** Navigate to the directory where the repository was downloaded

```
cd vector-verse
```

**3.** Set up the [Environment Variables](#environment-setup)

**4.** Dockerize the application and start up the containers for postgres, redis and the application itself.

```
docker-compose up
```

This will also make postgres to install dependencies. Wait for the dependencies to get installed in postgres.

Once all the dependencies have been installed, postgres container will automatically stop **_(yes i know this is an issue which i am currently looking into)_**

**5**. Start the postgres container manually from Dockerhub or run this command to start all the containers

```
docker-compose start
```

This will make the app container to deploy the prisma migrations, connect to the Postgres instance and modify the "embedding" field of the "VectorEmbedding" table to have 512 dimensions. Then it starts the application in development mode.

**6.** Open your application via port - http://localhost:3000

##

**Docker (Standalone Containers)**

**1.** Git Clone the Repository

**2.** Navigate to the directory where the repository was downloaded

```
cd vector-verse
```

**3.** Install the Dependencies

```
npm install
```

**4.** Set up the [Environment Variables](#environment-setup)

**5.** Start the redis container locally

```
docker run -d --name vector-verse-redis -e REDIS_PASSWORD=mysecurepassword -p 6379:6379 redis
```

**6.** Start the postgres container locally

```
docker run --name vector-verse-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USERNAME=postgres -p 5432:5432 -d postgres
```

**7.** Docker exec into the postgres container

```
docker exec -it <postgres-container-id> /bin/bash
```

**8.** Update and install git and other dependencies inside the postgres container

```
apt-get update
apt-get install -y git build-essential postgresql-server-dev-16
```

**9.** Inside the container, install pgvector extension, more on this here :- **https://github.com/pgvector/pgvector**

Linux and Mac

Compile and install the extension (supports Postgres 12+)

```
cd /tmp
git clone --branch v0.7.3 https://github.com/pgvector/pgvector.git
cd pgvector
make
make install # may need sudo
```

**10.** Apply the migrations in the application

```
npx prisma migrate deploy
```

**11.** Docker exec into the postgres container and log into the postgres instance

```
psql -U postgres
```

Install the vector extension

```
CREATE EXTENSION IF NOT EXISTS vector;
```

Update the "embedding" field of "VectorEmbedding" table to have 512 dimensions

```
ALTER TABLE "VectorEmbedding" ALTER COLUMN "embedding" TYPE vector(512);
```

**12.** Exit the postgres instance

```
\q
```

Exit the postgres container

```
\exit
```

**13.** Start the application in development mode

```
npm run dev
```

**14.** Open your application via port - http://localhost:3000

## Authors ✍️

- [Akash](https://github.com/Akash-m-SE)

## Tech Stack 💻

**Language:** TypeScript

**Frontend:** Next.js, HTML, TailwindCSS, React Hook Form, Zod, shadcn/ui, Aceternity UI

**Backend:** BullMQ, Redis, pdf2json, pgvector, LangChain

**Authentication:** NextAuth.js

**Database:** PostgreSQL, Prisma

**Cloud Storage:** AWS S3

**Machine Learning / NLP:** TensorFlow, Universal-Sentence-Encoders

**Containerization:** Docker
