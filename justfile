set positional-arguments
# You can comment out the following line if you don't want to use nushell
set shell := ["nu", "-c"]

default:
    just --list

clippy:
    cargo clippy --fix --workspace --allow-dirty
    cargo fmt

dev:
    docker compose up

undev:
    docker-compose down
