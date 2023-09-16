import type ChainRuleTerm from "../core/ChainRuleTerm";
import type DifferentiationMode from "../core/DifferentiationMode";
import type ExplainDerivativeDescriptionType from "./ExplainDerivativeDescriptionType";
import type ExplainDerivativeItem from "./ExplainDerivativeItem";
import type ExplainDerivativeType from "./ExplainDerivativeType";

type ChainRuleType = "raw" | "previousDerivativesReplaced" | "allReplaced";

const buildExplainDerivativeItems = (
  explainDerivativeType: ExplainDerivativeType,
  nodeId: string,
  nodeDerivative: string,
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
  chainRuleTerms: ChainRuleTerm[],
): ExplainDerivativeItem[] => {
  switch (explainDerivativeType) {
    case "someValueBecauseChainRule": {
      return buildChainRuleItems(
        nodeId,
        nodeDerivative,
        differentiationMode,
        targetNodeId,
        chainRuleTerms,
      );
    }
    case "oneBecauseFEqualsX": {
      return buildOneBecauseFEqualsXItems(
        nodeId,
        differentiationMode,
        targetNodeId,
      );
    }
    case "zeroBecauseFNotDependsOnX": {
      return buildZeroBecauseFNotDependsOnXItems(
        nodeId,
        differentiationMode,
        targetNodeId,
      );
    }
    case "zeroBecauseXIsConstant": {
      return buildZeroBecauseXIsConstantItems(
        nodeId,
        differentiationMode,
        targetNodeId,
      );
    }
  }
};

const buildOneBecauseFEqualsXItems = (
  nodeId: string,
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(nodeId, differentiationMode, targetNodeId),
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
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(nodeId, differentiationMode, targetNodeId),
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
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(nodeId, differentiationMode, targetNodeId),
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
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
  chainRuleTerms: ChainRuleTerm[],
): ExplainDerivativeItem[] => {
  return [
    buildCalculateDerivativeItem(nodeId, differentiationMode, targetNodeId),
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
        differentiationMode,
        targetNodeId,
        chainRuleTerms,
      ),
    },
    {
      type: "previousDerivativesReplaced",
      descriptionParts: buildPreviousDerivativesReplacedDescription(
        differentiationMode,
        targetNodeId,
        chainRuleTerms,
      ),
      latex: buildChainRuleLatex(
        "previousDerivativesReplaced",
        nodeId,
        differentiationMode,
        targetNodeId,
        chainRuleTerms,
      ),
    },
    {
      type: "allReplaced",
      descriptionParts: buildAllReplacedDescription(differentiationMode),
      latex: buildChainRuleLatex(
        "allReplaced",
        nodeId,
        differentiationMode,
        targetNodeId,
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
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
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
    latex: buildPartialDerivativeSubject(
      nodeId,
      differentiationMode,
      targetNodeId,
    ),
  };
};

const buildPartialDerivativeSubject = (
  nodeId: string,
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
): string => {
  const derivative =
    differentiationMode === "REVERSE"
      ? buildPartialDerivativeLatex(targetNodeId, nodeId)
      : buildPartialDerivativeLatex(nodeId, targetNodeId);
  return `\\displaystyle ${derivative}`;
};

const buildPreviousDerivativesReplacedDescription = (
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
  chainRuleTerms: ChainRuleTerm[],
): ExplainDerivativeDescriptionType[] => {
  const side = differentiationMode === "REVERSE" ? "right" : "left";
  const previousDerivativeTerms: ExplainDerivativeDescriptionType[] =
    chainRuleTerms.map((chainRuleTerm) => {
      let derivative: string;
      if (differentiationMode === "REVERSE") {
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
      text: `Replace the ${side}-hand side `,
    },
    ...commaListParts,
    {
      type: "text",
      id: "with",
      text: " with the previously calculated value(s):",
    },
  ];
};

const buildAllReplacedDescription = (
  differentiationMode: DifferentiationMode,
): ExplainDerivativeDescriptionType[] => {
  const side = differentiationMode === "REVERSE" ? "left" : "right";
  return [
    {
      type: "text",
      id: "mainText",
      text: `Calculate the ${side}-hand side derivative(s):`,
    },
  ];
};

const buildChainRuleLatex = (
  chainRuleType: ChainRuleType,
  nodeId: string,
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
  chainRuleTerms: ChainRuleTerm[],
): string => {
  const multiplicationTerms = buildChainRuleMultiplicationTerms(
    chainRuleType,
    nodeId,
    differentiationMode,
    targetNodeId,
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
  differentiationMode: DifferentiationMode,
  targetNodeId: string,
  chainRuleTerms: ChainRuleTerm[],
): string[] => {
  return chainRuleTerms.map((chainRuleTerm) => {
    let derivative1: string;
    let derivative2: string;
    if (differentiationMode === "REVERSE") {
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
