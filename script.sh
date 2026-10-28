#!/bin/bash

# Define the root directory (default is the current directory, change if necessary)
ROOT_DIR="."  # You can replace this with a specific path if needed

# Use find to search for 'node_modules' directories and delete them
find "$ROOT_DIR" -type d -name "node_modules" -exec rm -rf {} +

# Print a message when done
echo "'node_modules' directories have been deleted from all subdirectories."