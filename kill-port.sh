#!/bin/bash

# kill-port.sh - Find and terminate applications running on specific ports
# Usage: ./kill-port.sh [port1] [port2] ... [portN]
# Example: ./kill-port.sh 3000 8080 5175

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display usage
usage() {
    echo -e "${BLUE}Usage:${NC} $0 [port1] [port2] ... [portN]"
    echo -e "${BLUE}Example:${NC} $0 3000 8080 5175"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  -h, --help    Show this help message"
    echo "  -l, --list    List processes on specified ports without killing"
    echo "  -f, --force   Force kill (SIGKILL) instead of graceful termination (SIGTERM)"
    echo ""
}

# Function to check if port is valid
is_valid_port() {
    local port=$1
    if [[ $port =~ ^[0-9]+$ ]] && [ $port -ge 1 ] && [ $port -le 65535 ]; then
        return 0
    else
        return 1
    fi
}

# Function to find process on port
find_process_on_port() {
    local port=$1
    lsof -ti :$port 2>/dev/null
}

# Function to get process details
get_process_details() {
    local pid=$1
    ps -p $pid -o pid,ppid,user,command 2>/dev/null | tail -n +2
}

# Function to kill process
kill_process() {
    local pid=$1
    local signal=${2:-TERM}  # Default to SIGTERM
    local port=$3
    
    if kill -$signal $pid 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Successfully sent SIG$signal to process $pid on port $port"
        
        # Wait a moment and check if process is still running
        sleep 1
        if kill -0 $pid 2>/dev/null; then
            echo -e "${YELLOW}⚠${NC} Process $pid still running, you may need to use --force"
            return 1
        else
            echo -e "${GREEN}✓${NC} Process $pid terminated successfully"
            return 0
        fi
    else
        echo -e "${RED}✗${NC} Failed to kill process $pid on port $port"
        return 1
    fi
}

# Parse command line arguments
LIST_ONLY=false
FORCE_KILL=false
PORTS=()

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -l|--list)
            LIST_ONLY=true
            shift
            ;;
        -f|--force)
            FORCE_KILL=true
            shift
            ;;
        -*)
            echo -e "${RED}Error:${NC} Unknown option $1"
            usage
            exit 1
            ;;
        *)
            if is_valid_port $1; then
                PORTS+=($1)
            else
                echo -e "${RED}Error:${NC} Invalid port number: $1"
                exit 1
            fi
            shift
            ;;
    esac
done

# Check if any ports were provided
if [ ${#PORTS[@]} -eq 0 ]; then
    echo -e "${RED}Error:${NC} No ports specified"
    usage
    exit 1
fi

echo -e "${BLUE}Checking ports:${NC} ${PORTS[*]}"
echo ""

# Process each port
for port in "${PORTS[@]}"; do
    echo -e "${BLUE}Port $port:${NC}"
    
    # Find processes on this port
    pids=$(find_process_on_port $port)
    
    if [ -z "$pids" ]; then
        echo -e "  ${YELLOW}No processes found on port $port${NC}"
        echo ""
        continue
    fi
    
    # Process each PID found on this port
    for pid in $pids; do
        echo -e "  ${GREEN}Found process:${NC}"
        
        # Get process details
        details=$(get_process_details $pid)
        if [ -n "$details" ]; then
            echo "    $details"
        else
            echo -e "    ${YELLOW}Process $pid (details unavailable)${NC}"
        fi
        
        if [ "$LIST_ONLY" = true ]; then
            echo ""
            continue
        fi
        
        # Ask for confirmation unless force is used
        if [ "$FORCE_KILL" = false ]; then
            echo -n "  Kill this process? [y/N]: "
            read -r response
            case $response in
                [yY]|[yY][eE][sS])
                    signal="TERM"
                    ;;
                *)
                    echo -e "  ${YELLOW}Skipped${NC}"
                    echo ""
                    continue
                    ;;
            esac
        else
            signal="KILL"
            echo -e "  ${RED}Force killing process...${NC}"
        fi
        
        # Kill the process
        if kill_process $pid $signal $port; then
            echo ""
        else
            echo ""
        fi
    done
done

if [ "$LIST_ONLY" = true ]; then
    echo -e "${BLUE}Listing complete. Use without --list to terminate processes.${NC}"
else
    echo -e "${GREEN}Port cleanup complete!${NC}"
fi
