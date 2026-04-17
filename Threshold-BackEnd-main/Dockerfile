FROM node:18-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*


COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p /app/logs && chmod -R 755 /app/logs

ENV PORT=5000

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -f http://localhost:${PORT}/api/health || exit 1

CMD ["sh", "-c", "npm run start:prod 2>&1 | tee -a /app/logs/backend-error.log"]