{ inputs, pkgs, ... }:

{
  packages = [
    pkgs.git
    pkgs.npm-check-updates
    pkgs.nodejs_20
  ];

  devcontainer = {
    enable = true;
    settings.updateContentCommand = "devenv ci && devenv shell warmup";
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
  };

  scripts.warmup.exec = ''
    npm install
  '';
}