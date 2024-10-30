{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  buildInputs = [
    pkgs.openssl
    pkgs.pkg-config
    pkgs.rustc
    pkgs.cargo
    pkgs.postgresql # If using PostgreSQL, add this
  ];

  shellHook = ''
    export DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres  # Set your DB URL

    export MASON="$HOME/.local/share/nvim/mason/bin"
    export FNM_LTS_BIN="$HOME/.local/share/fnm/node-versions/v20.18.0/installation/bin"
    export NIX_LD_LIBRARY_PATH="$MASON:$FNM_LTS_BIN:$NIX_LD_LIBRARY_PATH"
    export PATH="$HOME/.cargo/bin:$PATH:$MASON"
  '';
}
