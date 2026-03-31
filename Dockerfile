FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
# 1. COPY ALL SOURCE FILES so 'npm run build' can work
COPY . .
ARG APP_NAME
RUN npm run build ${APP_NAME}

FROM node:20-alpine
WORKDIR /app
ARG APP_NAME
# 2. Only copy the FINISHED JavaScript from the builder stage
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/main"]