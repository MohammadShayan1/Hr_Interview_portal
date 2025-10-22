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

# Expose port (Railway will use PORT env variable)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
