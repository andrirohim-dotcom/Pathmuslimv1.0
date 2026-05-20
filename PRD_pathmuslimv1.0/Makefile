.PHONY: help dev test seed db-reset db-push lint type-check build clean install

help:
	@echo "PathMuslim Development Commands"
	@echo "==============================="
	@echo "make dev          - Start Next.js dev server + Supabase"
	@echo "make test         - Run all tests"
	@echo "make seed         - Populate sample data into database"
	@echo "make db-reset     - Reset database to initial state"
	@echo "make db-push      - Apply pending migrations"
	@echo "make lint         - Run ESLint"
	@echo "make type-check   - Run TypeScript type checker"
	@echo "make build        - Build for production"
	@echo "make clean        - Clean build artifacts and node_modules"
	@echo "make install      - Install dependencies"

dev:
	@echo "Starting development environment..."
	@bash ./scripts/dev.sh

test:
	@echo "Running tests..."
	npm test

test-watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

test-coverage:
	@echo "Running tests with coverage..."
	npm run test:coverage

seed:
	@echo "Seeding database..."
	npm run seed

db-reset:
	@echo "Resetting database..."
	npm run db:reset

db-push:
	@echo "Pushing migrations..."
	npm run db:push

lint:
	@echo "Running ESLint..."
	npm run lint

type-check:
	@echo "Type checking..."
	npm run type-check

build:
	@echo "Building for production..."
	npm run build

clean:
	@echo "Cleaning up..."
	rm -rf .next node_modules dist
	npm cache clean --force

install:
	@echo "Installing dependencies..."
	npm install

.PHONY: supabase-start supabase-stop supabase-status

supabase-start:
	@echo "Starting Supabase..."
	supabase start

supabase-stop:
	@echo "Stopping Supabase..."
	supabase stop

supabase-status:
	@echo "Supabase status..."
	supabase status
