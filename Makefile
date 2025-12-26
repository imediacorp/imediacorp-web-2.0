# Web 2.0 Demo Framework Makefile

.PHONY: install dev build start lint type-check clean

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run dev

# Start development server with automatic port finding
dev-auto:
	npm run dev:auto

# Check if default port is available
check-port:
	npm run check-port

# Build for production
build:
	npm run build

# Start production server
start:
	npm start

# Run linting
lint:
	npm run lint

# Type check
type-check:
	npm run type-check

# Clean build artifacts
clean:
	rm -rf .next node_modules

# Setup (install + configure env)
setup: install
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "Created .env.local from .env.example"; \
	fi

# Help
help:
	@echo "Available targets:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Start development server (default port 3000)"
	@echo "  make dev-auto     - Start dev server with automatic port finding"
	@echo "  make check-port   - Check if default port is available"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make lint         - Run linting"
	@echo "  make type-check   - Run TypeScript type checking"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make setup        - Initial setup (install + env)"

