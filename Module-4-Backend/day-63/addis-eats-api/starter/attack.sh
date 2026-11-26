#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
API_KEY="${API_KEY:-}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! "$BASE_URL" =~ ^http://(127\.0\.0\.1|localhost|\[::1\])(:[0-9]+)?$ ]]; then
  echo "Refusing non-loopback target: $BASE_URL" >&2
  exit 2
fi

AUTH_ARGS=()
if [[ -n "$API_KEY" ]]; then
  AUTH_ARGS=(-H "x-api-key: $API_KEY")
fi

probe() {
  local title="$1"
  shift
  printf '\n== %s ==\n' "$title"
  curl --max-time 10 -sS -i "$@"
}

probe "1. BOLA: read a known order ID" \
  "$BASE_URL/api/orders/1" "${AUTH_ARGS[@]}"

probe "2. Broken authentication: omit the API key" \
  "$BASE_URL/api"

probe "3. BOPLA: attempt mass assignment" \
  -X POST "$BASE_URL/api/orders" "${AUTH_ARGS[@]}" \
  -H 'Content-Type: application/json' \
  --data-binary "@$HERE/bad-bodies/mass-assignment.json"

probe "4. Resource consumption: submit an oversized JSON body" \
  -X POST "$BASE_URL/api/orders" "${AUTH_ARGS[@]}" \
  -H 'Content-Type: application/json' \
  --data-binary "@$HERE/bad-bodies/oversized.json"

probe "5. BFLA: attempt an admin-only restaurant write" \
  -X POST "$BASE_URL/api/restaurants" "${AUTH_ARGS[@]}" \
  -H 'Content-Type: application/json' \
  --data '{"name":"Security Probe","area":"Bole"}'

printf '\n== 6. Sensitive business flow: repeat a harmless in-memory order ==\n'
for attempt in 1 2; do
  printf 'Attempt %s: ' "$attempt"
  curl --max-time 10 -sS -o /dev/null -w 'HTTP %{http_code}\n' \
    -X POST "$BASE_URL/api/orders" "${AUTH_ARGS[@]}" \
    -H 'Content-Type: application/json' \
    --data '{"customer":"Security Probe","area":"Bole","totalSantim":1}'
done

probe "7. SSRF: provide a URL to a route that does not fetch caller URLs" \
  "$BASE_URL/api/orders?url=http%3A%2F%2F127.0.0.1%3A1"

printf '\n== 8. Security misconfiguration: inspect security headers ==\n'
curl --max-time 10 -sS -D - -o /dev/null "$BASE_URL/api" |
  grep -Ei '^(HTTP/|strict-transport-security:|x-powered-by:)'

probe "9. Inventory: inspect API docs and probe an unlisted old version" \
  "$BASE_URL/api/v2/orders"

probe "10. Unsafe API consumption: submit an untrusted partner response field" \
  -X POST "$BASE_URL/api/orders" "${AUTH_ARGS[@]}" \
  -H 'Content-Type: application/json' \
  --data-binary "@$HERE/bad-bodies/nosql-injection.json"
