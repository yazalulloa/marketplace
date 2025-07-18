DIR=$(dirname "$(readlink -f "$0")")

docker build --progress=plain -f "$DIR"/Dockerfile.jvm -t marketplace:latest . && \
 docker compose -f "$DIR"/docker-compose.yml up -d --no-deps --build --remove-orphans && \
 docker logs -f marketplace
