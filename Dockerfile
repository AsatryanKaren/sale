# One image for Railway: builds the web app and runs the API, which serves it.
FROM node:22-bookworm-slim
WORKDIR /app
RUN corepack enable

# Install dependencies first so this layer is cached until a manifest changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 8787
CMD ["pnpm", "start"]
