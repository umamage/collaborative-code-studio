.PHONY: install run test help

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies using uv"
	@echo "  make run      - Run the FastAPI server"
	@echo "  make test     - Run tests"

install:
	uv sync

run:
	uv run uvicorn main:app --reload

test:
	uv run pytest
