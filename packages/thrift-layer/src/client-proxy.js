// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

export default {
  get(target, methodName) {
    const originalMethod = target[methodName];
    return function(...args) {
      const callback = args.pop();
      if (typeof callback === "function") {
        return originalMethod.call(target, ...args, result => {
          if (result instanceof Thrift.TException) {
            callback(result);
          } else {
            callback(null, result);
          }
        });
      } else {
        originalMethod.call(target, ...args, callback);
      }
    };
  }
};
