# Stage 0: Build Node app
FROM node:20-alpine AS build

WORKDIR /app

# Copy entire project
COPY . .

# Install dependencies
RUN npm ci

# Build app-shell (from root, index.html is here)
RUN npm run build

# Stage 1: Serve with nginx
FROM nginx:alpine

# Copy built dist to nginx html
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]