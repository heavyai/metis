#!/bin/bash

# SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
set -ex

yarn
pushd packages/data-layer
yarn
popd
pushd packages/view-layer
yarn
popd
