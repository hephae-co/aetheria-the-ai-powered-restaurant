# Stage 1: Build the application
FROM node:24.7.0-alpine AS build

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install bun globally as root
RUN npm install -g bun

# Set the working directory
WORKDIR /app

# Copy package configuration files
COPY package.json package-lock.json* bun.lockb* ./

# Install dependencies - using bun if available, otherwise npm
RUN if [ -f bun.lockb ]; then \
      bun install; \
    else \
      npm install; \
    fi

# Copy the rest of the application source code
COPY . .

# Build the project
RUN npm run build

# Generate sitemap after the build
# RUN npm run generate-sitemap

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Stage 2: Serve the static files with Nginx and run the Node.js server
FROM nginx:1.24-alpine

# Install Node.js
RUN apk add --update nodejs

# Copy the custom Nginx configuration
COPY config/nginx.conf /etc/nginx/nginx.conf

# Create a temporary directory for Nginx and set permissions
RUN mkdir -p /tmp/nginx && \
    chown -R nginx:nginx /tmp/nginx

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Node.js application from the build stage
COPY --from=build /app /app

# Set the working directory for the Node.js application
WORKDIR /app

# Grant permissions to nginx user for the app directory
RUN chown -R nginx:nginx /app

# Copy the startup scripts and make them executable
COPY bin/start.sh /usr/local/bin/start.sh
COPY bin/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /usr/local/bin/start.sh /docker-entrypoint.d/env.sh

# Switch to the non-root user
USER nginx

# Expose port 8080 for the Nginx server
EXPOSE 8080

# Start the Node.js server and Nginx when the container launches
CMD ["/usr/local/bin/start.sh"]
