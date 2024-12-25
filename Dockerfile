FROM node:18-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3006

ENV PORT=3006
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Add proper healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3006/ || exit 1

# Start the application using vite preview directly
CMD ["sh", "-c", "npx vite preview --host 0.0.0.0 --port 3006"]
