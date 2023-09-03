import type ChainRuleTerm from "../core/ChainRuleTerm";
import type ExplainDerivativeItem from "./ExplainDerivativeItem";
import type ExplainDerivativeType from "./ExplainDerivativeType";

const buildExplainDerivativeItems = (
  nodeId: string,
  nodeDerivative: string,
  targetNodeId: string,
  isReverseMode: boolean,
  explainDerivativeType: ExplainDerivativeType,
  chainRuleTerms: ChainRuleTerm[],
): ExplainDerivativeItem[] => {
  // TODO(sc420): Reduce duplicated code
  if (explainDerivativeType === "oneBecauseXEqualsF") {
    return [
      {
        descriptionParts: [
          {
            type: "text",
            text: "Calculate the partial derivative:",
          },
        ],
        latex: buildPartialDerivativeSubject(
          nodeId,
          targetNodeId,
          isReverseMode,
        ),
      },
      {
        descriptionParts: [
          {
            type: "text",
            text: "Which is 1 because target is itself:",
          },
        ],
        latex: "\\displaystyle 1",
      },
    ];
  }

  if (explainDerivativeType === "zeroBecauseFNotDependsOnX") {
    return [
      {
        descriptionParts: [
          {
            type: "text",
            text: "Calculate the partial derivative:",
          },
        ],
        latex: buildPartialDerivativeSubject(
          nodeId,
          targetNodeId,
          isReverseMode,
        ),
      },
      {
        descriptionParts: [
          {
            type: "text",
            text: "Which is 0 because target doesn't depend on x:",
          },
        ],
        latex: "\\displaystyle 0",
      },
    ];
  }

  return [
    {
      descriptionParts: [
        {
          type: "text",
          text: "Calculate the partial derivative:",
        },
      ],
      latex: buildPartialDerivativeSubject(nodeId, targetNodeId, isReverseMode),
    },
    {
      descriptionParts: [
        {
          type: "text",
          text: "Use the chain rule:",
        },
      ],
      latex: buildRawChainRuleLatex(
        nodeId,
        targetNodeId,
        isReverseMode,
        chainRuleTerms,
      ),
    },
    {
      descriptionParts: [
        {
          type: "text",
          text: buildChainRuleWithPreviousCalculatedDerivativesLatexDescription(
            isReverseMode,
          ),
        },
      ],
      latex: buildChainRuleWithPreviousCalculatedDerivativesLatex(
        nodeId,
        isReverseMode,
        chainRuleTerms,
      ),
    },
    {
      descriptionParts: [
        {
          type: "text",
          text: buildChainRuleWithReplacedValuesDescription(isReverseMode),
        },
      ],
      latex: buildChainRuleWithReplacedValuesLatex(
        isReverseMode,
        chainRuleTerms,
      ),
    },
    {
      descriptionParts: [
        {
          type: "text",
          text: "Which is equal to:",
        },
      ],
      latex: `\\displaystyle ${nodeDerivative}`,
    },
  ];
};

const buildPartialDerivativeSubject = (
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
): string => {
  const derivative = isReverseMode
    ? buildPartialDerivativeLatex(targetNodeId, nodeId)
    : buildPartialDerivativeLatex(nodeId, targetNodeId);
  return `\\displaystyle ${derivative}`;
};

const buildRawChainRuleLatex = (
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
  chainRuleTerms: ChainRuleTerm[],
): string => {
  const multiplicationTerms = chainRuleTerms.map((chainRuleTerm) => {
    let derivative1: string;
    let derivative2: string;
    if (isReverseMode) {
      derivative1 = buildPartialDerivativeLatex(
        chainRuleTerm.neighborNodeId,
        nodeId,
      );
      derivative2 = buildPartialDerivativeLatex(
        targetNodeId,
        chainRuleTerm.neighborNodeId,
      );
    } else {
      derivative1 = buildPartialDerivativeLatex(
        chainRuleTerm.neighborNodeId,
        targetNodeId,
      );
      derivative2 = buildPartialDerivativeLatex(
        nodeId,
        chainRuleTerm.neighborNodeId,
      );
    }
    return `${derivative1} \\cdot ${derivative2}`;
  });
  const expression = multiplicationTerms.join("+");
  return `\\displaystyle =${expression}`;
};

const buildChainRuleWithPreviousCalculatedDerivativesLatexDescription = (
  isReversedMode: boolean,
): string => {
  const side = isReversedMode ? "right" : "left";
  // TODO(sc420): Build links
  return `Replace ${side}-hand side ... with previously calculated value(s):`;
};

const buildChainRuleWithPreviousCalculatedDerivativesLatex = (
  nodeId: string,
  isReverseMode: boolean,
  chainRuleTerms: ChainRuleTerm[],
): string => {
  const multiplicationTerms = chainRuleTerms.map((chainRuleTerm) => {
    let derivative1: string;
    let derivative2: string;
    if (isReverseMode) {
      derivative1 = buildPartialDerivativeLatex(
        chainRuleTerm.neighborNodeId,
        nodeId,
      );
      derivative2 = chainRuleTerm.derivativeRegardingTarget;
    } else {
      derivative1 = chainRuleTerm.derivativeRegardingTarget;
      derivative2 = buildPartialDerivativeLatex(
        nodeId,
        chainRuleTerm.neighborNodeId,
      );
    }
    return `${derivative1} \\cdot ${derivative2}`;
  });
  const expression = multiplicationTerms.join("+");
  return `\\displaystyle =${expression}`;
};

const buildChainRuleWithReplacedValuesDescription = (
  isReversedMode: boolean,
): string => {
  const side = isReversedMode ? "left" : "right";
  return `Calculate ${side}-hand side derivative(s):`;
};

const buildChainRuleWithReplacedValuesLatex = (
  isReverseMode: boolean,
  chainRuleTerms: ChainRuleTerm[],
): string => {
  const multiplicationTerms = chainRuleTerms.map((chainRuleTerm) => {
    let derivative1: string;
    let derivative2: string;
    if (isReverseMode) {
      derivative1 = chainRuleTerm.derivativeRegardingCurrent;
      derivative2 = chainRuleTerm.derivativeRegardingTarget;
    } else {
      derivative1 = chainRuleTerm.derivativeRegardingTarget;
      derivative2 = chainRuleTerm.derivativeRegardingCurrent;
    }
    return `${derivative1} \\cdot ${derivative2}`;
  });
  const expression = multiplicationTerms.join("+");
  return `\\displaystyle =${expression}`;
};

const buildPartialDerivativeLatex = (
  numerator: string,
  denominator: string,
): string => {
  return `\\frac{\\partial{${numerator}}}{\\partial{${denominator}}}`;
};

export { buildExplainDerivativeItems };
