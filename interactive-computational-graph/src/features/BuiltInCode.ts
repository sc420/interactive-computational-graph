// copied from `./TemplateCode`
const TEMPLATE_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`json
 * {
 *   "x_i": ["1", "2", "3"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`\`\`json
 * {
 *   "1": "1",
 *   "2": "2",
 *   "3": "3"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * f([v1, v2, v3]) = v1 * v2 * v3 = 1 * 2 * 3 = 6.
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
 * \`\`\`json
 * {
 *   "x_i": ["1", "2", "3"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`\`\`json
 * {
 *   "1": "1",
 *   "2": "2",
 *   "3": "3"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "v2", then the value is "3"
 * since f = v1 * v2 * v3 and df/dx = v1 * v3 = 3.
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
 * Example data for add:
 * \`\`\`json
 * {
 *   "a": ["0"],
 *   "b": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for add:
 * \`\`\`json
 * {
 *   "0": "0.2",
 *   "1": "0.4"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0.6" because
 * f(a, b) = a + b = 0.2 + 0.4 = 0.6.
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
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for add:
 * \`\`\`json
 * {
 *   "a": ["0"],
 *   "b": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for add:
 * \`\`\`json
 * {
 *   "0": "0.2",
 *   "1": "0.4"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "1", then the value is "1"
 * since f(a, b) = a + b and df/dx = df/db = 1.
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
 * Example data for multiply:
 * \`\`\`json
 * {
 *   "a": ["0"],
 *   "b": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for multiply:
 * \`\`\`json
 * {
 *   "0": "0.2",
 *   "1": "0.4"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0.08" because
 * f(a, b) = a * b = 0.2 * 0.4 = 0.08.
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
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for multiply:
 * \`\`\`json
 * {
 *   "a": ["0"],
 *   "b": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for multiply:
 * \`\`\`json
 * {
 *   "0": "0.2",
 *   "1": "0.4"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "1", then the value is "0.2"
 * since f(a, b) = a * b and df/dx = df/db = a = 0.2.
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
 * Example data for sum:
 * \`\`\`json
 * {
 *   "x_i": ["0", "1", "2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for sum:
 * \`\`\`json
 * {
 *   "0": "0.2",
 *   "1": "0.4",
 *   "2": "0.6"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "1.2" because
 * f(x_i) = x_0 + x_1 + x_2 = 0.2 + 0.4 + 0.6 = 1.2.
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
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for sum:
 * \`\`\`json
 * {
 *   "x_i": ["0", "1", "2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for sum:
 * \`\`\`json
 * {
 *   "0": "0.2",
 *   "1": "0.4",
 *   "2": "0.6"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "1", then the value is "1"
 * since f(x_i) = x_0 + x_1 + x_2 and df/dx = df/d(x_1) = 1.
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
 * \`\`\`json
 * {
 *   "x_i": ["0", "1", "2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`\`\`json
 * {
 *   "0": "1",
 *   "1": "2",
 *   "2": "3"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * f(x_i) = x_0 * x_1 * x_2 = 1 * 2 * 3 = 6.
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
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * \`\`\`json
 * {
 *   "x_i": ["0", "1", "2"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * \`\`\`json
 * {
 *   "0": "1",
 *   "1": "2",
 *   "2": "3"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "1", then the value is "3"
 * since f(x_i) = x_0 * x_1 * x_2 and df/dx = df/d(x_1) = x_0 * x_2 = 1 * 3 =
 * 3.
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

const COS_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for cos:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for cos:
 * \`\`\`json
 * {
 *   "0": "0"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "1" because
 * f(x) = cos(x) = cos(0) = 1.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const y = Math.cos(x);
  return \`\${y}\`;
}
`;

const COS_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for cos:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for cos:
 * \`\`\`json
 * {
 *   "0": "0"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "0", then the value is "0"
 * since f(x) = cos(x) and df/dx = -sin(x) = 0.
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
  const df = -Math.sin(x);
  return \`\${df}\`;
}
`;

const IDENTITY_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for identity:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for identity:
 * \`\`\`json
 * {
 *   "0": "0.5"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0.5" because
 * f(x) = x = 0.5.
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
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for identity:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for identity:
 * \`\`\`json
 * {
 *   "0": "0.5"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "0", then the value is "1"
 * since f(x) = x and df/dx = 1.
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
 * Example data for ReLU:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for ReLU:
 * \`\`\`json
 * {
 *   "0": "0.5"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0.5" because
 * f(x) = max(0, x) = max(0, 0.5) = 0.5.
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
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for ReLU:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for ReLU:
 * \`\`\`json
 * {
 *   "0": "0.5"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "0", then the value is "1"
 * since f(x) = max(0, x) and df/dx = 1 (x > 0).
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
 * Example data for sigmoid:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for sigmoid:
 * \`\`\`json
 * {
 *   "0": "0"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0.5" because
 * f(x) = 1 / (1 + e^(-x)) = 1 / (1 + e^0) = 0.5.
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
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for sigmoid:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for sigmoid:
 * \`\`\`json
 * {
 *   "0": "0"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "v2", then the value is "3"
 * since f(x) = sigmoid(x) and df/dx = sigmoid(x) * (1 - sigmoid(x)) =
 * 0.5 * (1 - 0.5) = 0.25.
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
 * Example data for squared error:
 * \`\`\`json
 * {
 *   "y_t": ["0"],
 *   "y_e": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for squared error:
 * \`\`\`json
 * {
 *   "0": "0",
 *   "1": "0.5"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0.25" because
 * f(y_t, y_e) = (y_t - y_e)^2 = (0 - 0.5)^2 = 0.25.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.y_t.length !== 1) {
    throw new Error("Should have exactly 1 input node for port y_t");
  }
  if (fInputPortToNodes.y_e.length !== 1) {
    throw new Error("Should have exactly 1 input node for port y_e");
  }
  const yTrueInputNodeId = fInputPortToNodes.y_t[0];
  const yEstimateInputNodeId = fInputPortToNodes.y_e[0];
  const yTrue = parseFloat(fInputNodeToValues[yTrueInputNodeId]);
  const yEstimate = parseFloat(fInputNodeToValues[yEstimateInputNodeId]);
  const y = Math.pow(yTrue - yEstimate, 2);
  return \`\${y}\`;
}
`;

const SQUARED_ERROR_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for squared error:
 * \`\`\`json
 * {
 *   "y_t": ["0"],
 *   "y_e": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for squared error:
 * \`\`\`json
 * {
 *   "0": "0",
 *   "1": "0.5"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "0", then the value is "-1"
 * since f(y_t, y_e) = (y_t - y_e)^2 and df/d(y_t) = 2 * (y_t - y_e) =
 * 2 * (0 - 0.5) = -1.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  const hasXInYTrue = fInputPortToNodes.y_t.includes(xId);
  const hasXInYEstimate = fInputPortToNodes.y_e.includes(xId);
  if (!hasXInYTrue && !hasXInYEstimate) {
    return "0";
  }
  const yTrueInputNodeId = fInputPortToNodes.y_t[0];
  const yEstimateInputNodeId = fInputPortToNodes.y_e[0];
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
  COS_DFDX_CODE,
  COS_F_CODE,
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
