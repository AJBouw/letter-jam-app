# Stage 1: Build the app-shell
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY src/app-shell/package*.json ./

# Install dependencies (requires package-lock.json)
RUN npm ci

# Copy the full source code
COPY src/app-shell ./

# Build the app-shell
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]