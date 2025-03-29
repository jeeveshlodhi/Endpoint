#!/usr/bin/env bash

# Enhanced server management script with simplified logging

# ------- Configuration Section -------
readonly MAX_LOG_LINES=1000
readonly PYTHON_PORT=8000
readonly SCRIPT_NAME=$(basename "$0")

# ------- Initialization -------
# Get the directory where the script is located
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOGS_DIR="${SCRIPT_DIR}/logs"
readonly PID_FILE="${SCRIPT_DIR}/.server_pids"
readonly TAURI_LOG="${LOGS_DIR}/tauri.log"
readonly PYTHON_LOG="${LOGS_DIR}/python.log"

# ------- Helper Functions -------
get_timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

# Simplified logging function
log_message() {
  local log_file="$1"
  local message="$2"

  # Create logs directory if it doesn't exist
  mkdir -p "${LOGS_DIR}"

  local log_entry="$(get_timestamp) - ${message}"

  # Log to file and trim if needed
  echo "${log_entry}" >> "${log_file}"
  trim_log "${log_file}"

  # Also show message to console
  echo "${log_entry}"
}

# Function to trim log files
trim_log() {
  local log_file="$1"
  local temp_file

  if [[ -f "${log_file}" ]]; then
    local line_count=$(wc -l < "${log_file}")

    if [[ "${line_count}" -gt "${MAX_LOG_LINES}" ]]; then
      temp_file=$(mktemp)
      # Keep last MAX_LOG_LINES lines
      tail -n "${MAX_LOG_LINES}" "${log_file}" > "${temp_file}"
      mv "${temp_file}" "${log_file}"
    fi
  fi
}

# Function to check if a process is running
is_process_running() {
  local pid="$1"
  if [[ -z "${pid}" ]]; then
    return 1
  fi
  if ps -p "${pid}" > /dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

# Function to verify port availability
is_port_available() {
  local port="$1"
  if command -v lsof > /dev/null 2>&1; then
    if lsof -i :"${port}" > /dev/null 2>&1; then
      return 1
    else
      return 0
    fi
  else
    # Fallback using netstat if lsof not available
    if netstat -tuln | grep -q ":${port} "; then
      return 1
    else
      return 0
    fi
  fi
}

# ------- Server Management Functions -------
start_tauri() {
  log_message "${TAURI_LOG}" "Starting Tauri server..."

  if [[ ! -d "${SCRIPT_DIR}" ]]; then
    log_message "${TAURI_LOG}" "ERROR: Tauri app directory not found at ${SCRIPT_DIR}"
    return 1
  fi

  # Check for node_modules
  if [[ ! -d "${SCRIPT_DIR}/node_modules" ]]; then
    log_message "${TAURI_LOG}" "Node modules not found. Installing dependencies..."
    if ! npm install >> "${TAURI_LOG}" 2>&1; then
      log_message "${TAURI_LOG}" "ERROR: Failed to install node modules"
      return 1
    fi
  fi

  cd "${SCRIPT_DIR}" || return 1
  log_message "${TAURI_LOG}" "Working directory: $(pwd)"

  # Start Tauri in development mode
  log_message "${TAURI_LOG}" "Executing 'npm run tauri dev'"
  npm run tauri dev >> "${TAURI_LOG}" 2>&1 &
  local pid=$!

  # Wait briefly to check if process started
  sleep 2
  if is_process_running "${pid}"; then
    log_message "${TAURI_LOG}" "Tauri server started with PID: ${pid}"
    echo "TAURI_PID=${pid}" >> "${PID_FILE}"
    return 0
  else
    log_message "${TAURI_LOG}" "ERROR: Tauri server failed to start"
    log_message "${TAURI_LOG}" "Last 10 lines of log:"
    tail -n 10 "${TAURI_LOG}" | while read -r line; do
      log_message "${TAURI_LOG}" "${line}"
    done
    return 1
  fi
}

start_python() {
  local server_dir="${SCRIPT_DIR}/server"

  log_message "${PYTHON_LOG}" "Starting Python server..."

  # Verify Python is available
  if ! command -v python3 > /dev/null 2>&1; then
    log_message "${PYTHON_LOG}" "ERROR: Python3 is not installed or not in PATH"
    return 1
  fi

  # Check port availability
  if ! is_port_available "${PYTHON_PORT}"; then
    log_message "${PYTHON_LOG}" "ERROR: Port ${PYTHON_PORT} is already in use"
    return 1
  fi

  # Create server directory if needed
  if [[ ! -d "${server_dir}" ]]; then
    log_message "${PYTHON_LOG}" "Creating server directory at ${server_dir}"
    mkdir -p "${server_dir}"
  fi

  cd "${server_dir}" || return 1
  log_message "${PYTHON_LOG}" "Working directory: $(pwd)"

  # Set up virtual environment
  if [[ ! -d "venv" ]]; then
    log_message "${PYTHON_LOG}" "Creating Python virtual environment..."
    if ! python3 -m venv venv >> "${PYTHON_LOG}" 2>&1; then
      log_message "${PYTHON_LOG}" "ERROR: Failed to create virtual environment"
      return 1
    fi
  fi

  # Activate virtual environment
  source venv/bin/activate
  log_message "${PYTHON_LOG}" "Virtual environment activated"

  # Install dependencies
  if [[ -f "requirements.txt" ]]; then
    log_message "${PYTHON_LOG}" "Installing dependencies from requirements.txt..."
    if ! pip install -r requirements.txt >> "${PYTHON_LOG}" 2>&1; then
      log_message "${PYTHON_LOG}" "ERROR: Failed to install dependencies from requirements.txt"
      return 1
    fi
  else
    log_message "${PYTHON_LOG}" "WARNING: requirements.txt not found. Installing default packages..."
    if ! pip install fastapi uvicorn psutil >> "${PYTHON_LOG}" 2>&1; then
      log_message "${PYTHON_LOG}" "ERROR: Failed to install default packages"
      return 1
    fi
  fi

  # Start FastAPI server
  log_message "${PYTHON_LOG}" "Starting FastAPI server on port ${PYTHON_PORT}..."
  python3 -m uvicorn main:app --reload --host 0.0.0.0 --port "${PYTHON_PORT}" >> "${PYTHON_LOG}" 2>&1 &
  local pid=$!

  # Give server time to start
  sleep 5

  if is_process_running "${pid}"; then
    log_message "${PYTHON_LOG}" "Python server started with PID: ${pid}"
    echo "PYTHON_PID=${pid}" >> "${PID_FILE}"

    # Verify server is responding
    if command -v curl > /dev/null 2>&1; then
      log_message "${PYTHON_LOG}" "Testing server health endpoint..."
      if curl -s --max-time 5 "http://localhost:${PYTHON_PORT}/api/health" > /dev/null; then
        log_message "${PYTHON_LOG}" "✅ Server is responding correctly"
      else
        log_message "${PYTHON_LOG}" "⚠️ Server process is running but not responding to HTTP requests"
      fi
    fi
    return 0
  else
    log_message "${PYTHON_LOG}" "ERROR: Python server failed to start"
    log_message "${PYTHON_LOG}" "Last 10 lines of log:"
    tail -n 10 "${PYTHON_LOG}" | while read -r line; do
      log_message "${PYTHON_LOG}" "${line}"
    done
    return 1
  fi
}

# ------- Main Process -------
main() {
  # Initialize PID file
  > "${PID_FILE}"

  # Create logs directory
  mkdir -p "${LOGS_DIR}"

  # Initialize log files
  > "${TAURI_LOG}"
  > "${PYTHON_LOG}"

  # Start servers
  start_python
  start_tauri

  # Display status information
  echo "┌────────────────────────────────────────────┐"
  echo "│ Servers are now running!                   │"
  if grep -q "PYTHON_PID" "${PID_FILE}"; then
    echo "│ • FastAPI server: http://localhost:${PYTHON_PORT}    │"
  fi
  echo "│                                            │"
  echo "│ • Tauri logs: ${TAURI_LOG}    │"
  echo "│ • Python logs: ${PYTHON_LOG}  │"
  echo "│ • Run ./stop_servers.sh to stop servers    │"
  echo "└────────────────────────────────────────────┘"

  # Cleanup function
  cleanup() {
    log_message "${PYTHON_LOG}" "Shutting down servers..."

    # Read PIDs from file
    source "${PID_FILE}" 2> /dev/null || true

    # Kill processes if they're running
    if is_process_running "${PYTHON_PID}"; then
      kill "${PYTHON_PID}" 2>/dev/null
    fi

    if is_process_running "${TAURI_PID}"; then
      kill "${TAURI_PID}" 2>/dev/null
    fi

    # Remove PID file
    rm -f "${PID_FILE}"

    log_message "${PYTHON_LOG}" "Servers shut down complete"
    exit 0
  }

  # Trap signals
  trap cleanup INT TERM EXIT

  # Wait indefinitely until interrupted
  while true; do
    sleep 3600 & wait $!
  done
}

# Start the main function
main
