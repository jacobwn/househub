#!/bin/bash

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --name)
      RUNNER_NAME="$2"
      shift 2
      ;;
    --repo)
      REPO_URL="$2"
      shift 2
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo "Setting up GitHub runner '$RUNNER_NAME' for repo '$REPO_URL'"