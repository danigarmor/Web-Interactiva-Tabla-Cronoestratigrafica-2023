# Dockerfile para Fly.io / Render / Railway
# Multi-stage build para imagen ligera

# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluyendo dev para nodemon en desarrollo)
RUN npm ci --omit=dev

# Copiar código fuente
COPY . .

# Etapa 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar node_modules y código desde builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app ./

# Directorio para base de datos persistente
RUN mkdir -p /data && chown nodejs:nodejs /data

# Variables de entorno
ENV PORT=8080
ENV NODE_ENV=production
ENV DB_FILE=/data/database.json

USER nodejs

EXPOSE 8080

CMD ["node", "server.js"]