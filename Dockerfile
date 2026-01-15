# Stage 1: Build the frontend
FROM node:22-slim AS builder

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Create the final production image
FROM node:22-slim

WORKDIR /app

# Copy package.json and package-lock.json from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json* ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built frontend assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the public directory
COPY --from=builder /app/public ./public

# Copy the server script
COPY --from=builder /app/server.cjs .

# Copy the aetheria directory into the dist folder
COPY --from=builder /app/aetheria ./dist/aetheria

# Expose the port the server runs on
EXPOSE 3000

# The command to run the application
CMD ["node", "server.cjs"]
