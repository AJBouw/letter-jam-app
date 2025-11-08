# Stage 0: Build Node app
FROM node:20-alpine AS build

WORKDIR /app

# Copy entire project
COPY . .

# Install dependencies
RUN npm ci

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built dist to nginx html
COPY --from=build /app/dist /usr/share/nginx/html

# Copy static assets (if you have src/assets or other static files)
COPY --from=build /app/src/assets /usr/share/nginx/html/assets

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]