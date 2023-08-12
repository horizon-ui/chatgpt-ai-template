# Makefile for managing Docker and DB migrations

# Default action is to start the Docker Compose services
default: up

# Start Docker Compose services
up:
	docker-compose up -d

# Stop Docker Compose services
down:
	docker-compose down

# Restart Docker Compose services
restart: down up

# Build Docker Compose services
build:
	docker-compose build

# Restart and Build Docker Compose services
rebuild: down build up

# Migrate the database
migrate-db:
	docker-compose exec nextjs npx sequelize-cli db:migrate

# Undo migration
migrate-db-undo:
	docker-compose exec nextjs npx sequelize-cli db:migrate

# Simplified command to restart, rebuild, and migrate
all: rebuild migrate-db

.PHONY: up down restart build rebuild migrate-db all

