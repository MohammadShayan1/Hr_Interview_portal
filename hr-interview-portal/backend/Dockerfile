# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src

# Build the TypeScript code
RUN npm run build

# Remove development dependencies and source files
RUN npm prune --omit=dev && \
    rm -rf src tsconfig.json tsconfig.build.json

# Expose port (configurable via environment variable)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
