# Stage 1: Build the app-shell
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files (for npm ci)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app-shell source code
COPY src/app-shell ./app-shell

# Build the app-shell (assuming npm build script exists)
WORKDIR /app/app-shell
RUN npm run build

# Stage 2: Prepare production image with nginx
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built app-shell from builder stage
COPY --from=builder /app/app-shell/dist /usr/share/nginx/html

# Expose port and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]