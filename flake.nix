{
  description = "Izu's flake configuration";

  inputs = {
    nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.1.*.tar.gz";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      rust-overlay,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            rust-overlay.overlays.default
          ];
        };

        # Determine the Rust toolchain version
        rustToolchain = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml;

        # Define the necessary native libraries for Diesel
        nativeLibraries = with pkgs; [
          pkg-config
          openssl
          postgresql
        ];

      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs =
            with pkgs;
            [ rustToolchain ]
            ++ nativeLibraries
            ++ [
              just
              cargo-deny
              cargo-edit
              cargo-watch
              rust-analyzer
              diesel-cli
            ];

          # Set environment variables
          shellHook = ''
            # export DATABASE_URL=postgres://username:password@localhost/database_name
            export RUST_SRC_PATH=${rustToolchain}/lib/rustlib/src/rust/library
            export RUSTFLAGS="-Lnative=${pkgs.openssl.dev}/lib";
          '';
        };
      }
    );
}
