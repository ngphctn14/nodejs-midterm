FROM node:22-alpine
WORKDIR /build
COPY package*.json .
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["sh", "-c", "npx prisma db push && node src/server.js"]
