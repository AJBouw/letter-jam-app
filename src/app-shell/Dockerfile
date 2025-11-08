# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY src/app-shell ./app-shell

# Build app-shell
WORKDIR /app/app-shell
RUN npm run build

# Stage 2: Production image
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/app-shell/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]