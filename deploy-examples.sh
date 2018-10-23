#!/bin/bash
set -o errexit

# config
git config --global user.email "marcus.klein@live.com"
git config --global user.name "Travis CI"

# build
yarn build:example

# deploy
cd examples/build
git init
git add .
git commit -m "Deploy to Github Pages"
git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git" master:gh-pages > /dev/null 2>&1