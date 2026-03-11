FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl python3 make g++
COPY package*.json ./
COPY prisma.config.js ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
COPY src ./src/
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vdr -u 1001 && \
    chown -R vdr:nodejs /app
USER vdr
EXPOSE 3001
CMD ["/bin/sh", "-c", "echo '[STARTUP] Generating Prisma client...' && npx prisma generate && echo '[STARTUP] Prisma client ready' && node src/server.js"]
