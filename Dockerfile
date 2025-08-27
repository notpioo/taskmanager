# Stage 1: Build React app
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Stage 2: Production server
FROM node:18-alpine AS production

# Create app directory
WORKDIR /app

# Create uploads directory for files
RUN mkdir -p uploads

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy server file
COPY server.js ./

# Copy built React app from frontend-build stage
COPY --from=frontend-build /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

# Start the application
CMD ["node", "server.js"]