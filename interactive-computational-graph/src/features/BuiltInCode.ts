// copied from `./TemplateCode`
const TEMPLATE_F_CODE = `\
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
  if (fInputPortToNodes.a.length !== 1) {
    throw new Error("Should have exactly 1 input node for port a");
  }
  if (fInputPortToNodes.b.length !== 1) {
    throw new Error("Should have exactly 1 input node for port b");
  }
  const hasXInA = fInputPortToNodes.a.includes(xId);
  const hasXInB = fInputPortToNodes.b.includes(xId);
  if (!hasXInA && !hasXInB) {
    return "0";
  }
  return "1";
}
`;

const SUBTRACT_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for subtract:
 * \`\`\`json
 * {
 *   "a": ["0"],
 *   "b": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for subtract:
 * \`\`\`json
 * {
 *   "0": "0.2",
 *   "1": "0.4"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "-0.2" because
 * f(a, b) = a - b = 0.2 - 0.4 = -0.2.
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
  const y = a - b;
  return \`\${y}\`;
}
`;

const SUBTRACT_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for subtract:
 * \`\`\`json
 * {
 *   "a": ["0"],
 *   "b": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for subtract:
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
 * the above example data and assume xId is "1", then the value is "-1"
 * since f(a, b) = a - b and df/dx = df/db = -1.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.a.length !== 1) {
    throw new Error("Should have exactly 1 input node for port a");
  }
  if (fInputPortToNodes.b.length !== 1) {
    throw new Error("Should have exactly 1 input node for port b");
  }
  const hasXInA = fInputPortToNodes.a.includes(xId);
  const hasXInB = fInputPortToNodes.b.includes(xId);
  if (!hasXInA && !hasXInB) {
    return "0";
  }
  const df = hasXInA ? 1 : -1;
  return \`\${df}\`;
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
  if (fInputPortToNodes.a.length !== 1) {
    throw new Error("Should have exactly 1 input node for port a");
  }
  if (fInputPortToNodes.b.length !== 1) {
    throw new Error("Should have exactly 1 input node for port b");
  }
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

const DIVIDE_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for divide:
 * \`\`\`json
 * {
 *   "a": ["0"],
 *   "b": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for divide:
 * \`\`\`json
 * {
 *   "0": "0.2",
 *   "1": "0.4"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0.5" because
 * f(a, b) = a / b = 0.2 / 0.4 = 0.5.
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
  const y = a / b;
  return \`\${y}\`;
}
`;

const DIVIDE_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for divide:
 * \`\`\`json
 * {
 *   "a": ["0"],
 *   "b": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for divide:
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
 * the above example data and assume xId is "1", then the value is "-1.25"
 * since f(a, b) = a / b and df/dx = df/db = -(a / b^2) = -1.25.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.a.length !== 1) {
    throw new Error("Should have exactly 1 input node for port a");
  }
  if (fInputPortToNodes.b.length !== 1) {
    throw new Error("Should have exactly 1 input node for port b");
  }
  const hasXInA = fInputPortToNodes.a.includes(xId);
  const hasXInB = fInputPortToNodes.b.includes(xId);
  if (!hasXInA && !hasXInB) {
    return "0";
  }
  const aInputNodeId = fInputPortToNodes.a[0];
  const bInputNodeId = fInputPortToNodes.b[0];
  const a = parseFloat(fInputNodeToValues[aInputNodeId]);
  const b = parseFloat(fInputNodeToValues[bInputNodeId]);
  const df = hasXInA ? 1 / b : -(a / Math.pow(b, 2));
  return \`\${df}\`;
}
`;

const POWER_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for power:
 * \`\`\`json
 * {
 *   "x": ["0"],
 *   "n": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for power:
 * \`\`\`json
 * {
 *   "0": "2",
 *   "1": "3"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "8" because
 * f(x, n) = x ^ n = 2 ^ 3 = 8.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (fInputPortToNodes.n.length !== 1) {
    throw new Error("Should have exactly 1 input node for port n");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const nInputNodeId = fInputPortToNodes.n[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const n = parseFloat(fInputNodeToValues[nInputNodeId]);
  const y = Math.pow(x, n);
  return \`\${y}\`;
}
`;

const POWER_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for power:
 * \`\`\`json
 * {
 *   "x": ["0"],
 *   "n": ["1"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for power:
 * \`\`\`json
 * {
 *   "0": "2",
 *   "1": "3"
 * }
 * \`\`\`
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * - x is not on the forward/reverse differentiation path (i.e., gradient of x
 *   doesn't flow through f node)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume xId is "0", then the value is "-1.25"
 * since f(x, n) = x ^ n and df/dx = n * (x ^ (n - 1)) = 3 * (2 ^ (3 - 1)) =
 * 12.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (fInputPortToNodes.n.length !== 1) {
    throw new Error("Should have exactly 1 input node for port n");
  }
  const hasXInX = fInputPortToNodes.x.includes(xId);
  const hasXInN = fInputPortToNodes.n.includes(xId);
  if (!hasXInX && !hasXInN) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const nInputNodeId = fInputPortToNodes.n[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const n = parseFloat(fInputNodeToValues[nInputNodeId]);
  const df = hasXInX ? n * Math.pow(x, n - 1) : Math.pow(x, n) * Math.log(x);
  return \`\${df}\`;
}
`;

const EXP_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for exp:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for exp:
 * \`\`\`json
 * {
 *   "0": "0"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "1" because
 * f(x) = e^x = e^0 = 1.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const y = Math.exp(x);
  return \`\${y}\`;
}
`;

const EXP_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for exp:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for exp:
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
 * the above example data and assume xId is "0", then the value is "1"
 * since f(x) = e^x and df/dx = e^x = e^0 = 1
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const df = Math.exp(x);
  return \`\${df}\`;
}
`;

const LN_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for ln:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for ln:
 * \`\`\`json
 * {
 *   "0": "1"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0" because
 * f(x) = ln(x) = ln(1) = 0.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const y = Math.log(x);
  return \`\${y}\`;
}
`;

const LN_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for ln:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for ln:
 * \`\`\`json
 * {
 *   "0": "1"
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
 * since f(x) = ln(x) and df/dx = 1 / x = 1 / 1 = 1
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const df = 1 / x;
  return \`\${df}\`;
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

const SIN_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for sin:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for sin:
 * \`\`\`json
 * {
 *   "0": "0"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0" because
 * f(x) = sin(x) = sin(0) = 0.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const y = Math.sin(x);
  return \`\${y}\`;
}
`;

const SIN_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for sin:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for sin:
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
 * the above example data and assume xId is "0", then the value is "1"
 * since f(x) = sin(x) and df/dx = cos(x) = 1.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const df = Math.cos(x);
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
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const df = -Math.sin(x);
  return \`\${df}\`;
}
`;

const TAN_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for tan:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for tan:
 * \`\`\`json
 * {
 *   "0": "0"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0" because
 * f(x) = tan(x) = tan(0) = 0.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const y = Math.tan(x);
  return \`\${y}\`;
}
`;

const TAN_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for tan:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for tan:
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
 * the above example data and assume xId is "0", then the value is "1"
 * since f(x) = tan(x) and df/dx = 1 / cos(x)^2 = 1.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const df = 1 / Math.pow(Math.cos(x), 2);
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
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  return "1";
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
 * the above example data and assume xId is "0", then the value is "3"
 * since f(x) = sigmoid(x) and df/dx = sigmoid(x) * (1 - sigmoid(x)) =
 * 0.5 * (1 - 0.5) = 0.25.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const sigmoid = 1 / (1 + Math.exp(-x));
  const df = sigmoid * (1 - sigmoid);
  return \`\${df}\`;
}
`;

const TANH_F_CODE = `\
/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for tanh:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for tanh:
 * \`\`\`json
 * {
 *   "0": "0"
 * }
 * \`\`\`
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "0" because
 * f(x) = (e^x - e^(-x)) / (e^x + e^(-x)) = (e^0 - e^0) / (e^0 + e^0) = 0 / 2 =
 * 0.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const y = (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
  return \`\${y}\`;
}
`;

const TANH_DFDX_CODE = `\
/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for tanh:
 * \`\`\`json
 * {
 *   "x": ["0"]
 * }
 * \`\`\`
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for tanh:
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
 * the above example data and assume xId is "0", then the value is "1"
 * since f(x) = tanh(x) and df/dx = 1 - tanh(x)^2 = 1 - 0^2 = 1
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const tanh = (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
  const df = 1 - Math.pow(tanh, 2);
  return \`\${df}\`;
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
  if (fInputPortToNodes.x.length !== 1) {
    throw new Error("Should have exactly 1 input node for port x");
  }
  if (!fInputPortToNodes.x.includes(xId)) {
    return "0";
  }
  const xInputNodeId = fInputPortToNodes.x[0];
  const x = parseFloat(fInputNodeToValues[xInputNodeId]);
  const df = x > 0 ? 1 : 0;
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
  if (fInputPortToNodes.y_t.length !== 1) {
    throw new Error("Should have exactly 1 input node for port y_t");
  }
  if (fInputPortToNodes.y_e.length !== 1) {
    throw new Error("Should have exactly 1 input node for port y_e");
  }
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

const BINARY_CROSS_ENTROPY_F_CODE = `\
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
 * the above example data, then the value is "-0.693" because
 * f(y_t, y_e) = y_t * log(y_e) + (1 - y_t) * log(1 - y_e) =
 * 0 * log(0.5) + (1 - 0) * log(1 - 0.5) ~= -0.693.
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
  const y = yTrue * Math.log(yEstimate) + (1 - yTrue) * Math.log(1 - yEstimate);
  return \`\${y}\`;
}
`;

const BINARY_CROSS_ENTROPY_DFDX_CODE = `\
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
 * the above example data and assume xId is "0", then the value is "-1.386"
 * since f(y_t, y_e) = y_t * log(y_e) + (1 - y_t) * log(1 - y_e) and
 * df/d(y_t) = log(y_e) - log(1 - y_e) = log(0.5) - log(1 - 0.5) ~= -1.386.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  if (fInputPortToNodes.y_t.length !== 1) {
    throw new Error("Should have exactly 1 input node for port y_t");
  }
  if (fInputPortToNodes.y_e.length !== 1) {
    throw new Error("Should have exactly 1 input node for port y_e");
  }
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
    df = Math.log(yEstimate) - Math.log(1 - yEstimate);
  } else {
    df = (yTrue - yEstimate) / (yEstimate - Math.pow(yEstimate, 2));
  }
  return \`\${df}\`;
}
`;

export {
  ADD_DFDX_CODE,
  ADD_F_CODE,
  BINARY_CROSS_ENTROPY_DFDX_CODE,
  BINARY_CROSS_ENTROPY_F_CODE,
  COS_DFDX_CODE,
  COS_F_CODE,
  DIVIDE_DFDX_CODE,
  DIVIDE_F_CODE,
  EXP_DFDX_CODE,
  EXP_F_CODE,
  IDENTITY_DFDX_CODE,
  IDENTITY_F_CODE,
  LN_DFDX_CODE,
  LN_F_CODE,
  MULTIPLY_DFDX_CODE,
  MULTIPLY_F_CODE,
  POWER_DFDX_CODE,
  POWER_F_CODE,
  PRODUCT_DFDX_CODE,
  PRODUCT_F_CODE,
  RELU_DFDX_CODE,
  RELU_F_CODE,
  SIGMOID_DFDX_CODE,
  SIGMOID_F_CODE,
  SIN_DFDX_CODE,
  SIN_F_CODE,
  SQUARED_ERROR_DFDX_CODE,
  SQUARED_ERROR_F_CODE,
  SUBTRACT_DFDX_CODE,
  SUBTRACT_F_CODE,
  SUM_DFDX_CODE,
  SUM_F_CODE,
  TANH_DFDX_CODE,
  TANH_F_CODE,
  TAN_DFDX_CODE,
  TAN_F_CODE,
  TEMPLATE_DFDX_CODE,
  TEMPLATE_F_CODE,
};
