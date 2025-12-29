# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY server.js ./
COPY googleDriveService.js ./
COPY public/ ./public/

# Create uploads directory (if needed)
RUN mkdir -p uploads

# Expose port
EXPOSE 5050

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]