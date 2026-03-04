FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only (cached layer)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && npx prisma generate

# Copy application source
COPY src ./src/

# Security hardening
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vdr -u 1001 && \
    chown -R vdr:nodejs /app

USER vdr

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -q --spider http://localhost:3001/health || exit 1

CMD ["node", "src/server.js"]
