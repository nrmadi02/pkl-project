FROM node:18-alpine as dependencies
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma
RUN npm install --save --legacy-peer-deps

FROM node:18-alpine as builder
ARG ARG_DATABASE_URL
ENV DATABASE_URL=$ARG_DATABASE_URL
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

# debug
RUN echo "DATABASE_URL=$DATABASE_URL"
RUN echo "NEXTAUTH_URL=$NEXTAUTH_URL"

FROM node:18-alpine as deploy
WORKDIR /app
ENV NODE_ENV production
ENV TZ Asia/Kuala_Lumpur

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
