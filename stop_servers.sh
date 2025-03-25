#!/bin/bash

# Find and kill Tauri and Python server processes
echo "Stopping servers..."

# Find and kill Python server
pkill -f "python server.py" && echo "✓ Python server stopped" || echo "✗ No Python server found"

# Find and kill Tauri processes
pkill -f "tauri" && echo "✓ Tauri processes stopped" || echo "✗ No Tauri processes found"

echo "All servers stopped."
