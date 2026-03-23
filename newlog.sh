#!/bin/sh

LOG_DIR="logs"
JSON_FILE="$LOG_DIR/logs.json"
TODAY=$(date +%F)
FILE="$LOG_DIR/$TODAY.md"

# create logs directory if missing
mkdir -p "$LOG_DIR"

# create log file if not exists
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

# generate logs.json from all .md files
ls "$LOG_DIR"/*.md 2>/dev/null | sed 's#.*/##' | jq -R -s '
split("\n")[:-1]
| map({
    title: ("Daily Log - " + (. | rtrimstr(".md"))),
    file: .
})
| sort_by(.file)
| reverse
' > "$JSON_FILE"

echo "logs.json regenerated: $JSON_FILE"