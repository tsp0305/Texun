# Stage 1: Build the React client frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Copy client dependency manifests and install packages
COPY client/package*.json ./
RUN npm ci

# Copy client source code and compile production assets
COPY client/ ./
RUN npm run build

# Stage 2: Package the main backend server and the static client bundle
FROM node:20-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy root dependency manifests and install production-only modules
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY api/ ./api/

# Copy built frontend assets from Stage 1 builder
COPY --from=client-builder /app/client/dist ./client/dist

# Expose port 3000 for the MERN Express server
EXPOSE 3000

# Run the backend API server
CMD ["node", "api/index.js"]
