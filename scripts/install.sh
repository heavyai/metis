#!/bin/bash
set -ex

yarn
pushd packages/data-layer
yarn
popd
pushd packages/view-layer
yarn
popd
