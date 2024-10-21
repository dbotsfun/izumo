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
  '';
}
