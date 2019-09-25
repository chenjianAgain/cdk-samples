#!/bin/bash
set -e

init_web_identity() {
    aws sts assume-role-with-web-identity \
    --role-arn $AWS_ROLE_ARN \
    --role-session-name mh9test \
    --web-identity-token file://$AWS_WEB_IDENTITY_TOKEN_FILE \
    --duration-seconds 1000 > /tmp/irp-cred.txt
    export AWS_ACCESS_KEY_ID="$(cat /tmp/irp-cred.txt | jq -r ".Credentials.AccessKeyId")"
    export AWS_SECRET_ACCESS_KEY="$(cat /tmp/irp-cred.txt | jq -r ".Credentials.SecretAccessKey")"
    export AWS_SESSION_TOKEN="$(cat /tmp/irp-cred.txt | jq -r ".Credentials.SessionToken")"
    rm /tmp/irp-cred.txt
}

if [[ -f $AWS_WEB_IDENTITY_TOKEN_FILE ]]; then
  echo "found AWS_WEB_IDENTITY_TOKEN_FILE at $AWS_WEB_IDENTITY_TOKEN_FILE"
  init_web_identity
fi

exec "$@"
