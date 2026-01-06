# Use Node.js 20 for Next.js 15 compatibility
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Final production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]