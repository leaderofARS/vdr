FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache openssl python3 make g++

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && npx prisma generate

COPY src ./src/
COPY start.sh ./
RUN chmod +x start.sh

RUN addgroup -g 1001 -S nodejs && \
    adduser -S vdr -u 1001 && \
    chown -R vdr:nodejs /app

USER vdr

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -q --spider http://localhost:3001/health || exit 1

CMD ["./start.sh"]