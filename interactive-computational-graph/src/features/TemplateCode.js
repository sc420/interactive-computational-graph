/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * ```javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * ```
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * ```javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * ```
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * `f({v1, v3, v2}) = v1 * v3 * v2 = 1 * 3 * 2 = 6`.
 */
function f(fInputPortToNodes, fInputNodeToValues) {
  // Write the logic here
  return "0"; // returns string instead of number
}

/**
 * Calculates df/dx.
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * ```javascript
 * {
 *   x_i: ["v1", "v3", "v2"]
 * }
 * ```
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * ```javascript
 * {
 *   v1: "1",
 *   v3: "3",
 *   v2: "2",
 * }
 * ```
 * @param {string} xId Node ID of x. Note that the framework will not call this
 * function for the following cases:
 * - x is a constant node (i.e., x will always be a variable)
 * - x is the node of f (i.e., the derivative is always 1)
 * @returns {string} Evaluated derivative df/dy. For example, if we consider
 * the above example data and assume `xId` is "v2", then the value is "3"
 * since `f = v1 * v3 * v2` and `df/dx = v1 * v3 = 3`.
 */
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  // Write the logic here
  return "0"; // returns string instead of number
}
