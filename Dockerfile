FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Create next-env.d.ts file
RUN touch next-env.d.ts

# Copy and make startup script executable
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Create non-root user
# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# # Change ownership of the app directory
# RUN chown -R nextjs:nodejs /app

# # Switch to non-root user
# USER nextjs

# Expose port
EXPOSE 3000

# Start the application using the startup script
CMD ["/start.sh"]

