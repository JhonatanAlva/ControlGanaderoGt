# ─────────────────────────────────────────────
#  Stage 1: dependencias
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar solo package files para aprovechar cache de Docker
COPY package.json package-lock.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# ─────────────────────────────────────────────
#  Stage 2: imagen final
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Usuario no-root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar dependencias del stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY src/ ./src/
COPY package.json ./

# Crear carpeta de logs con permisos correctos
RUN mkdir -p logs && chown -R appuser:appgroup /app

USER appuser

# Puerto expuesto (debe coincidir con PORT en .env)
EXPOSE 3000

# Health check para docker-compose
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Arrancar en modo producción
CMD ["node", "src/server.js"]
