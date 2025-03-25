#!/bin/bash
echo "=== FastAPI Server Troubleshooting ==="
echo "Checking Python installation..."
python3 --version
echo ""

echo "Checking pip installation..."
pip3 --version
echo ""

echo "Checking if FastAPI is installed..."
pip3 list | grep fastapi
echo ""

echo "Checking if Uvicorn is installed..."
pip3 list | grep uvicorn
echo ""

echo "Attempting to start server directly..."
cd server 2>/dev/null || mkdir -p server && cd server
echo "from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def read_root():
    return {'message': 'API Server is running'}" > main.py

echo "Created main.py in $(pwd)"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
