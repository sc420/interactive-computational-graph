interface ChainRuleTerm {
  neighborNodeId: string;
  // Derivative value with regard to target node
  derivativeRegardingTarget: string;
  // Derivative value with regard to current node
  derivativeRegardingCurrent: string;
}

export default ChainRuleTerm;
