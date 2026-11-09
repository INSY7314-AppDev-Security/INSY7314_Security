# HustleHub+ backend image
FROM node:24-slim

ENV NODE_ENV=production
WORKDIR /app

# Install only the packages the server needs (no Newman or nodemon)
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY generate-cert.js ./

# The server writes its HTTPS certificate and its logs into these folders
RUN mkdir -p certs logs && chown -R node:node /app

# Never run the server as root
USER node

EXPOSE 5000

# Healthy when the API answers over HTTPS (the certificate is self-signed, so it is not verified here)
HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD curl -ksf https://localhost:5000/ || exit 1
  CMD node -e "require('https').get({host:'localhost',port:process.env.PORT||5000,path:'/',rejectUnauthorized:false},r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Make a fresh self-signed certificate, then start the server
CMD ["sh", "-c", "node generate-cert.js && node src/server.js"]
