# renovate: datasource=github-tags depName=rust lookupName=rust-lang/rust
ARG RUST_VERSION=1.82.0@sha256:33a0ea4769482be860174e1139c457bdcb2a236a988580a28c3a48824cbc17d6

FROM rust:$RUST_VERSION
WORKDIR /app

# renovate: datasource=crate depName=diesel_cli versioning=semver
ARG DIESEL_CLI_VERSION=2.2.4

RUN apt-get update \
    && apt-get install -y postgresql \
    && rm -rf /var/lib/apt/lists/* \
    && cargo install diesel_cli --version $DIESEL_CLI_VERSION --no-default-features --features postgres

COPY . .

RUN cargo build --release \
    && chmod +x /app/docker_entrypoint.sh

ENTRYPOINT ["/app/docker_entrypoint.sh"]
