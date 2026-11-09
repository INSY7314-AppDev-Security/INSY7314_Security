# HustleHub+ frontend image: build the React app, then serve it with nginx

# ---- Stage 1: build ----
# Node 24 on purpose: the package-lock.json was made with npm 11, and npm 10 (Node 22) cannot install it with "npm ci"
FROM node:24-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# The address the browser uses to reach the API. It is built into the app.
ARG REACT_APP_API_URL=https://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Keep all scripts in separate files, so the Content Security Policy can block inline scripts
ENV INLINE_RUNTIME_CHUNK=false
RUN npm run build

# ---- Stage 2: serve ----
# The "unprivileged" nginx image runs as a normal user on port 8080
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -qO- http://localhost:8080/ >/dev/null || exit 1
