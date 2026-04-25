FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json next.config.ts ./
COPY components.json eslint.config.mjs postcss.config.mjs ./
COPY src ./src
COPY public ./public

RUN npm run build

# ============================================================================
# RUNTIME
# ============================================================================
FROM node:20-alpine

# Define metadados da imagem
LABEL maintainer="Portfolio App"
LABEL description="Next.js 15 Portfolio Application"

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Cria um usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=deps /app/node_modules ./node_modules

# Copia os arquivos construídos do Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/package.json ./package.json

# Alterna para usuário não-root
USER nextjs

EXPOSE 3000

# Health check para monitoramento da aplicação
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["node_modules/.bin/next", "start"]
