FROM node:24-alpine AS base

# ─── Development stage ────────────────────────────────────────────────────────
# Used by dev.docker-compose.yml via `target: dev`.
# Source is bind-mounted at runtime for hot-reload — no app COPY needed here.
FROM base AS dev
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ─── Production deps stage ────────────────────────────────────────────────────
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
    if [ -f package-lock.json ]; then npm ci; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Generate Prisma Client
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy Prisma schema and seed script
COPY prisma ./prisma

# Copy data directory for seeding (if available)
COPY --from=builder /app/data ./data

# Copy startup script
COPY start.sh ./
RUN sed -i 's/\r$//' start.sh
RUN chmod +x start.sh

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Install runtime dependencies locally (owned by root initially)
# We install in a separate directory to avoid conflicts with Next.js standalone node_modules
RUN mkdir -p /app/admin-tools
WORKDIR /app/admin-tools
RUN npm init -y
RUN npm install prisma@5.10.2 bcryptjs@2.4.3
RUN chown -R nextjs:nodejs /app/admin-tools

WORKDIR /app



USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start via script
CMD ["./start.sh"]
