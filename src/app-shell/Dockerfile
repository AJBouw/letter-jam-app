# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app-shell source
COPY src/app-shell ./app-shell

# Build the app-shell
WORKDIR /app/app-shell
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/app-shell/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]