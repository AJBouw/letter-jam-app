# Stage 0: Build Node app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json & lock
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the full src folder (app-shell + features)
COPY src ./src

# Build app-shell
WORKDIR /app/src/app-shell
RUN echo "VITE_GITHUB_USER=dummy" >> .env \
    && npm run build

# Stage 1: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built app-shell dist
COPY --from=build /app/src/app-shell/dist /usr/share/nginx/html/

# Copy features (keep folder structure for dynamic imports)
COPY --from=build /app/src/features /usr/share/nginx/html/src/features

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]