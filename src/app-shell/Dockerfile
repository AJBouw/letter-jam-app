# Stage 1: Build (creates /app/dist)
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the app-shell source code
COPY src/app-shell ./src/app-shell

# Run the build (will output to /app/dist)
RUN npm run build

# Stage 2: Production (serve with nginx)
FROM nginx:alpine

# Copy the build output from the builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optionally, copy custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]