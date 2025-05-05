# Stage 1: Build
FROM node:23-slim AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Serve
FROM nginx:stable-alpine AS production

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]