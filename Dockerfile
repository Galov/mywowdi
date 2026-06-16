FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable
RUN corepack prepare pnpm@10.8.0 --activate

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /app

ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_PUBLIC_SERVER_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=secret,id=payload_secret \
    --mount=type=secret,id=database_url \
    --mount=type=secret,id=preview_secret \
    export PAYLOAD_SECRET="$(cat /run/secrets/payload_secret)" && \
    export DATABASE_URL="$(cat /run/secrets/database_url)" && \
    export PREVIEW_SECRET="$(cat /run/secrets/preview_secret)" && \
    export NEXT_PUBLIC_SERVER_URL="$NEXT_PUBLIC_SERVER_URL" && \
    export PAYLOAD_PUBLIC_SERVER_URL="$PAYLOAD_PUBLIC_SERVER_URL" && \
    pnpm build

FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

RUN mkdir -p /app/public/media && chown -R node:node /app

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
