#!/usr/bin/env bash
set -e
BASE_URL="${BASE_URL:-http://localhost:5000}"
COOKIE_FILE="${COOKIE_FILE:-cookies.txt}"
USER_NAME="testuser$RANDOM"

curl -fsS "$BASE_URL/" >/dev/null
curl -fsS "$BASE_URL/isbn/1" >/dev/null
curl -fsS "$BASE_URL/author/Austen" >/dev/null
curl -fsS "$BASE_URL/title/Pride" >/dev/null
curl -fsS -X POST "$BASE_URL/register" -H "Content-Type: application/json" -d "{\"username\":\"$USER_NAME\",\"password\":\"test123\"}" >/dev/null
curl -fsS -X POST "$BASE_URL/customer/login" -H "Content-Type: application/json" -d "{\"username\":\"$USER_NAME\",\"password\":\"test123\"}" -c "$COOKIE_FILE" >/dev/null
curl -fsS -X PUT "$BASE_URL/customer/auth/review/1?review=Excellent%20book" -b "$COOKIE_FILE" >/dev/null
curl -fsS -X DELETE "$BASE_URL/customer/auth/review/1" -b "$COOKIE_FILE" >/dev/null
rm -f "$COOKIE_FILE"
echo "Smoke test passed"
