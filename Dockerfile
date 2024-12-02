# renovate: datasource=github-tags depName=rust lookupName=rust-lang/rust
ARG RUST_VERSION=1.83.0

FROM rust:$RUST_VERSION
WORKDIR /app

# renovate: datasource=crate depName=diesel_cli versioning=semver
ARG DIESEL_CLI_VERSION=2.2.4

RUN apt-get update \
    && apt-get install -y postgresql \
    && rm -rf /var/lib/apt/lists/*

# Install diesel-cli
RUN cargo install diesel_cli --version $DIESEL_CLI_VERSION --no-default-features --features postgres

# Cache cargo dependencies
COPY Cargo.toml Cargo.lock ./
COPY build.rs ./
RUN mkdir src && echo "fn main() {}" > src/main.rs \
    && cargo build --release \
    && rm -rf src

COPY . .

RUN cargo build --release \
    && chmod +x /app/docker_entrypoint.sh

ENTRYPOINT ["/app/docker_entrypoint.sh"]
