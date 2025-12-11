# Stage 1: Build the frontend, and install server dependencies
FROM node:22 AS builder


WORKDIR /app

# Copy all files from the current directory
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Install server dependencies
WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
COPY server/.env ./
RUN npm install --frozen-lockfile

# Install dependencies and build the frontend
WORKDIR /app
RUN mkdir dist
RUN npm run build
RUN ls -la /app/dist


# Stage 2: Build the final server image
FROM node:22

WORKDIR /app

#Copy server files
COPY --from=builder /app/server .
# Copy built frontend assets from the builder stage
COPY --from=builder /app/dist ./dist
# Copy the aetheria directory
COPY aetheria ./dist/aetheria

EXPOSE 3000

CMD ["node", "server.js"]
