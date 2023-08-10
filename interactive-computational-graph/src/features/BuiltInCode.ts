const TEMPLATE_F_CODE = `\
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and
 * node data as the values. Example data for sum:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @returns {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  // Example product code, please write your logic below
  let product = 1;
  Object.values(portToNodes.x_i).forEach((nodeData) => {
    product *= nodeData.value;
  });
  return product;
}
`;

const TEMPLATE_DFDY_CODE = `\
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. y will not be a constant node. y will not be the
 * current node. Example data for product: { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above
 * example data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  // Example product code, please write your logic below
  if (!(y.id in portToNodes.x_i)) {
    return 0;
  }

  let df = 1;
  Object.values(portToNodes.x_i).forEach((nodeData) => {
    if (nodeData.id !== y.id) {
      df *= nodeData.value;
    }
  });
  return df;
}
`;

const SUM_F_CODE = `\
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and
 * node data as the values. Example data for sum:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @returns {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  let sum = 0;
  Object.values(portToNodes.x_i).forEach((nodeData) => {
    sum += nodeData.value;
  });
  return sum;
}
`;

const SUM_DFDY_CODE = `\
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. y will not be a constant node. y will not be the
 * current node. Example data for product: { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above
 * example data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  if (!(y.id in portToNodes.x_i)) {
    return 0;
  }

  return 1;
}
`;

const PRODUCT_F_CODE = `\
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and
 * node data as the values. Example data for sum: 
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @returns {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  let product = 1;
  Object.values(portToNodes.x_i).forEach((nodeData) => {
    product *= nodeData.value;
  });
  return product;
}
`;

const PRODUCT_DFDY_CODE = `\
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. y will not be a constant node. y will not be the
 * current node. Example data for product: { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above
 * example data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  if (!(y.id in portToNodes.x_i)) {
    return 0;
  }

  let df = 1;
  Object.values(portToNodes.x_i).forEach((nodeData) => {
    if (nodeData.id !== y.id) {
      df *= nodeData.value;
    }
  });
  return df;
}
`;

const IDENTITY_F_CODE = `\
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and
 * node data as the values. Example data for sum:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @returns {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  const nodeData = Object.values(portToNodes.x);
  if (nodeData.length !== 1) {
    throw new Error("Should have exactly 1 node data for port x");
  }
  const x = nodeData[0].value;
  return x;
}
`;

const IDENTITY_DFDY_CODE = `\
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. y will not be a constant node. y will not be the
 * current node. Example data for product: { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above
 * example data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  if (!(y.id in portToNodes.x)) {
    return 0;
  }

  return 1;
}
`;

const RELU_F_CODE = `\
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and
 * node data as the values. Example data for sum:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @returns {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  const nodeData = Object.values(portToNodes.x);
  if (nodeData.length !== 1) {
    throw new Error("Should have exactly 1 node data for port x");
  }
  return Math.max(0, nodeData[0].value);
}
`;

const RELU_DFDY_CODE = `\
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. y will not be a constant node. y will not be the
 * current node. Example data for product: { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above
 * example data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  if (!(y.id in portToNodes.x)) {
    return 0;
  }

  const nodeData = Object.values(portToNodes.x);
  if (nodeData.length !== 1) {
    throw new Error("Should have exactly 1 node data for port x");
  }
  const x = nodeData[0].value;
  return x > 0 ? 1 : 0;
}
`;

const SIGMOID_F_CODE = `\
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and
 * node data as the values. Example data for sum:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @returns {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  const nodeData = Object.values(portToNodes.x);
  if (nodeData.length !== 1) {
    throw new Error("Should have exactly 1 node data for port x");
  }
  const x = nodeData[0].value;
  return 1 / (1 + Math.exp(-x));
}
`;

const SIGMOID_DFDY_CODE = `\
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. y will not be a constant node. y will not be the
 * current node. Example data for product: { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above
 * example data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  if (!(y.id in portToNodes.x)) {
    return 0;
  }

  const nodeData = Object.values(portToNodes.x);
  if (nodeData.length !== 1) {
    throw new Error("Should have exactly 1 node data for port x");
  }
  const x = nodeData[0].value;
  const sigmoid = 1 / (1 + Math.exp(-x));
  return sigmoid * (1 - sigmoid);
}
`;

const SQUARED_ERROR_F_CODE = `\
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and
 * node data as the values. Example data for sum:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @returns {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  const nodeDataTrue = Object.values(portToNodes.y_true);
  if (nodeDataTrue.length !== 1) {
    throw new Error("Should have exactly 1 node data for port y_true");
  }
  const nodeDataEstimate = Object.values(portToNodes.y_estimate);
  if (nodeDataEstimate.length !== 1) {
    throw new Error("Should have exactly 1 node data for port y_estimate");
  }
  const yTrue = nodeDataTrue[0].value;
  const yEstimate = nodeDataEstimate[0].value;
  return Math.pow(yTrue - yEstimate, 2);
}
`;

const SQUARED_ERROR_DFDY_CODE = `\
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. y will not be a constant node. y will not be the
 * current node. Example data for product: { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above
 * example data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  if (!(y.id in portToNodes.y_estimate)) {
    return 0;
  }

  const nodeDataTrue = Object.values(portToNodes.y_true);
  if (nodeDataTrue.length !== 1) {
    throw new Error("Should have exactly 1 node data for port y_true");
  }
  const nodeDataEstimate = Object.values(portToNodes.y_estimate);
  if (nodeDataEstimate.length !== 1) {
    throw new Error("Should have exactly 1 node data for port y_estimate");
  }
  const yTrue = nodeDataTrue[0].value;
  const yEstimate = nodeDataEstimate[0].value;
  return 2 * (yEstimate - yTrue);
}
`;

export {
  TEMPLATE_F_CODE,
  TEMPLATE_DFDY_CODE,
  SUM_F_CODE,
  SUM_DFDY_CODE,
  PRODUCT_F_CODE,
  PRODUCT_DFDY_CODE,
  IDENTITY_F_CODE,
  IDENTITY_DFDY_CODE,
  RELU_F_CODE,
  RELU_DFDY_CODE,
  SIGMOID_F_CODE,
  SIGMOID_DFDY_CODE,
  SQUARED_ERROR_F_CODE,
  SQUARED_ERROR_DFDY_CODE,
};
