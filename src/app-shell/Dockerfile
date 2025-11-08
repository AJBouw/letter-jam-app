# ==============================
# Stage 1: Build
# ==============================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the full app-shell source
COPY . ./

# Build the app-shell (Vite produces static files in 'dist')
RUN npm run build

# ==============================
# Stage 2: Production image
# ==============================
FROM nginx:alpine

# Remove default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx.conf if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]