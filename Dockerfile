# ==============================================================================
# Stage 1: Build Frontend (React + Vite)
# Compiles the React SPA into static HTML/JS/CSS assets. This stage and its
# build-time dependencies are discarded in the final image.
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Copy dependency manifests first to leverage Docker layer caching
COPY client/package*.json ./
RUN npm ci

# Copy frontend source code and build the production bundle (`client/dist`)
COPY client/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Install Backend Production Dependencies
# Installs only runtime Node.js dependencies (excluding Jest, Supertest, etc.)
# ==============================================================================
FROM node:20-alpine AS backend-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ==============================================================================
# Stage 3: Production Runtime
# Minimal Alpine image containing only production runtime artifacts.
# ==============================================================================
FROM node:20-alpine
WORKDIR /app

# Configure production environment defaults
ENV NODE_ENV=production
ENV PORT=3000

# Copy pruned backend dependencies, server source code, and compiled frontend bundle
COPY --from=backend-builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src
COPY --from=frontend-builder /app/client/dist ./client/dist

# Run the application as a non-root user (`node` is built into official Node images)
# to follow container security best practices
USER node

# Document the internal container port used by Express
EXPOSE 3000

# Start the Express server (serves both `/weather` API and `client/dist` static files)
CMD ["npm", "start"]