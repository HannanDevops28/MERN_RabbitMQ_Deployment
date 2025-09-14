FROM node:18-alpine AS base
WORKDIR /app


# production dependencies only - multi-stage is small but simple
COPY package.json package-lock.json* ./
RUN npm ci --production || npm i --production


COPY . .


EXPOSE 3001
CMD ["node", "src/index.js"]