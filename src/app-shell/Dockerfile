# ================================
# Stage 1: Build the app-shell
# ================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files needed for the build
COPY index.html ./           # index.html is at the root
COPY src/app-shell ./src/app-shell

# Run the build (Vite will output to /app/dist)
RUN npm run build

# ================================
# Stage 2: Production
# ================================
FROM nginx:alpine

# Copy the build output from the builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: copy custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]