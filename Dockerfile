FROM node:18-alpine as dependencies
WORKDIR /app
COPY package.json ./
RUN npm install --save --legacy-peer-deps
FROM node:18-alpine as builder
ARG DATABASE_URL=""
ENV DATABASE_URL=$DATABASE_URL
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine as deploy
WORKDIR /app
ENV NODE_ENV production
ENV TZ Asia/Kuala_Lumpur

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
