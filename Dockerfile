# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configuration and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application, creating the static assets in /app/dist
RUN npm run build

# Stage 2: Create the final, lean production image
FROM node:20-alpine

WORKDIR /app

# Create a dedicated, non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.mjs .

# Install only production dependencies
RUN npm install --omit=dev

# Install tini for proper signal handling
RUN apk add --no-cache tini

# Copy the built static assets from the builder stage
COPY --from=builder /app/dist ./dist

# Switch to the non-root user
USER expressjs

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Use tini as the entrypoint to handle signals
ENTRYPOINT ["/sbin/tini", "--"]

# The command to start the server, passed to tini
CMD ["node", "server.mjs"]
