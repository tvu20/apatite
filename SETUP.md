# Setup Guide

## References

https://vercel.com/kb/guide/nextjs-prisma-postgres

https://www.prisma.io/docs/guides/nextjs

## Initializing the App

1. Run `npx create-next-app@latest nextjs-prisma`
2. Push repo to Github
3. Deploy to Vercel
4. Create Postgres DB on Vercel
5. Install vercel with `npm i -g vercel@latest`
6. Pull environment variables into project with `vercel env pull .env`. Make sure the file is named .env

## Setting up Prisma

1. Install Prisma CLI with `npm install prisma --save-dev`
2. Create Prisma folder and initialize the `schema.prisma` file with some models.
3. Create the tables in the database with `npx prisma db push`
4. Add initial dummy data in `npx prisma studio`

## Setting up Prisma Client

1. Install Prisma Client with `npm install @prisma/client`
2. Update the Prisma Client with `npx prisma generate`
3. Create the `lib` folder and the `prisma.ts` file

## Setting up OAuth

1. Install NextAuth with `npm install next-auth@4 @next-auth/prisma-adapter`
2. Create a new OAuth app on Github. The auth callback URL should be `http://localhost:3000/api/auth`.
3. Add the generated id and secret to the .env file as GITHUB_ID and GITHUB_SECRET. Also set NEXTAUTH_URL to the same auth callback URL
4. Wrap the app with a SessionProvider
5. Add log in functionality!
6. When deploying auth to Vercel, create a second OAuth app on Github, with the auth callback URL being `https://APPNAME.vercel.app/api/auth/callback/github`
7. Add the following environment variables to Vercel: GITHUB_ID, GITHUB_SECRET, NEXTAUTH_URL, SECRET
