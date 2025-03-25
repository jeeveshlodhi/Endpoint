#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create a new terminal window and monitor logs
monitor_logs() {
    # Check if any log files exist
    if [ -z "$(ls -A "$SCRIPT_DIR/logs/" 2>/dev/null)" ]; then
    echo "No log files found in logs directory."
    echo "Start the servers first with ./run_servers.sh"
    exit 1
    }

    echo "Opening new terminal to monitor logs..."
    osascript -e 'tell application "Terminal" to do script "echo \"Log Monitor - Press Ctrl+C to exit\"; tail -f '"$SCRIPT_DIR"'/logs/*.log"'
}

monitor_logs
