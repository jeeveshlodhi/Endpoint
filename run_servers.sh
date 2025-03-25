#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create logs directory inside the script directory
mkdir -p "$SCRIPT_DIR/logs"

# Function to get timestamp
timestamp() {
  date +"%Y%m%d_%H%M%S"
}

# Start the Tauri app
start_tauri() {
  echo "Starting Tauri server..."
  cd "$SCRIPT_DIR/tauri-app" # Update this path to your Tauri app directory
  npm run tauri dev > "$SCRIPT_DIR/logs/tauri_console_$(timestamp).log" 2>&1 &
  TAURI_PID=$!
  echo "Tauri server started with PID: $TAURI_PID"
  cd "$SCRIPT_DIR"
}

# Start the Python server
start_python() {
  echo "Starting Python server..."
  cd "$SCRIPT_DIR/python-server" # Update this path to your Python server directory

  # Create and activate virtual environment if needed
  if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    # Install requirements if needed
    if [ -f "requirements.txt" ]; then
      pip install -r requirements.txt
    fi
  else
    source venv/bin/activate
  fi

  # Run the Python server
  python server.py > "$SCRIPT_DIR/logs/python_console_$(timestamp).log" 2>&1 &
  PYTHON_PID=$!
  echo "Python server started with PID: $PYTHON_PID"
  cd "$SCRIPT_DIR"
}

# Start both servers
start_tauri
start_python

echo "┌────────────────────────────────────────────┐"
echo "│ Both servers are now running!              │"
echo "│                                            │"
echo "│ • Check logs directory for output files    │"
echo "│ • Run ./monitor_logs.sh to watch logs      │"
echo "│ • Run ./stop_servers.sh to stop servers    │"
echo "└────────────────────────────────────────────┘"

# Wait and handle clean shutdown
trap "kill 0" INT
wait
