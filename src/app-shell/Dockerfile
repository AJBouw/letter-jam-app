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

# Copy built app-shell dist
COPY --from=build /app/dist /usr/share/nginx/html

# Copy each feature dist folder to match dynamic import paths
COPY features/feature-home/dist /usr/share/nginx/html/src/features/feature-home/dist
COPY features/feature-login/dist /usr/share/nginx/html/src/features/feature-login/dist
COPY features/feature-quick-game/dist /usr/share/nginx/html/src/features/feature-quick-game/dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]