/*
 * These code serve as the template for `BuildInCode.ts` because we would lose
 * syntax highlighting by wrapping these code in string literals. We use this
 * file to check if the comments look good.
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Calculates f().
 * @param {Record<string, string[]>} fInputPortToNodes An object where the keys
 * are port IDs and the values are node IDs of the connected input nodes.
 * Example data for product:
 * ```json
 * {
 *   "x_i": ["1", "2", "3"]
 * }
 * ```
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * ```json
 * {
 *   "1": "1",
 *   "2": "2",
 *   "3": "3"
 * }
 * ```
 * @returns {string} Evaluated f value. For example: if we consider
 * the above example data, then the value is "6" because
 * f([v1, v2, v3]) = v1 * v2 * v3 = 1 * 2 * 3 = 6.
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
 * ```json
 * {
 *   "x_i": ["1", "2", "3"]
 * }
 * ```
 * @param {Record<string, string>} fInputNodeToValues An object where the keys
 * are node IDs and the values are node values of the connected input nodes.
 * Example data for product:
 * ```json
 * {
 *   "1": "1",
 *   "2": "2",
 *   "3": "3"
 * }
 * ```
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
