#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create logs directory inside the script directory
mkdir -p "$SCRIPT_DIR/logs"

# Function to get timestamp
timestamp() {
  date +"%Y%m%d_%H%M%S"
}

# Function to get today's date in YYYY-MM-DD format
get_date_for_filename() {
  date +"%Y-%m-%d"
}

# Function to get full timestamp for log entries
get_timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

# Function to get or create the appropriate log file for today
get_log_file() {
  local server_name="$1"
  local today_date=$(get_date_for_filename)
  local log_file="$SCRIPT_DIR/logs/${today_date}-${server_name}.log"

  # Create the file if it doesn't exist
  if [ ! -f "$log_file" ]; then
    touch "$log_file"
    echo "=== ${server_name} Server Log - Started at $(get_timestamp) ===" > "$log_file"
  fi

  echo "$log_file"
}

# Function to trim log files to last 1000 lines if needed
trim_log() {
  local log_file="$1"
  local max_lines=1000

  if [ -f "$log_file" ]; then
    # Count lines in the file
    local line_count=$(wc -l < "$log_file")

    if [ "$line_count" -gt "$max_lines" ]; then
      # Create a temporary file
      local temp_file=$(mktemp)
      # Get the last 1000 lines and save to temp file
      tail -n "$max_lines" "$log_file" > "$temp_file"
      # Replace original with trimmed version
      mv "$temp_file" "$log_file"

      # Add a note about trimming
      echo "$(get_timestamp) - [Log Management] Trimmed file to last $max_lines lines" >> "$log_file"
      echo "$(get_timestamp) - Trimmed $log_file to last $max_lines lines" >> "$(get_log_file "management")"
    fi
  fi
}

# Function to log messages to both console and log file
log_message() {
  local server_name="$1"
  local message="$2"
  local log_file=$(get_log_file "$server_name")

  echo "$(get_timestamp) - $message" | tee -a "$log_file"
}

# Start the Tauri app
start_tauri() {
  log_message "tauri" "Starting Tauri server..."

  # Check if the directory exists
  if [ ! -d "$SCRIPT_DIR/" ]; then
    log_message "tauri" "ERROR: Tauri app directory not found at $SCRIPT_DIR/tauri-app"
    log_message "tauri" "Skipping Tauri server startup"
    TAURI_PID=""
    return 1
  fi

  if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    log_message "tauri" "Node modules directory not found at $SCRIPT_DIR/node_modules"
    log_message "tauri" "Installing node modules..."
    npm install >> "$(get_log_file "tauri")" 2>&1
    if [ $? -ne 0 ]; then
      log_message "tauri" "ERROR: Failed to install node modules"
      TAURI_PID=""
      return 1
    fi
  fi

  cd "$SCRIPT_DIR/" || return 1
  log_message "tauri" "Starting Tauri from directory: $(pwd)"

  # Get the log file for today
  TAURI_LOG=$(get_log_file "tauri")

  # Start the Tauri app and append output to the log file
  log_message "tauri" "Executing 'npm run tauri dev'..."
  npm run tauri dev >> "$TAURI_LOG" 2>&1 &
  TAURI_PID=$!

  log_message "tauri" "Tauri server started with PID: $TAURI_PID"

  # Check if process is running after a brief moment
  sleep 2
  if ! ps -p $TAURI_PID > /dev/null; then
    log_message "tauri" "WARNING: Tauri server may have failed to start. Check logs."
    TAURI_PID=""
    return 1
  fi

  # Trim log if it gets too large
  trim_log "$TAURI_LOG"

  cd "$SCRIPT_DIR" || exit 1
}

# Start the Python server
start_python() {
  log_message "python" "Starting Python server..."

  # Check if we have Python installed
  if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed or not in PATH"
    PYTHON_PID=""
    return 1
  fi

  # Default to current directory if server directory doesn't exist
  if [ ! -d "$SCRIPT_DIR/server" ]; then
    echo "Notice: Python server directory not found at $SCRIPT_DIR/server"
    echo "Creating server directory..."
    mkdir -p "$SCRIPT_DIR/server"
  fi

  SERVER_DIR="$SCRIPT_DIR/server"
  cd "$SERVER_DIR" || exit 1
  echo "Starting Python server from $(pwd)..."

  # Check if main.py exists, if not create it
  if [ ! -f "main.py" ]; then
    echo "Error: main.py not found in $(pwd)"
    echo "Creating a basic FastAPI application..."
    cat > main.py << 'EOL'
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API Server is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
EOL
    echo "Created main.py with a basic FastAPI application"
  fi

  # Define log file with timestamp in name
  PYTHON_LOG="$SCRIPT_DIR/logs/python_console_$(timestamp).log"

  # Add header with timestamp to log file
  echo "=== Python Server Log - Started at $(date) ===" > "$PYTHON_LOG"

  # Create and activate virtual environment if needed
  if [ ! -d "venv" ]; then
      log_message "python" "Creating Python virtual environment..."
      python3 -m venv venv >> "$PYTHON_LOG" 2>&1

      if [ $? -ne 0 ]; then
        log_message "python" "Failed to create virtual environment. Attempting to install globally..."
        pip3 install fastapi uvicorn >> "$PYTHON_LOG" 2>&1

        if [ $? -ne 0 ]; then
          log_message "python" "ERROR: Failed to install dependencies. Check if pip is installed."
          PYTHON_PID=""
          return 1
        fi
      else
        source venv/bin/activate
        log_message "python" "Installing FastAPI and Uvicorn..."
        pip install fastapi uvicorn >> "$PYTHON_LOG" 2>&1
      fi
    else
      source venv/bin/activate
      log_message "python" "Activated virtual environment"
    fi

    # Run the Python server with explicit path specification
      log_message "python" "Starting FastAPI server with uvicorn..."
      python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 >> "$PYTHON_LOG" 2>&1 &
      PYTHON_PID=$!

      log_message "python" "Python server started with PID: $PYTHON_PID"

      # Verify server is running
      sleep 5  # Give it more time to start
      if ! ps -p $PYTHON_PID > /dev/null; then
        log_message "python" "WARNING: Python server failed to start."
        # Output last 10 lines of log to help debugging
        log_message "python" "Last few lines of server log:"
        tail -n 10 "$PYTHON_LOG" | while read line; do
          log_message "python" "  | $line"
        done
        PYTHON_PID=""
        return 1
      else
        log_message "python" "FastAPI server successfully started at http://localhost:8000"

        # Check if the server is actually responding
        sleep 2
        if command -v curl &> /dev/null; then
          log_message "python" "Testing server response..."
          if curl -s --max-time 5 http://localhost:8000/api/health > /dev/null; then
            log_message "python" "✅ Server is responding correctly"
          else
            log_message "python" "⚠️ Server process is running but not responding to HTTP requests"
          fi
        fi
      fi

  # Trim log if it gets too large
  trim_log "$PYTHON_LOG"

  cd "$SCRIPT_DIR" || exit 1
}

# Create a log rotation function that runs periodically in the background
log_rotation() {
  log_message "management" "Starting log rotation service"

  while true; do
    # Find all log files and trim them if needed
    log_message "management" "Checking logs for rotation..."
    find "$SCRIPT_DIR/logs" -type f -name "*.log" | while read -r log_file; do
      trim_log "$log_file"
    done

    # Check for old log files (older than 30 days)
    log_message "management" "Checking for old log files..."
    find "$SCRIPT_DIR/logs" -type f -name "*.log" -mtime +30 | while read -r old_log; do
      log_message "management" "Archiving old log: $(basename "$old_log")"

      # Create archives directory if it doesn't exist
      mkdir -p "$SCRIPT_DIR/logs/archives"

      # Compress and move to archives
      gzip -c "$old_log" > "$SCRIPT_DIR/logs/archives/$(basename "$old_log").gz"
      rm "$old_log"

      log_message "management" "Archived and removed: $(basename "$old_log")"
    done

    # Sleep for 1 hour before checking again
    sleep 3600
  done
}

# Start log rotation in the background
log_rotation &
LOG_ROTATION_PID=$!

# Save PIDs to file for later use by stop script
echo "LOG_ROTATION_PID=$LOG_ROTATION_PID" > "$SCRIPT_DIR/.server_pids"

# Start the servers
echo "Checking server directories..."
TAURI_PID=""
PYTHON_PID=""

# Start both servers if directories exist
start_tauri
start_python

# Update PID file with actual PIDs
if [ -n "$TAURI_PID" ]; then
  echo "TAURI_PID=$TAURI_PID" >> "$SCRIPT_DIR/.server_pids"
else
  echo "TAURI_PID=" >> "$SCRIPT_DIR/.server_pids"
fi

if [ -n "$PYTHON_PID" ]; then
  echo "PYTHON_PID=$PYTHON_PID" >> "$SCRIPT_DIR/.server_pids"
else
  echo "PYTHON_PID=" >> "$SCRIPT_DIR/.server_pids"
fi

echo "┌────────────────────────────────────────────┐"
echo "│ Servers are now running!                   │"
if [ -n "$PYTHON_PID" ]; then
echo "│ • FastAPI server: http://localhost:8000    │"
fi
echo "│                                            │"
echo "│ • Check logs directory for output files    │"
echo "│ • Run ./monitor_logs.sh to watch logs      │"
echo "│ • Run ./stop_servers.sh to stop servers    │"
echo "└────────────────────────────────────────────┘"

# Define a cleanup function
cleanup() {
  echo "Shutting down servers..."
  if [ -n "$TAURI_PID" ]; then
    kill "$TAURI_PID" 2>/dev/null || true
  fi
  if [ -n "$PYTHON_PID" ]; then
    kill "$PYTHON_PID" 2>/dev/null || true
  fi
  kill "$LOG_ROTATION_PID" 2>/dev/null || true
  exit 0
}

# Register the cleanup function on INT and TERM signals
trap cleanup INT TERM

# Wait for all processes to finish
wait
