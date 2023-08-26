// copied from `./TemplateCode`
const TEMPLATE_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  // Write the logic here
  return "0"; // returns string instead of number
}
`;

// copied from `./TemplateCode`
const TEMPLATE_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  // Write the logic here
  return "0"; // returns string instead of number
}
`;

const ADD_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.a.length !== 1) {
    throw new Error("Should have exactly 1 input node for port a");
  }
  if (fInputPortToNodes.b.length !== 1) {
    throw new Error("Should have exactly 1 input node for port b");
  }
  const aInputNodeId = fInputPortToNodes.a[0];
  const bInputNodeId = fInputPortToNodes.b[0];
  const a = parseFloat(fInputNodeToValues[aInputNodeId]);
  const b = parseFloat(fInputNodeToValues[bInputNodeId]);
  const y = a + b;
  return \`\${y}\`;
}
`;

const ADD_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the
 * keys are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the
 * keys are node IDs and the values are node values of the connected input
 * nodes. Example data for product:
 * \`\`\`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  const hasXInA = fInputPortToNodes.a.includes(xId);
  const hasXInB = fInputPortToNodes.b.includes(xId);
  if (!hasXInA && !hasXInB) {
    return "0";
  }
  return "1";
}
`;

const MULTIPLY_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.a.length !== 1) {
    throw new Error("Should have exactly 1 input node for port a");
  }
  if (fInputPortToNodes.b.length !== 1) {
    throw new Error("Should have exactly 1 input node for port b");
  }
  const aInputNodeId = fInputPortToNodes.a[0];
  const bInputNodeId = fInputPortToNodes.b[0];
  const a = parseFloat(fInputNodeToValues[aInputNodeId]);
  const b = parseFloat(fInputNodeToValues[bInputNodeId]);
  const y = a * b;
  return \`\${y}\`;
}
`;

const MULTIPLY_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the
 * keys are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the
 * keys are node IDs and the values are node values of the connected input
 * nodes. Example data for product:
 * \`\`\`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  const hasXInA = fInputPortToNodes.a.includes(xId);
  const hasXInB = fInputPortToNodes.b.includes(xId);
  if (!hasXInA && !hasXInB) {
    return "0";
  }
  const aInputNodeId = fInputPortToNodes.a[0];
  const bInputNodeId = fInputPortToNodes.b[0];
  const a = parseFloat(fInputNodeToValues[aInputNodeId]);
  const b = parseFloat(fInputNodeToValues[bInputNodeId]);
  return hasXInA ? \`\${b}\` : \`\${a}\`;
}
`;

const SUM_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  let sum = 0;
  fInputPortToNodes.x_i.forEach((inputNodeId) => {
    const inputNodeValue = parseFloat(fInputNodeToValues[inputNodeId]);
    sum += inputNodeValue;
  });
  return \`\${sum}\`;
}
`;

const SUM_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the
 * keys are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the
 * keys are node IDs and the values are node values of the connected input
 * nodes. Example data for product:
 * \`\`\`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (!fInputPortToNodes.x_i.includes(xId)) {
    return "0";
  }
  return "1";
}
`;

const PRODUCT_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  let product = 1;
  fInputPortToNodes.x_i.forEach((inputNodeId) => {
    const inputNodeValue = parseFloat(fInputNodeToValues[inputNodeId]);
    product *= inputNodeValue;
  });
  return \`\${product}\`;
}
`;

const PRODUCT_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the
 * keys are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the
 * keys are node IDs and the values are node values of the connected input
 * nodes. Example data for product:
 * \`\`\`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (!fInputPortToNodes.x_i.includes(xId)) {
    return "0";
  }
  let df = 1;
  fInputPortToNodes.x_i.forEach((inputNodeId) => {
    if (inputNodeId !== xId) {
      const inputNodeValue = parseFloat(fInputNodeToValues[inputNodeId]);
      df *= inputNodeValue;
    }
  });
  return \`\${df}\`;
}
`;

const IDENTITY_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  return \`\${x}\`;
}
`;

const IDENTITY_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the
 * keys are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the
 * keys are node IDs and the values are node values of the connected input
 * nodes. Example data for product:
 * \`\`\`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  return "1";
}
`;

const RELU_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const y = Math.max(0, x);
  return \`\${y}\`;
}
`;

const RELU_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the
 * keys are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the
 * keys are node IDs and the values are node values of the connected input
 * nodes. Example data for product:
 * \`\`\`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const df = x > 0 ? 1 : 0;
  return \`\${df}\`;
}
`;

const SIGMOID_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const y = 1 / (1 + Math.exp(-x));
  return \`\${y}\`;
}
`;

const SIGMOID_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the
 * keys are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the
 * keys are node IDs and the values are node values of the connected input
 * nodes. Example data for product:
 * \`\`\`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const sigmoid = 1 / (1 + Math.exp(-x));
  const df = sigmoid * (1 - sigmoid);
  return \`\${df}\`;
}
`;

const SQUARED_ERROR_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * \`f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6\`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.y_true.length !== 1) {
    throw new Error("Should have exactly 1 input node for port y_true");
  }
  if (fInputPortToNodes.y_estimate.length !== 1) {
    throw new Error("Should have exactly 1 input node for port y_estimate");
  }
  const yTrueInputNodeId = fInputPortToNodes.y_true[0];
  const yEstimateInputNodeId = fInputPortToNodes.y_estimate[0];
  const yTrue = parseFloat(fInputNodeToValues[yTrueInputNodeId]);
  const yEstimate = parseFloat(fInputNodeToValues[yEstimateInputNodeId]);
  const y = Math.pow(yTrue - yEstimate, 2);
  return \`\${y}\`;
}
`;

const SQUARED_ERROR_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the
 * keys are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the
 * keys are node IDs and the values are node values of the connected input
 * nodes. Example data for product:
 * \`\`\`javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume \`xId\` is "v2", then the value is "3"
 * since \`f = v1 * v3 * v2\` and \`df/dx = v1 * v3 = 3\`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  const hasXInYTrue = fInputPortToNodes.y_true.includes(xId);
  const hasXInYEstimate = fInputPortToNodes.y_estimate.includes(xId);
  if (!hasXInYTrue && !hasXInYEstimate) {
    return "0";
  }
  const yTrueInputNodeId = fInputPortToNodes.y_true[0];
  const yEstimateInputNodeId = fInputPortToNodes.y_estimate[0];
  const yTrue = parseFloat(fInputNodeToValues[yTrueInputNodeId]);
  const yEstimate = parseFloat(fInputNodeToValues[yEstimateInputNodeId]);
  let df = 0;
  if (hasXInYTrue) {
    df = 2 * (yTrue - yEstimate);
  } else {
    df = 2 * (yEstimate - yTrue);
  }
  return \`\${df}\`;
}
`;

export {
  ADD_DFDX_CODE,
  ADD_F_CODE,
  IDENTITY_DFDX_CODE,
  IDENTITY_F_CODE,
  MULTIPLY_DFDX_CODE,
  MULTIPLY_F_CODE,
  PRODUCT_DFDX_CODE,
  PRODUCT_F_CODE,
  RELU_DFDX_CODE,
  RELU_F_CODE,
  SIGMOID_DFDX_CODE,
  SIGMOID_F_CODE,
  SQUARED_ERROR_DFDX_CODE,
  SQUARED_ERROR_F_CODE,
  SUM_DFDX_CODE,
  SUM_F_CODE,
  TEMPLATE_DFDX_CODE,
  TEMPLATE_F_CODE,
};
