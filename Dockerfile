# Dockerfile untuk Railway deployment
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Build React app using vite directly
RUN npx vite build

# Expose port for Railway
EXPOSE 5000

# Set NODE_ENV
ENV NODE_ENV=production

# Start server
CMD ["node", "server.js"]