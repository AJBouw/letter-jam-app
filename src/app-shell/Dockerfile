# src/app-shell/Dockerfile
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy app-shell source
COPY . .

# Install dependencies
RUN npm ci

# Build app
RUN npm run build

# Serve the built files using a simple web server
FROM nginx:alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Expose default nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]