#!/bin/bash
set -ex

pushd packages/data-layer
../../node_modules/.bin/rimraf lib dist es coverage
popd
pushd packages/view-layer
../../node_modules/.bin/rimraf lib dist es coverage
popd
