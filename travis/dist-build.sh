#!/bin/bash

echo "$TRAVIS_BRANCH and ${TRAVIS_BRANCH:0:1}"

if [ "$TRAVIS_BRANCH" == "develop" ] || "$TRAVIS_BRANCH" == "master" || [ ${TRAVIS_BRANCH:0:1} == "v" ]; then
    echo "Building distribution for latest push to develop or tag."
    npm run build

    cp -pr ./dist "./$TRAVIS_BRANCH"
    rsync -e 'ssh -i /tmp/cloud_rsa' -r --delete-after --quiet "./$TRAVIS_BRANCH" "milesap@fgpv.org:/disk/static/builds/$TRAVIS_REPO_SLUG"
    rm -rf "./$TRAVIS_BRANCH"

    mv ./docs "./$TRAVIS_BRANCH"
    rsync -e 'ssh -i /tmp/cloud_rsa' -r --delete-after --quiet "./$TRAVIS_BRANCH" "milesap@fgpv.org:/disk/static/docs/$TRAVIS_REPO_SLUG"
fi