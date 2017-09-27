#!/bin/bash

# Build View Layer

./node_modules/.bin/cross-env BABEL_ENV=es NODE_ENV=development \
  ./node_modules/.bin/rollup \
    --config ./packages/view-layer/rollup.config.js \
    --input ./packages/view-layer/src/index.js \
    --output ./packages/view-layer/dist/mapd-view-layer.js \

./node_modules/.bin/cross-env BABEL_ENV=es NODE_ENV=production \
  ./node_modules/.bin/rollup \
    --config ./packages/view-layer/rollup.config.js \
    --input ./packages/view-layer/src/index.js \
    --output ./packages/view-layer/dist/mapd-view-layer.min.js \

./node_modules/.bin/cross-env BABEL_ENV=commonjs \
  ./node_modules/.bin/babel ./packages/view-layer/src \
    --out-dir ./packages/view-layer/lib \

  ./node_modules/.bin/cross-env BABEL_ENV=es \
    ./node_modules/.bin/babel ./packages/view-layer/src \
      --out-dir ./packages/view-layer/es \

# Build Data Layer

./node_modules/.bin/cross-env BABEL_ENV=es NODE_ENV=development \
  ./node_modules/.bin/rollup \
    --config ./packages/data-layer/rollup.config.js \
    --input ./packages/data-layer/src/index.js \
    --output ./packages/data-layer/dist/mapd-data-layer.js \

./node_modules/.bin/cross-env BABEL_ENV=es NODE_ENV=production \
  ./node_modules/.bin/rollup \
    --config ./packages/data-layer/rollup.config.js \
    --input ./packages/data-layer/src/index.js \
    --output ./packages/data-layer/dist/mapd-data-layer.min.js \

./node_modules/.bin/cross-env BABEL_ENV=commonjs \
  ./node_modules/.bin/babel ./packages/data-layer/src \
    --out-dir ./packages/data-layer/lib \

  ./node_modules/.bin/cross-env BABEL_ENV=es \
    ./node_modules/.bin/babel ./packages/data-layer/src \
      --out-dir ./packages/data-layer/es \
