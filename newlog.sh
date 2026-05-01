#!/bin/sh

set -eu

LOG_DIR="logs"
JSON_FILE="$LOG_DIR/logs.json"
TODAY=$(date +%F)
MONTH=$(date +%Y-%m)
MONTH_DIR="$LOG_DIR/$MONTH"
TITLE=${1:-"Development Log - $TODAY"}
FILE="$MONTH_DIR/$TODAY.md"

create_log_file() {
    mkdir -p "$MONTH_DIR"

    if [ -f "$FILE" ]; then
        echo "Log already exists: $FILE"
        return
    fi

    cat <<EOF > "$FILE"
# $TITLE

## Date
$TODAY

## Work done
-

## Notes
-

## Ideas / Next steps
-

EOF

    echo "Log created: $FILE"
}

extract_title() {
    awk '
        /^# / {
            sub(/^# /, "")
            print
            exit
        }
    ' "$1"
}

generate_logs_index() {
    mkdir -p "$LOG_DIR"

    find "$LOG_DIR" -mindepth 2 -maxdepth 2 -type f -name "*.md" | sort -r | while IFS= read -r path; do
        relative_path=${path#"$LOG_DIR"/}
        file_name=${path##*/}
        date_key=${file_name%.md}
        month_key=${relative_path%%/*}
        heading=$(extract_title "$path")

        if [ -z "$heading" ]; then
            heading="Daily Log - $date_key"
        fi

        printf '%s\t%s\t%s\t%s\n' "$date_key" "$month_key" "$relative_path" "$heading"
    done | jq -R -s '
        split("\n")[:-1]
        | map(split("\t"))
        | map({
            date: .[0],
            month: .[1],
            file: .[2],
            title: .[3]
        })
        | sort_by(.date)
        | reverse
    ' > "$JSON_FILE"

    echo "logs.json regenerated: $JSON_FILE"
}

create_log_file
generate_logs_index
