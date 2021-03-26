import patchMethod from "patch-method";

patchMethod(
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("class-transformer/cjs/TransformOperationExecutor").TransformOperationExecutor,
  "transform",
  (transform, source, value: any, targetType, arrayType, isMap, level = 0) => {
    if (value && typeof value === "object" && typeof value.then === "function") {
      return value;
    }

    return transform(source, value, targetType, arrayType, isMap, level);
  }
);
