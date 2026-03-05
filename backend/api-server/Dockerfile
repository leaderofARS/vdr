FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache openssl python3 make g++

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && npx prisma generate

COPY src ./src/

RUN addgroup -g 1001 -S nodejs && \
    adduser -S vdr -u 1001 && \
    chown -R vdr:nodejs /app

USER vdr

EXPOSE 3001

CMD ["/bin/sh", "-c", "echo '[STARTUP] Container started' && npx prisma migrate deploy && echo '[STARTUP] Migration done' && node src/server.js"]