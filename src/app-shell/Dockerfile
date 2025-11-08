# ----------------------------
# Stage 1: Build
# ----------------------------
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (for caching)
COPY src/app-shell/package*.json ./

# Install dependencies (use install if package-lock.json may be missing)
RUN npm install

# Copy the source code
COPY src/app-shell ./

# Build the app-shell
RUN npm run build

# ----------------------------
# Stage 2: Serve
# ----------------------------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]