#!/bin/bash

# SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
set -ex

pushd packages/data-layer
../../node_modules/.bin/rimraf lib dist es coverage
popd
pushd packages/view-layer
../../node_modules/.bin/rimraf lib dist es coverage
popd
