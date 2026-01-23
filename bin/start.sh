#!/bin/sh

# This script starts the Node.js server and checks if it has started
# successfully before starting Nginx.

# Change to the application directory
cd /app

echo "Starting Node.js server..."
# Start the Node.js server in the background and redirect its output
node server.cjs > /dev/stdout 2> /dev/stderr &

# Get the Process ID (PID) of the Node.js server
NODE_PID=$!

# Wait a few seconds to allow the server to initialize or fail
sleep 3

# Check if the Node.js process is still running.
# kill -0 PID checks for the process's existence without sending a signal.
if ! kill -0 $NODE_PID > /dev/null 2>&1; then
  echo "FATAL: Node.js server failed to start."
  exit 1
else
  echo "Node.js server started successfully with PID $NODE_PID."
fi

# If the script reaches this point, the Node.js server is running.
# Now, start Nginx in the foreground.
echo "Starting Nginx..."
nginx -g 'daemon off;'
