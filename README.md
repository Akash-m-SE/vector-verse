# Vector-Verse

<img src="https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Vector+Verse+Github+Readme/vector-verse.png" alt="Logo" width="400" height="400"/>

**Vector-Verse** is a Next.js web application designed to facilitate interaction with PDF documents through an intuitive chat interface. Users can create and manage projects by uploading PDFs, which are then processed to extract and analyze the content. Project details are securely stored in a database. The application features a comprehensive dashboard for users to view and manage their projects, and provides contextual responses to queries based on the content of the PDFs.

## Features 🌟

- **Dashboard:** Users can efficiently manage their projects through a personalized dashboard, allowing them to view, delete, and monitor the status of all their projects.

- **PDF Processing:** The application processes PDF files by extracting, cleaning, and chunking their content to generate vector embeddings, enhancing the ability to analyze and search the document's information.

- **Database Integration:** Vector embeddings and corresponding text chunks are stored in a PostgreSQL database, utilizing the pgvector extension to facilitate efficient vector similarity searches.

- **RAG-based Chat Interface:** Users can engage with their PDF content via an advanced conversational interface, which provides contextual responses based on vector similarity search, powered by a language model (LLM).

## Screenshots 📸

![App Screenshot](https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Vector+Verse+Github+Readme/Main+Page.jpg)

![App Screenshot](https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Vector+Verse+Github+Readme/Create+New+Project.jpg)

![App Screenshot](https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Vector+Verse+Github+Readme/Dashboard.jpg)

![App Screenshot](https://hosted-documents-akash.s3.eu-central-1.amazonaws.com/Vector-Verse/Vector+Verse+Github+Readme/Chat+Interface.jpg)

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

- You can also use the pgvector official image as your postgres image since it comes with postgres with pgvector installed . Check out the pgvector documentation here **https://github.com/pgvector/pgvector?tab=readme-ov-file#docker**

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

This will also let the app container to generate the prisma client, deploy the prisma migrations, connect to the Postgres instance and modify the "embedding" field of the "VectorEmbedding" table to have 512 dimensions. Then it starts the application in production mode.

**5.** Open your application via port - http://localhost:3000

##

**Docker (Standalone Containers)**

**1.** Git Clone the Repository

**2.** Navigate to the directory where the repository was downloaded

```
cd vector-verse
```

**3.** Install the Dependencies

```
pnpm install
```

**4.** Set up the [Environment Variables](#environment-setup)

**5.** Start the redis container locally

```
docker run -d --name vector-verse-redis -e REDIS_PASSWORD=mysecurepassword -p 6379:6379 redis
```

**6.** Now we need a postgres container with pgvector extension. For that we can go in 2 ways :-

<details>
 <summary><strong>Cloning a pgvector official image</strong></summary>

- Start the pgvector container locally
`     docker run --name vector-verse-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USERNAME=postgres -p 5432:5432 -d pgvector/pgvector:pg16
    `
</details>

<br>

<details>
<summary><strong>Cloning the postgres image and setting up pgvector inside it manually</strong></summary>

- Start the postgres container locally

  ```
  docker run --name vector-verse-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USERNAME=postgres -p 5432:5432 -d postgres
  ```

- Docker exec into the postgres container

  ```
  docker exec -it <postgres-container-id> /bin/bash
  ```

- Update and install git and other dependencies inside the postgres container

  ```
  apt-get update
  apt-get install -y git build-essential postgresql-server-dev-16
  ```

- Inside the container, install pgvector extension, more on this here :- **https://github.com/pgvector/pgvector**

  Linux and Mac

  Compile and install the extension (supports Postgres 12+)

  ```
  cd /tmp
  git clone --branch v0.7.3 https://github.com/pgvector/pgvector.git
  cd pgvector
  make
  make install # may need sudo
  ```

</details>

<br>

**7.** Apply db migrations and update the tables

- Generate the prisma client and apply the migrations via terminal

  ```
  pnpm prisma generate
  pnpm prisma migrate deploy
  ```

- Docker exec into the postgres container and log into the postgres instance

  ```
  psql -U postgres
  ```

- Install the vector extension

  ```
  CREATE EXTENSION IF NOT EXISTS vector;
  ```

- Update the "embedding" field of "VectorEmbedding" table to have 512 dimensions

  ```
  ALTER TABLE "VectorEmbedding" ALTER COLUMN "embedding" TYPE vector(512);
  ```

- Exit the postgres instance

  ```
  \q
  ```

- Exit the postgres container
  ```
  \exit
  ```

**8.** Start the application in development mode

```
pnpm dev
```

or in production mode

```
pnpm start
```

**9.** Open your application via port - http://localhost:3000

## Authors ✍️

- [Akash](https://github.com/Akash-m-SE)

## Tech Stack 💻

**Language:** TypeScript

**Frontend:** Next.js, HTML, TailwindCSS, React Hook Form, Zod, shadcn/ui, Aceternity UI

**Backend:** Node.js, BullMQ, Redis, pdf2json, pgvector, LangChain

**Authentication:** NextAuth.js

**Database:** PostgreSQL, Prisma, Supabase

**Cloud Storage:** AWS S3

**Machine Learning / NLP:** TensorFlow, Universal-Sentence-Encoders

**Containerization:** Docker
