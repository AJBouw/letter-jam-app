# Stage 0: Build Node app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and lock from repo root
COPY package*.json ./

# Install deps
RUN npm ci

# Copy app-shell source
COPY src/app-shell ./src/app-shell

# Build with Vite
RUN npm run build --prefix src/app-shell

# Stage 1: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/src/app-shell/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]