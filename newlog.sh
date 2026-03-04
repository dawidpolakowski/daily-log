#!/bin/sh

LOG_DIR="logs"
TODAY=$(date +%F)
FILE="$LOG_DIR/$TODAY.md"

# create logs directory if missing
mkdir -p "$LOG_DIR"

# create file only if it doesn't exist
if [ ! -f "$FILE" ]; then
    cat <<EOF > "$FILE"
# Development Log - $TODAY

## Work done
-

## Notes
-

## Ideas / Next steps
-

EOF
    echo "Log created: $FILE"
else
    echo "Log already exists: $FILE"
fi