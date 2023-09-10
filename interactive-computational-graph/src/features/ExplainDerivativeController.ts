import type ChainRuleTerm from "../core/ChainRuleTerm";
import type ExplainDerivativeDescriptionType from "./ExplainDerivativeDescriptionType";
import type ExplainDerivativeItem from "./ExplainDerivativeItem";
import type ExplainDerivativeType from "./ExplainDerivativeType";

type ChainRuleType = "raw" | "previousDerivativesReplaced" | "allReplaced";

const buildExplainDerivativeItems = (
  explainDerivativeType: ExplainDerivativeType,
  nodeId: string,
  nodeDerivative: string,
  targetNodeId: string,
  isReverseMode: boolean,
  chainRuleTerms: ChainRuleTerm[],
): ExplainDerivativeItem[] => {
  switch (explainDerivativeType) {
    case "someValueBecauseChainRule": {
      return buildChainRuleItems(
        nodeId,
        nodeDerivative,
        targetNodeId,
        isReverseMode,
        chainRuleTerms,
      );
    }
    case "oneBecauseFEqualsX": {
      return buildOneBecauseFEqualsXItems(nodeId, targetNodeId, isReverseMode);
    }
    case "zeroBecauseFNotDependsOnX": {
      return buildZeroBecauseFNotDependsOnXItems(
        nodeId,
        targetNodeId,
        isReverseMode,
      );
    }
    case "zeroBecauseXIsConstant": {
      return buildZeroBecauseXIsConstantItems(
        nodeId,
        targetNodeId,
        isReverseMode,
      );
    }
  }
};

const buildOneBecauseFEqualsXItems = (
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(nodeId, targetNodeId, isReverseMode),
    {
      type: "oneBecauseFEqualsX",
      descriptionParts: [
        {
          type: "text",
          id: "which",
          text: "Which is ",
        },
        {
          type: "latex",
          id: "value",
          latex: "1",
        },
        {
          type: "text",
          id: "because",
          text: " because the derivative target is ",
        },
        {
          type: "latex",
          id: "node",
          latex: nodeId,
        },
        {
          type: "text",
          id: "colon",
          text: ":",
        },
      ],
      latex: "\\displaystyle 1",
    },
  ];
};

const buildZeroBecauseFNotDependsOnXItems = (
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(nodeId, targetNodeId, isReverseMode),
    {
      type: "zeroBecauseFNotDependsOnX",
      descriptionParts: [
        {
          type: "text",
          id: "which",
          text: "Which is ",
        },
        {
          type: "latex",
          id: "value",
          latex: "0",
        },
        {
          type: "text",
          id: "because",
          text: " because the derivative target doesn't depend on ",
        },
        {
          type: "latex",
          id: "node",
          latex: nodeId,
        },
        {
          type: "text",
          id: "colon",
          text: ":",
        },
      ],
      latex: "\\displaystyle 0",
    },
  ];
};

const buildZeroBecauseXIsConstantItems = (
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(nodeId, targetNodeId, isReverseMode),
    {
      type: "zeroBecauseXIsConstant",
      descriptionParts: [
        {
          type: "text",
          id: "which",
          text: "Which is ",
        },
        {
          type: "latex",
          id: "value",
          latex: "0",
        },
        {
          type: "text",
          id: "because",
          text: " because ",
        },
        {
          type: "latex",
          id: "node",
          latex: nodeId,
        },
        {
          type: "text",
          id: "is",
          text: " is a constant:",
        },
      ],
      latex: "\\displaystyle 0",
    },
  ];
};

const buildChainRuleItems = (
  nodeId: string,
  nodeDerivative: string,
  targetNodeId: string,
  isReverseMode: boolean,
  chainRuleTerms: ChainRuleTerm[],
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(nodeId, targetNodeId, isReverseMode),
    {
      type: "useChainRule",
      descriptionParts: [
        {
          type: "text",
          id: "mainText",
          text: "Use the chain rule:",
        },
      ],
      latex: buildChainRuleLatex(
        "raw",
        nodeId,
        targetNodeId,
        isReverseMode,
        chainRuleTerms,
      ),
    },
    {
      type: "previousDerivativesReplaced",
      descriptionParts: buildPreviousDerivativesReplacedDescription(
        targetNodeId,
        isReverseMode,
        chainRuleTerms,
      ),
      latex: buildChainRuleLatex(
        "previousDerivativesReplaced",
        nodeId,
        targetNodeId,
        isReverseMode,
        chainRuleTerms,
      ),
    },
    {
      type: "allReplaced",
      descriptionParts: buildAllReplacedDescription(isReverseMode),
      latex: buildChainRuleLatex(
        "allReplaced",
        nodeId,
        targetNodeId,
        isReverseMode,
        chainRuleTerms,
      ),
    },
    {
      type: "equalTo",
      descriptionParts: [
        {
          type: "text",
          id: "mainText",
          text: "Which is equal to:",
        },
      ],
      latex: `\\displaystyle ${nodeDerivative}`,
    },
  ];
};

const buildCalculateDerivativeItem = (
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
): ExplainDerivativeItem => {
  return {
    type: "calculatePartialDerivative",
    descriptionParts: [
      {
        type: "text",
        id: "mainText",
        text: "Calculate the partial derivative:",
      },
    ],
    latex: buildPartialDerivativeSubject(nodeId, targetNodeId, isReverseMode),
  };
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

const buildPreviousDerivativesReplacedDescription = (
  targetNodeId: string,
  isReversedMode: boolean,
  chainRuleTerms: ChainRuleTerm[],
): ExplainDerivativeDescriptionType[] => {
  const side = isReversedMode ? "right" : "left";
  const previousDerivativeTerms: ExplainDerivativeDescriptionType[] =
    chainRuleTerms.map((chainRuleTerm) => {
      let derivative: string;
      if (isReversedMode) {
        derivative = buildPartialDerivativeLatex(
          targetNodeId,
          chainRuleTerm.neighborNodeId,
        );
      } else {
        derivative = buildPartialDerivativeLatex(
          chainRuleTerm.neighborNodeId,
          targetNodeId,
        );
      }
      return {
        type: "latexLink",
        id: `chainRuleTerm-${chainRuleTerm.neighborNodeId}`,
        latex: derivative,
        nodeId: chainRuleTerm.neighborNodeId,
      };
    });

  const commaListParts: ExplainDerivativeDescriptionType[] = [];
  previousDerivativeTerms.forEach((previousDerivativeTerm, index) => {
    if (index > 0) {
      commaListParts.push({
        type: "text",
        id: `part-${index}`,
        text: index === previousDerivativeTerms.length - 1 ? " and " : ", ",
      });
    }
    commaListParts.push(previousDerivativeTerm);
  });

  return [
    {
      type: "text",
      id: "replace",
      text: `Replace ${side}-hand side `,
    },
    ...commaListParts,
    {
      type: "text",
      id: "with",
      text: " with previously calculated value(s):",
    },
  ];
};

const buildAllReplacedDescription = (
  isReversedMode: boolean,
): ExplainDerivativeDescriptionType[] => {
  const side = isReversedMode ? "left" : "right";
  return [
    {
      type: "text",
      id: "mainText",
      text: `Calculate ${side}-hand side derivative(s):`,
    },
  ];
};

const buildChainRuleLatex = (
  chainRuleType: ChainRuleType,
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
  chainRuleTerms: ChainRuleTerm[],
): string => {
  const multiplicationTerms = buildChainRuleMultiplicationTerms(
    chainRuleType,
    nodeId,
    targetNodeId,
    isReverseMode,
    chainRuleTerms,
  );
  const expression = multiplicationTerms.join("+");
  return `\\displaystyle =${expression}`;
};

const buildPartialDerivativeLatex = (
  numerator: string,
  denominator: string,
): string => {
  return `\\frac{\\partial{${numerator}}}{\\partial{${denominator}}}`;
};

const buildChainRuleMultiplicationTerms = (
  chainRuleType: ChainRuleType,
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
  chainRuleTerms: ChainRuleTerm[],
): string[] => {
  return chainRuleTerms.map((chainRuleTerm) => {
    let derivative1: string;
    let derivative2: string;
    if (isReverseMode) {
      derivative1 =
        chainRuleType === "allReplaced"
          ? chainRuleTerm.derivativeRegardingCurrent
          : buildPartialDerivativeLatex(chainRuleTerm.neighborNodeId, nodeId);
      derivative2 =
        chainRuleType === "raw"
          ? buildPartialDerivativeLatex(
              targetNodeId,
              chainRuleTerm.neighborNodeId,
            )
          : chainRuleTerm.derivativeRegardingTarget;
    } else {
      derivative1 =
        chainRuleType === "raw"
          ? buildPartialDerivativeLatex(
              chainRuleTerm.neighborNodeId,
              targetNodeId,
            )
          : chainRuleTerm.derivativeRegardingTarget;
      derivative2 =
        chainRuleType === "allReplaced"
          ? chainRuleTerm.derivativeRegardingCurrent
          : buildPartialDerivativeLatex(nodeId, chainRuleTerm.neighborNodeId);
    }
    return `${derivative1} \\cdot ${derivative2}`;
  });
};

export { buildExplainDerivativeItems };
