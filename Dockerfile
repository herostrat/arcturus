# syntax=docker/dockerfile:1

FROM rust:1.75-slim AS tileserver
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    libssl-dev \
    pkg-config \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /build
RUN git clone https://github.com/vinayakkulkarni/tileserver-rs.git
WORKDIR /build/tileserver-rs
RUN cargo build --release

# --- ETL placeholder ---
# FROM rust:1.75-slim AS etl
# WORKDIR /build/etl
# COPY etl/ ./
# RUN cargo build --release

FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    supervisor \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/arcturus
COPY backend/ /opt/arcturus/backend/
COPY --from=tileserver /build/tileserver-rs/target/release/tileserver-rs /opt/tileserver-rs/tileserver-rs
COPY --from=frontend /frontend/dist /opt/arcturus/frontend/dist
COPY docker/supervisor/supervisord.conf /etc/supervisor/supervisord.conf

ARG STYLES_URL="https://github.com/herostrat/nautical-vector-styles/releases/download/nautical-vector-styles-v0.1.0/nautical-vector-styles-0.1.0.tar.gz"
ARG STYLES_SHA256="0a6190b3e4a68ffeb0961869844f53e974051a5a9b9f7d60ec048a48be548e44"

RUN mkdir -p /data/config /data/charts /data/styles \
  && curl -L "$STYLES_URL" -o /tmp/styles.tar.gz \
  && echo "$STYLES_SHA256  /tmp/styles.tar.gz" | sha256sum -c - \
  && tar -xzf /tmp/styles.tar.gz -C /data/styles --strip-components=1 \
  && rm /tmp/styles.tar.gz
COPY tileserver.config.toml /data/config/tileserver.config.toml

RUN pip install --no-cache-dir -r /opt/arcturus/backend/requirements.txt

ENV ARCTURUS_ROOT=/opt/arcturus
ENV TILESERVER_RS_BINARY=/opt/tileserver-rs/tileserver-rs
ENV TILESERVER_CONFIG_PATH=/data/config/tileserver.config.toml
ENV FRONTEND_DIST_PATH=/opt/arcturus/frontend/dist

EXPOSE 8000 8081
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
