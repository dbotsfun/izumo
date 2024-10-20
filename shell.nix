{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.openssl
    pkgs.pkg-config
    pkgs.rustc
    pkgs.cargo
    # pkgs.diesel  # Install the Diesel CLI
    pkgs.postgresql  # If using PostgreSQL, add this
  ];

  shellHook = ''
    export DATABASE_URL=postgres://user:password@localhost/mydb  # Set your DB URL
  '';
}

