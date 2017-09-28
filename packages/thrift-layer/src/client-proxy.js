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
