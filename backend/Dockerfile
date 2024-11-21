FROM node:alpine AS base

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile || pnpm install

COPY . .

RUN pnpm run codegen

RUN pnpm run build

EXPOSE 3005

CMD ["pnpm", "start"]