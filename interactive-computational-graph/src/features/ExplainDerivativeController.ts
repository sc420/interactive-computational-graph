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
      descriptionParts: [
        {
          type: "text",
          text: "Which is 1 because derivative target is ",
        },
        {
          type: "latex",
          latex: nodeId,
        },
        {
          type: "text",
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
      descriptionParts: [
        {
          type: "text",
          text: "Which is 0 because derivative target doesn't depend on ",
        },
        {
          type: "latex",
          latex: nodeId,
        },
        {
          type: "text",
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
      descriptionParts: [
        {
          type: "text",
          text: "Which is 0 because ",
        },
        {
          type: "latex",
          latex: nodeId,
        },
        {
          type: "text",
          text: " is constant:",
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
      descriptionParts: [
        {
          type: "text",
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

const buildCalculateDerivativeItem = (
  nodeId: string,
  targetNodeId: string,
  isReverseMode: boolean,
): ExplainDerivativeItem => {
  return {
    descriptionParts: [
      {
        type: "text",
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
        latex: derivative,
        nodeId: chainRuleTerm.neighborNodeId,
      };
    });

  const commaListParts: ExplainDerivativeDescriptionType[] = [];
  previousDerivativeTerms.forEach((previousDerivativeTerm, index) => {
    if (index > 0) {
      commaListParts.push({
        type: "text",
        text: index === previousDerivativeTerms.length - 1 ? " and " : ", ",
      });
    }
    commaListParts.push(previousDerivativeTerm);
  });

  return [
    {
      type: "text",
      text: `Replace ${side}-hand side `,
    },
    ...commaListParts,
    {
      type: "text",
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
