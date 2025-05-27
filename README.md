This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Locally

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
You can start editing the page by modifying `app/page.tsx`. The page will auto-refresh as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker Setup

We provide a Docker Compose setup to run both the Next.js frontend and PocketBase backend together.

1. **Create `docker-compose.yml`** in the project root (already included):

   ```yaml
   version: '3.8'

   services:
     nextjs:
       build: .
       ports:
         - '3000:3000'
       depends_on:
         - pocketbase
       environment:
         - NEXT_PUBLIC_POCKETBASE_URL=http://pocketbase:8090
       volumes:
         - .:/app
       command: npm run dev

     pocketbase:
       image: ghcr.io/muchobien/pocketbase:latest
       container_name: pocketbase
       restart: unless-stopped
       ports:
         - '8090:8090'
       volumes:
         - ./pb_data:/pb/pb_data
       command: ['serve', '--http=0.0.0.0:8090', '--dir=/pb/pb_data']
   ```

2. **Create `Dockerfile`** for Next.js in the project root (already included):

   ```dockerfile
   # Stage 1: Build the application
   FROM node:18-alpine AS builder

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .
   RUN npm run build

   # Stage 2: Run the application
   FROM node:18-alpine

   WORKDIR /app

   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json

   EXPOSE 3000

   CMD ["npm", "start"]
   ```

3. **Start Services**

   ```bash
   docker-compose up --build -d
   ```

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - PocketBase Admin UI: [http://localhost:8090/_/](http://localhost:8090/_/)

4. **Create a PocketBase Superuser**

   ```bash
   docker exec -it pocketbase ./pocketbase superuser upsert admin@example.com YourStrongP@ssw0rd
   ```

   Replace `admin@example.com` and `YourStrongP@ssw0rd` with your desired credentials.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
