# SynbioHub Plugin: VisBol

VisBol is a visualization plugin engine for SynBioHub that allows SBOLCanvas designs to be visualized directly on SynBioHub.

## Project Description

Sequence Visualization Plugin is a visualization plugin engine for SynBioHub to enhance the functional annotations of DNA sequence which are coordinated with the SBOL Visual standard.

## Development

To start both the frontend build and the backend server in dev mode:

```bash
yarn dev
```

## Deploy

### Configuration

On the server:

```bash
nano ~/synbiohub-plugins/docker-compose.yml
# services:
#     # ...
#     plugin-visbol:
#         build: ./visbol/.
#         ports:
#             - "127.0.0.1:5012:5012"
#         dns: 8.8.8.8
#         restart: always

nano /etc/Caddyfile
# hub.openbioeconomy.org:6012 {
#     reverse_proxy :5012
# }
```

### Update

The build script outputs two self-contained compiled JS files, one for the backend and one for the frontend.
To build the frontend and backend code, run from a local machine or GitHub Action:

```bash
yarn build
```

Then deploy `dist/`, together with the `Dockerfile`:

```bash
scp Dockerfile USER@SERVER:~/synbiohub-plugins/visbol/
scp -r dist/ USER@SERVER:~/synbiohub-plugins/visbol/
```

On the server, run:

```bash
docker-compose up --build -d
```

### SynbioHub Configuration

The plugin will run on port 5012 of the container, reverse-proxied on port 6012 of the server,
so this is the configuration that will need to be added in SynbioHub > Admin > Plugins:

| Name   | URL                    |
| ------ | ---------------------- |
| VisBol | https://{SERVER}:6012/ |
