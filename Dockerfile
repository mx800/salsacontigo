FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies without running scripts
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start dev server
CMD ["pnpm", "dev"]
