# Stage 0: Build Node app
FROM node:20-alpine AS build

WORKDIR /app

# Copy root package.json & lock
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app-shell source
COPY src ./src

# Switch to app-shell folder for build
WORKDIR /app/src/app-shell

# Build app-shell
RUN npm run build

# Stage 1: Serve with nginx
FROM nginx:alpine

COPY --from=build /app/src/app-shell/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]